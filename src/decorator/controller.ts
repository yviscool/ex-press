import { saveClassMetadata, saveModule, scope, ScopeEnum } from 'injection';
import { CONTROLLER_KEY } from './constant';
import { MiddlewareParamArray } from './interface';

export function controller(prefix: string, routerOptions: {
  sensitive?: boolean,
  strict?: boolean,
  middleware?: MiddlewareParamArray,
 } = { middleware: [], sensitive: true, strict: true },
  ): ClassDecorator {
  return (target: any) => {
    saveModule(CONTROLLER_KEY, target);
    saveClassMetadata(CONTROLLER_KEY, {
      prefix,
      routerOptions,
    }, target);
    scope(ScopeEnum.Request)(target);
  };
}
