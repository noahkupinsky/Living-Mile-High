import { DeepPartial } from "living-mile-high-lib";

function deepMerge<T>(target: T, source: DeepPartial<T>): T {
    const output = { ...target };

    if (typeof target === 'object' && target !== null && typeof source === 'object' && source !== null) {
        Object.keys(source).forEach(key => {
            const targetValue = (target as any)[key];
            const sourceValue = (source as any)[key];

            if (sourceValue instanceof Array) {
                (output as any)[key] = sourceValue; // Replace arrays
            } else if (typeof sourceValue === 'object' && sourceValue !== null) {
                if (!(key in target)) {
                    (output as any)[key] = sourceValue;
                } else {
                    (output as any)[key] = deepMerge(targetValue, sourceValue);
                }
            } else {
                (output as any)[key] = sourceValue;
            }
        });
    }

    return output;
}

export default deepMerge