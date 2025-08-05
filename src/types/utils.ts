type Join<K, V> = K extends string
	? V extends string
		? `${K}.${V}`
		: never
	: never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export type Leaves<T, D extends number = 5> = [D] extends [never]
	? never
	: T extends string
	? ''
	: {
			[K in keyof T]: T[K] extends string
				? K & string
				: T[K] extends Array<infer U>
				? // [] стиль
				  | Join<K & string, Join<'[]', Leaves<U, Prev[D]>>>
						// индексный стиль: K.число.что-то
						| Join<K & string, Join<`${number}`, Leaves<U, Prev[D]>>>
				: T[K] extends object
				? Join<K & string, Leaves<T[K], Prev[D]>>
				: never;
	  }[keyof T];
