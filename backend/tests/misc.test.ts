import { ContentCategory } from "~/@types/constants";
import { mergeDeepPartial, prefixKey, unprefixKey } from "~/utils/misc";

describe('prefixing', () => {
    test('prefix key', () => {
        const key = 'key';

        const prefix = ContentCategory.ASSET;

        const prefixedKey = prefixKey(key, prefix);

        expect(prefixedKey).toEqual(`${prefix}-${key}`);
    });

    test('unprefix key', () => {
        const key = 'key';

        const prefix = ContentCategory.ASSET;

        expect(unprefixKey(prefixKey(key, prefix))).toEqual(key);
    });
})

describe('mergeDeepPartial', () => {
    test('merge partials', () => {
        const target = {
            key: 'value',
            nested: {
                key: 'value'
            }
        };
        const update = {
            key: 'new value',
            nested: {
                key: 'new value'
            }
        };
        const merged = mergeDeepPartial(target, update);
        expect(merged).toEqual({
            key: 'new value',
            nested: {
                key: 'new value'
            }
        });
    });

    test('merge deeply nested partials', () => {
        const target = {
            nest1: {
                nest2: {
                    key1: 'value1',
                    key2: 'value2'
                },
                key3: 'value3',
                key4: 'value4',
                next3: {
                    key5: 'value5'
                }
            }
        }

        const update = {
            nest1: {
                nest2: {
                    key2: 'new value2'
                },
                key4: 'new value4'
            }
        }

        const merged = mergeDeepPartial(target, update);
        expect(merged).toEqual({
            nest1: {
                nest2: {
                    key1: 'value1',
                    key2: 'new value2'
                },
                key3: 'value3',
                key4: 'new value4',
                next3: {
                    key5: 'value5'
                }
            }
        });
    });

    test('base cases', () => {
        const stringTarget: string = 'hello';
        const stringUpdate: string = 'world';
        const merged = mergeDeepPartial(stringTarget, stringUpdate);
        expect(merged).toEqual(stringUpdate);

        const numberTarget: number = 1;
        const numberUpdate: number = 2;
        const merged2 = mergeDeepPartial(numberTarget, numberUpdate);
        expect(merged2).toEqual(numberUpdate);

        const booleanTarget = true as boolean;
        const booleanUpdate = false;
        const merged3 = mergeDeepPartial(booleanTarget, booleanUpdate);
        expect(merged3).toEqual(booleanUpdate);

        const arrayTarget: number[] = [1, 2, 3];
        const arrayUpdate: number[] = [4, 5, 6];
        const merged4 = mergeDeepPartial(arrayTarget, arrayUpdate);
        expect(merged4).toEqual(arrayUpdate);

        const nullTarget = null as any;
        const nullUpdate = 'hello' as any;
        const merged5 = mergeDeepPartial(nullTarget, nullUpdate);
        expect(merged5).toEqual(nullUpdate);

        const undefinedTarget = undefined as any;
        const undefinedUpdate = 'hello' as any;
        const merged6 = mergeDeepPartial(undefinedTarget, undefinedUpdate);
        expect(merged6).toEqual(undefinedUpdate);

        const objectTarget = { key: 'value' } as any;
        const objectUpdate = { key: 'new value' } as any;
        const merged7 = mergeDeepPartial(objectTarget, objectUpdate);
        expect(merged7).toEqual(objectUpdate);
    });
})