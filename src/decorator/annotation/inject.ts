import { saveConstructorInject, savePropertyInject } from '../common';
import { ObjectIdentifier } from '../interface';

export function Inject(identifier?: ObjectIdentifier) {
  return (target: any, targetKey: string, index?: number) => {

    if (typeof index === 'number') {
      saveConstructorInject({ target, targetKey, identifier, index });
    } else {
      savePropertyInject({ target, targetKey, identifier });
    }
  };
}
