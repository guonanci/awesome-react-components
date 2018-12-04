export function createChainedFunction(...args: any) {
  const argsArr = [].slice.call(args, 0)
  if (argsArr.length === 1) {
    return argsArr[0]
  }
  return function chainedFunction() {
    for (const i of [...Array(argsArr).keys()]) {
      // tslint:disable-next-line
      argsArr[i].apply(this, arguments)
    }
  }
}