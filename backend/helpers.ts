
export function* IdGenerator(): Generator<number> {
  let index = 0;
  while (true) {
    if (index == Number.MAX_SAFE_INTEGER) {
      index = 0;
    }
    yield index++;
  }
}