import { DESCRIPTOR } from './types';

export function isIn(
  selector: DESCRIPTOR,
  collection: DESCRIPTOR | DESCRIPTOR[] | undefined
) {
  if (typeof collection === 'undefined') return;

  collection = Array.isArray(collection) ? collection : [collection];
  return !!collection.find((item: DESCRIPTOR) => item.name === selector.name);
}
