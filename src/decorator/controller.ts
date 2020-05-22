import { Scope } from './annotation';
import { MiddlewareParamArray } from './interface';
import { saveClassMetadata, saveModule, ScopeEnum, CONTROLLER_KEY } from './common';

export function Controller(prefix: string, routerOptions: {
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
    Scope(ScopeEnum.Request)(target);
  };
}
