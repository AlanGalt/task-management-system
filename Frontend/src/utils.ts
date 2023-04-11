type AsyncFunction<T> = () => Promise<T>;

type AsyncResult<T> = [T | null, Error | null];

// TODO: add error dialogs, maybe notifications?
export const asyncWrapper = async <T>(asyncFn: AsyncFunction<T>): Promise<AsyncResult<T>> => {
  try {
    const data = await asyncFn();
    return [data, null];
  } catch (error) {
    console.error('An error occurred:', error);
    return [null, error as Error];
  }
};
