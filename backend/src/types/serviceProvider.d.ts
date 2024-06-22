export interface ServiceProvider<D> {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get services(): D
}

type ExtractServiceDict<T> = T extends ServiceProvider<infer S> ? S : never;

type ConcatenateServices<T extends ServiceProvider<any>[]> = UnionToIntersection<
    ExtractServiceDict<T[number]>
>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

export type CompoundServiceDict<T, D> = ConcatenateServices<T> & D;

export interface LocalServiceProvider<D> extends ServiceProvider<D> {
    clear(): Promise<void>;
}