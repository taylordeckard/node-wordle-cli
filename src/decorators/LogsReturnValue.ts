/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type MethodDecoratorFunction = (_target: any, _method: string, descriptor: PropertyDescriptor)
=> PropertyDescriptor | void;

/**
 * Decorator that logs the return value of the function each time the
 * function is invoked.
 *
 * @returns {MethodDecoratorFunction} editedMethod
 */
export function LogsReturnValue(): MethodDecoratorFunction {
  return function editFn(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    _target: any,
    _method: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const value = function newFn(this: any, ...args: any[]) {
      const rtnValue = originalMethod.call(this, ...args);
      console.log(rtnValue);
      return rtnValue;
    };
    const newDescriptor = { ...descriptor, value };
    return newDescriptor;
  };
}
