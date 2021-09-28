export function intervalTimer(interval: number): Function {
  let t = 0;
  return (n: number) => {
    t += n;
    if (t >= 1000) {
      t = 0;
      return true;
    }
    return false;
  };
}
