/**
 * Returns true if the item is not null.
 *
 * Usage:
 * ["exists", null].filter(nonNull); // returns ["exists"]
 */
export const nonNull = <T>(x: T): x is NonNullable<T> => !!x;
