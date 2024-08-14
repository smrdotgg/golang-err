// # usage:
// const [val, err] = await checkForErrors(() => prisma.user.findMany())
//        ^ val has type `User | null`
// if (err !== null) return;
// val has type `User`

type ErrorResult<T> = [T, null] | [null, string];

export function checkForErrors<T>(
  func: () => Promise<T>
): Promise<ErrorResult<T>>;

export function checkForErrors<T>(func: () => T): ErrorResult<T>;

export function checkForErrors<T>(
  func: (() => T) | (() => Promise<T>)
): ErrorResult<T> | Promise<ErrorResult<T>> {
  try {
    const result = func();
    if (result instanceof Promise) {
      return result
        .then((value): ErrorResult<T> => [value, null])
        .catch((e) => {
          const errorString = String(e);
          return [null, errorString.length ? errorString : "Error"];
        });
    } else {
      return [result, null];
    }
  } catch (e) {
    const errorString = String(e);
    return [null, errorString.length ? errorString : "Error"];
  }
}
