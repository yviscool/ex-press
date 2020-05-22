import { attachClassMetadata, CONFIG_KEY, attachConstructorDataOnClass } from './common';

export function Config(identifier?: string) {
  return (target: any, targetKey: string, index?: number) => {
    if (typeof index === 'number') {
      attachConstructorDataOnClass(identifier, target, CONFIG_KEY, index);
    } else {
      if (!identifier) {
        identifier = targetKey;
      }
      attachClassMetadata(CONFIG_KEY, {
        key: identifier,
        propertyName: targetKey,
      }, target);
    }
  };
}
