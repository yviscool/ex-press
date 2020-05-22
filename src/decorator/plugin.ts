import { PLUGIN_KEY, attachClassMetadata, attachConstructorDataOnClass } from './common';

export function plugin(identifier?: string) {
  return (target: any, targetKey: string, index?: number) => {
    if (typeof index === 'number') {
      attachConstructorDataOnClass(identifier, target, PLUGIN_KEY, index);
    } else {
      if (!identifier) {
        identifier = targetKey;
      }
      attachClassMetadata(PLUGIN_KEY, {
        key: identifier,
        propertyName: targetKey,
      }, target);
    }
  };
}
