import { ObjectIdentifier } from '../interface';
import { PIPELINE_IDENTIFIER, saveConstructorInject, savePropertyInject } from '../common';

export function Pipeline(valves?: ObjectIdentifier[]) {
  return (target: any, targetKey: string, index?: number) => {
    if (typeof index === 'number') {
      saveConstructorInject({ target, targetKey, identifier: PIPELINE_IDENTIFIER, index, args: valves });
    } else {
      savePropertyInject({ target, targetKey, identifier: PIPELINE_IDENTIFIER, args: valves });
    }
  };
}
