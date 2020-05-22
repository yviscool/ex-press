import { LOGGER_KEY, attachConstructorDataOnClass, attachClassMetadata } from './common';

export function Logger(identifier?: string) {
  return (target: any, targetKey: string, index?: number) => {
    if (typeof index === 'number') {
      attachConstructorDataOnClass(identifier, target, LOGGER_KEY, index);
    } else {
      if (!identifier) {
        identifier = targetKey;
      }
      attachClassMetadata(LOGGER_KEY, {
        key: identifier,
        propertyName: targetKey,
      }, target);
    }
  };
}
