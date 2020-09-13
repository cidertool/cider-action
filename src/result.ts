export type Result<T, E> = Ok<T> | Err<E>
type Ok<T> = { _tag: 'ok'; ok: T }
type Err<E> = { _tag: 'err'; err: E }

const ok = <T>(ok: T): Ok<T> => ({ _tag: 'ok', ok })
const err = <E>(err: E): Err<E> => ({ _tag: 'err', err })

export const tryCatch = <T, E>(
    fn: () => T,
    onError: (error: Error) => E
): Result<T, E> => {
    try {
        return ok(fn())
    } catch (error) {
        return err(onError(error))
    }
}
