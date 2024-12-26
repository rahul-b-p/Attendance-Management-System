type BuildTuple<N extends number, T extends any[] = []> =
    T['length'] extends N
    ? T
    : BuildTuple<N, [...T, 1]>;

type NumberRange<L extends number, H extends number, T extends any[] = BuildTuple<L>, Acc = never> =
    T['length'] extends H
    ? Acc
    : NumberRange<L, H, [...T, 1], Acc | T['length']>;

type MonthRange = NumberRange<1, 13>;
type DayRange = NumberRange<1, 32>;


export type YYYYMMDD = `2${0|1}${number}${number}-${MonthRange}-${DayRange}`
