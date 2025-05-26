export function updateInstance<T>(target: T, source: Partial<T>): T {
    const result = { ...target };

   (Object.keys(source) as Array<keyof T>).forEach((key) => {
        const targetValue = result[key];
        const sourceValue = source[key];

        if (
            sourceValue !== null &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue) &&
            targetValue !== null &&
            typeof targetValue === 'object' &&
            !Array.isArray(targetValue)
        ) {
            result[key] = updateInstance(targetValue, sourceValue as Partial<typeof targetValue>);
        } else {
            result[key] = sourceValue as T[keyof T];
        }
    });
    return result;
} 