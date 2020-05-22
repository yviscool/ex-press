import { ScopeEnum, saveObjectDefProps } from '../common';
import Debug from 'debug';
const debug = Debug('injection:context:obj_def');

export function Async() {
  return (target: any) => {
    debug(`set [async] property in [${target.name}]`);
    return saveObjectDefProps(target, { isAsync: true });
  };
}

export function Init() {
  return (target: any, propertyKey: string) => {
    debug(`set [init] property in [${target.constructor.name}]`);
    return saveObjectDefProps(target.constructor, { initMethod: propertyKey });
  };
}

export function Destroy() {
  return (target: any, propertyKey: string) => {
    debug(`set [destroy] property in [${target.constructor.name}]`);
    return saveObjectDefProps(target.constructor, { destroyMethod: propertyKey });
  };
}

export function Scope(scope: ScopeEnum = ScopeEnum.Singleton) {
  return (target: any) => {
    debug(`set [scope] property in [${target.name}]`);
    return saveObjectDefProps(target, { scope });
  };
}

export function Autowire(isAutowire = true) {
  return (target: any) => {
    debug(`set [autowire] property in [${target.name}]`);
    return saveObjectDefProps(target, { isAutowire });
  };
}
