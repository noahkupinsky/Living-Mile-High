import { ContentPrefix } from "~/@types/constants";
import { prefixKey, unprefixKey } from "~/utils/misc";

describe('prefixing', () => {
    test('prefix key', () => {
        const key = 'key';

        const prefix = ContentPrefix.ASSET;

        const prefixedKey = prefixKey(key, prefix);

        expect(prefixedKey).toEqual(`${prefix}-${key}`);
    });

    test('unprefix key', () => {
        const key = 'key';

        const prefix = ContentPrefix.ASSET;

        expect(unprefixKey(prefixKey(key, prefix))).toEqual(key);
    });
})