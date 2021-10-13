
export const iteratorToArray = <T>(iterator: IterableIterator<T>): T[] => {
  const array: T[] = [];
  let element = iterator.next();
  while (!element.done) {
    array.push(element.value);
    element = iterator.next();
  }
  return array;
}
