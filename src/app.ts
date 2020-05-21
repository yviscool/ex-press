import { join } from 'path';
import * as express from 'express';
import * as mixin from 'merge-descriptors';
import { ContainerLoader, MidwayContainer, MidwayHandlerKey, MidwayRequestContainer } from 'midway-core';

import { CONTROLLER_KEY, PRIORITY_KEY, RouterOption, WEB_ROUTER_KEY, WEB_ROUTER_PARAM_KEY, RouterParamValue, } from '@midwayjs/decorator';
import { listModule, getProviderId, getClassMetadata, getPropertyDataFromClass } from 'injection';

import { ExpressApplication, WebMiddleware } from './interface';
import { safelyGet } from './utils';
import { FileLoader } from './loader';

function isTypeScriptEnvironment() {
  return !!require.extensions['.ts'];
}

const rc = Symbol('Context#RequestContext');

export class Application implements ExpressApplication {
  appDir;
  baseDir;
  plugin;
  logger;
  loader: ContainerLoader;
  fileloder: FileLoader;

  private controllerIds: string[] = [];
  private prioritySortRouters: Array<{
    priority: number,
    router: any,
    prefix: any,
  }> = [];

  constructor(options: {
    baseDir?: string;
  } = {}) {
    const expressApp = express();

    mixin(this, expressApp);

    this.appDir = options.baseDir || process.cwd();
    this.baseDir = this.getBaseDir();

    this.loader = new ContainerLoader({
      baseDir: this.baseDir,
      isTsMode: true,
    });

    this.fileloder = new FileLoader({
      app: this,
      baseDir: this.appDir,
    });

    this.initialize();
  }

  initialize() {
    this.loader.initialize();

    this.loader.registerHook(MidwayHandlerKey.CONFIG, (key: string) => {
      return safelyGet(key, this.config);
    });

    this.loader.registerHook(MidwayHandlerKey.PLUGIN, (key: string) => {
      return this.plugin[key];
    });

    this.loader.registerHook(MidwayHandlerKey.LOGGER, (key: string) => {
      return this.logger[key];
    });

    this.loadExtend();
  }

  getBaseDir() {

    if (isTypeScriptEnvironment()) {
      return join(this.appDir, 'src');
    } else {
      return join(this.appDir, 'dist');
    }
  }

  async ready() {
    this.loader.loadDirectory();
    await this.loader.refresh();
  }

  loadExtend() {
    (this as any).use((req, res, next) => {
      req[rc] = new MidwayRequestContainer(this.applicationContext, req);
      next();
    });
  }

  async loadController() {
    const controllerModules = listModule(CONTROLLER_KEY);

    // implement @controller
    for (const module of controllerModules) {
      const providerId = getProviderId(module);

      if (providerId) {
        if (this.controllerIds.indexOf(providerId) > -1) {
          throw new Error(`controller identifier [${providerId}] is exists!`);
        }
        this.controllerIds.push(providerId);
        await this.preRegisterRouter(module, providerId);
      }
    }

    // implement @priority
    if (this.prioritySortRouters.length) {
      this.prioritySortRouters
        .sort((routerA, routerB) => routerB.priority - routerA.priority)
        .forEach(({ prefix, router }) => (this as any).use(prefix, router));
    }
  }

  protected async preRegisterRouter(target: any, controllerId: string): Promise<void> {
    const controllerOption = getClassMetadata(CONTROLLER_KEY, target);
    const newRouter = this.createRouter(controllerOption);

    if (newRouter) {
      // implement middleware in controller
      const middlewares = controllerOption.routerOptions.middleware;

      await this.handlerWebMiddleware(middlewares,middlewareImpl => {
        newRouter.use(middlewareImpl);
      });

      // implement @get @post
      const webRouterInfo: RouterOption[] = getClassMetadata(WEB_ROUTER_KEY, target);

      if (webRouterInfo && typeof webRouterInfo[Symbol.iterator] === 'function') {
        for (const webRouter of webRouterInfo) {
          // get middleware
          const middlewares2 = webRouter.middleware;
          const methodMiddlwares: any[] = [];

          await this.handlerWebMiddleware(middlewares2,middlewareImpl => {
            methodMiddlwares.push(middlewareImpl);
          });

          // implement @body @query @param @body
          const routeArgsInfo = getPropertyDataFromClass(WEB_ROUTER_PARAM_KEY, target, webRouter.method) || [];

          const routerArgs = [
            webRouter.path,
            ...methodMiddlwares,
            this.generateController(
              `${controllerId}.${webRouter.method}`,
              routeArgsInfo,
            ),
          ];

          // apply controller from request context
          newRouter[webRouter.requestMethod].apply(newRouter, routerArgs);
        }
      }

      // sort for priority
      const priority = getClassMetadata(PRIORITY_KEY, target);

      this.prioritySortRouters.push({
        priority: priority || 0,
        prefix: controllerOption.prefix,
        router: newRouter,
      });
    }

  }

  protected createRouter(controllerOption): express.Application {
    const { routerOptions: { strict, sensitive } } = controllerOption;
    const app = express();

    if (strict) {
      app.enabled('strict routing');
    }
    if (sensitive) {
      app.enabled('case sensitive routing');
    }
    return app;
  }

  private async handlerWebMiddleware(
    middlewares: any,
    handlerCallback: (middlewareImpl) => void,
  ): Promise<void> {

    if (middlewares && middlewares.length) {
      for (const middleware of middlewares) {
        if (typeof middleware === 'function') {
          // web function middleware
          handlerCallback(middleware);
        } else {
          const middlewareImpl: WebMiddleware = await this.applicationContext.getAsync(middleware);

          if (middlewareImpl && typeof (middlewareImpl as any).resolve === 'function') {
            handlerCallback((middlewareImpl as any).resolve());
          }
        }
      }
    }
  }

  public generateController(controllerMapping: string, routeArgsInfo?: RouterParamValue[]) {
    const [ controllerId, methodName ] = controllerMapping.split('.');

    return async (req, res, next) => {
      const args = [ req, res, next ];

      if (Array.isArray(routeArgsInfo)) {
        await Promise.all(routeArgsInfo.map(async ({ index, extractValue }) => {
          args[index] = await extractValue(req, res, next);
        }));
      }
      const controller = await req[rc].getAsync(controllerId);

      return controller[methodName].apply(controller, args);
    };
  }

  private isMiddlewareApplied(name: string): boolean {
    const app = this as any;

    return (
      !!app._router &&
      !!app._router.stack &&
      app._router.stack.filter &&
      app._router.stack.some(
        (layer: any) => layer && layer.handle && layer.handle.name === name,
      )
    );
  }

  get applicationContext(): MidwayContainer {
    return this.loader.getApplicationContext();
  }

  get config() {
    return this.fileloder ? this.fileloder.config : {};
  }

}

// var routes = app._router.stack;
// routes.forEach(removeMiddlewares);
// function removeMiddlewares(route, i, routes) {
//     switch (route.handle.name) {
//         case 'yourMiddlewareFunctionName':
//         case 'yourRouteFunctionName':
//             routes.splice(i, 1);
//     }
//     if (route.route)
//         route.route.stack.forEach(removeMiddlewares);
// }
