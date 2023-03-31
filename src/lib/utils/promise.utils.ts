export async function promiseTuplify<T>(promise: Promise<T>): Promise<[T, Error]> {
  try {
    const res = await promise;

    return [res, null as Error];
  } catch (error) {
    return [null as T, error];
  }
}
