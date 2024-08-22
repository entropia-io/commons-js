export function isNullOrUndefined(obj: unknown): obj is null | undefined {
    return obj === null || obj === undefined;
}

export function isNotNullOrUndefined(obj: unknown): obj is NonNullable<unknown> {
    return !isNullOrUndefined(obj);
}


export function firstNonNull<T>(a: T | null | undefined, b: T | null | undefined): T {
    if (!isNullOrUndefined(a)) {
        return a;
    }
    if (!isNullOrUndefined(b)) {
        return b;
    }
    throw new Error('At least one non null element is required');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enumToArrayValue<E>(enumerableEnumClass: any): E[] {

    const array: E[] = [];
    const list = Object.keys(enumerableEnumClass);
    for (const object of list) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        array.push(object as any);
    }
    return array;
}

export function safe<T>(obj: T): T {
    /* eslint-disable */
    return new Proxy(obj as any, {
        get: (target: any, name: any) => {
            const result = target[name];
            if (isNullOrUndefined(result)) {
                return safe({});
            }
            return (result instanceof Object) ? safe(result) : result;
        }
    });
    /* eslint-enable */
}


