
import { ObjectIdentifier } from '../interface';
import { saveProviderId } from '../common';

export function Provide(identifier?: ObjectIdentifier) {
  return (target: any) => {
    return saveProviderId(identifier, target);
  };
}
