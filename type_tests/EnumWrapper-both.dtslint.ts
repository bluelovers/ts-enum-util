import { $enum } from "../src";

// Enum with mix of number and string values
enum TestEnum {
    A,
    B,
    C = "c"
}

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const numstr: number | string;
declare const numstrOrNull: number | string | null;
declare const numstrOrUndefined: number | string | undefined;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;

declare const value: TestEnum;
declare const valueOrNull: TestEnum | null;
declare const valueOrUndefined: TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<string | number, typeof TestEnum>
enumWrapper;

// $ExpectType number
enumWrapper.length;

// $ExpectType number
enumWrapper.size;

// $ExpectType Readonly<["A" | "B" | "C", TestEnum]>
enumWrapper[0];

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<TestEnum>
enumWrapper.values();

// $ExpectType IterableIterator<Readonly<["A" | "B" | "C", TestEnum]>>
enumWrapper.entries();

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType TestEnum
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string | number, typeof TestEnum>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType TestEnum
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string | number, typeof TestEnum>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType TestEnum[]
enumWrapper.getValues();

// $ExpectType Readonly<["A" | "B" | "C", TestEnum]>[]
enumWrapper.getEntries();

// $ExpectType boolean
enumWrapper.isKey(str);
// $ExpectType boolean
enumWrapper.isKey(strOrNull);
// $ExpectType boolean
enumWrapper.isKey(strOrUndefined);

// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(str);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(strOrNull);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(strOrUndefined);

// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(strOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(strOrUndefined);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str, undefined);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrDefault(str, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str, keyOrUndefined);
// $ExpectType string
enumWrapper.asKeyOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.asKeyOrDefault(str, strOrUndefined);

// $ExpectType boolean
enumWrapper.isValue(numstr);
// $ExpectType boolean
enumWrapper.isValue(numstrOrNull);
// $ExpectType boolean
enumWrapper.isValue(numstrOrUndefined);

// $ExpectType TestEnum
enumWrapper.asValueOrThrow(numstr);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(numstrOrNull);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(numstrOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstr);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstrOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstrOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstr, undefined);
// $ExpectType TestEnum
enumWrapper.asValueOrDefault(numstr, value);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstr, valueOrUndefined);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, num);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, str);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, numstr);
// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(num, numstrOrUndefined);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(numstr);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(numstrOrNull);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(numstrOrUndefined);

// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numstr);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numstrOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numstrOrUndefined);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrDefault(numstr, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numstr, keyOrUndefined);
// $ExpectType string
enumWrapper.getKeyOrDefault(numstr, str);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(numstr, strOrUndefined);

// $ExpectType TestEnum
enumWrapper.getValueOrThrow(key);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(keyOrNull);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(keyOrUndefined);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(str);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(strOrNull);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(strOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(strOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(strOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str, undefined);
// $ExpectType TestEnum
enumWrapper.getValueOrDefault(str, value);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str, valueOrUndefined);
// $ExpectType string | number
enumWrapper.getValueOrDefault(str, num);
// $ExpectType string | number
enumWrapper.getValueOrDefault(str, str);
// $ExpectType string | number
enumWrapper.getValueOrDefault(str, numstr);
// $ExpectType string | number | undefined
enumWrapper.getValueOrDefault(str, numstrOrUndefined);
