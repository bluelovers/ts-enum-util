import { EnumWrapper } from "../src";

// NOTE: Intentionally out of order to test that EnumWrapper iteration is always based
//       on sorted keys.
enum TestEnum {
    D = 0, // duplicate of A
    B = "2",
    A = 0,
    C = 2 // duplicate of B, but number instead of string
}

describe("EnumWrapper: number+string enum", () => {
    const enumWrapper = EnumWrapper.getCachedInstance(TestEnum);

    test("toString()", () => {
        expect(String(enumWrapper)).toBe("[object EnumWrapper]");
    });

    test("getCachedInstance()", () => {
        const result1 = EnumWrapper.getCachedInstance(TestEnum);
        const result2 = EnumWrapper.getCachedInstance(TestEnum);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns cached instance
        expect(result1).toBe(result2);
    });

    test("does not observably alter the enum", () => {
        // Wrap the enum, then confirm that there are no extra properties/keys available
        EnumWrapper.getCachedInstance(TestEnum);

        expect(Object.keys(TestEnum)).toEqual(["0", "2", "D", "B", "A", "C"]);
        expect(Object.getOwnPropertyNames(TestEnum)).toEqual([
            "0",
            "2",
            "D",
            "B",
            "A",
            "C"
        ]);

        const result = [];
        for (const key in TestEnum) {
            if (true) {
                // bypass tslint error
                result.push(key);
            }
        }

        expect(result).toEqual(["0", "2", "D", "B", "A", "C"]);
    });

    describe("is Array-Like", () => {
        test("length", () => {
            expect(enumWrapper.length).toBe(4);
        });

        test("index signature", () => {
            expect(enumWrapper[0]).toEqual(["A", TestEnum.A]);
            expect(enumWrapper[1]).toEqual(["B", TestEnum.B]);
            expect(enumWrapper[2]).toEqual(["C", TestEnum.C]);
            expect(enumWrapper[3]).toEqual(["D", TestEnum.D]);
        });
    });

    describe("is Map-Like", () => {
        test("size", () => {
            expect(enumWrapper.size).toBe(4);
        });

        test("keys()", () => {
            // keys() returns an iterator
            expect(enumWrapper.keys().next()).toEqual({
                done: false,
                value: "A"
            });

            const expected = ["A", "B", "C", "D"];
            const result = Array.from(enumWrapper.keys());
            expect(result).toEqual(expected);
        });

        test("values()", () => {
            // values() returns an iterator
            expect(enumWrapper.values().next()).toEqual({
                done: false,
                value: TestEnum.A
            });

            const expected = [TestEnum.A, TestEnum.B, TestEnum.C, TestEnum.D];
            const result = Array.from(enumWrapper.values());
            expect(result).toEqual(expected);
        });

        test("entries()", () => {
            // entries() returns an iterator
            expect(enumWrapper.entries().next()).toEqual({
                done: false,
                value: ["A", TestEnum.A]
            });

            const expected = [
                ["A", TestEnum.A],
                ["B", TestEnum.B],
                ["C", TestEnum.C],
                ["D", TestEnum.D]
            ];
            const result = Array.from(enumWrapper.entries());
            expect(result).toEqual(expected);
        });

        test("@@iterator()", () => {
            // @@iterator() returns an iterator
            expect(enumWrapper[Symbol.iterator]().next()).toEqual({
                done: false,
                value: ["A", TestEnum.A]
            });

            const expected = [
                ["A", TestEnum.A],
                ["B", TestEnum.B],
                ["C", TestEnum.C],
                ["D", TestEnum.D]
            ];
            const result = Array.from(enumWrapper[Symbol.iterator]());
            expect(result).toEqual(expected);
        });

        describe("forEach()", () => {
            test("without context", () => {
                const context = {
                    iteratee: function(): void {
                        expect(this).not.toBe(context);
                    }
                };

                const iterateeSpy = jest.fn(context.iteratee);

                enumWrapper.forEach(iterateeSpy);

                expect(iterateeSpy.mock.calls).toEqual([
                    [TestEnum.A, "A", enumWrapper, 0],
                    [TestEnum.B, "B", enumWrapper, 1],
                    [TestEnum.C, "C", enumWrapper, 2],
                    [TestEnum.D, "D", enumWrapper, 3]
                ]);
            });

            test("with context", () => {
                const context = {
                    iteratee: function(): void {
                        expect(this).toBe(context);
                    }
                };

                const iterateeSpy = jest.fn(context.iteratee);

                enumWrapper.forEach(iterateeSpy, context);

                expect(iterateeSpy.mock.calls).toEqual([
                    [TestEnum.A, "A", enumWrapper, 0],
                    [TestEnum.B, "B", enumWrapper, 1],
                    [TestEnum.C, "C", enumWrapper, 2],
                    [TestEnum.D, "D", enumWrapper, 3]
                ]);
            });
        });
    });

    test("getKeys()", () => {
        const expected = ["A", "B", "C", "D"];
        const result = enumWrapper.getKeys();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0] = "C";
        expect(enumWrapper.getKeys()).toEqual(expected);
    });

    test("getValues()", () => {
        const expected = [TestEnum.A, TestEnum.B, TestEnum.C, TestEnum.D];
        const result = enumWrapper.getValues();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0] = TestEnum.C;
        expect(enumWrapper.getValues()).toEqual(expected);
    });

    test("getEntries()", () => {
        const expected = [
            ["A", TestEnum.A],
            ["B", TestEnum.B],
            ["C", TestEnum.C],
            ["D", TestEnum.D]
        ];
        const result = enumWrapper.getEntries();
        expect(result).toEqual(expected);

        // test for defensive copy
        // "as any" required to bypass readonly
        (result[0][1] as any) = TestEnum.C;
        expect(enumWrapper.getEntries()).toEqual(expected);
    });

    describe("map()", () => {
        test("without context", () => {
            const context = {
                iteratee: function(value: TestEnum, key: string): string {
                    expect(this).not.toBe(context);
                    return key + String(value);
                }
            };

            const iterateeSpy = jest.fn(context.iteratee);

            const result = enumWrapper.map(iterateeSpy);

            expect(result).toEqual(["A0", "B2", "C2", "D0"]);

            expect(iterateeSpy.mock.calls).toEqual([
                [TestEnum.A, "A", enumWrapper, 0],
                [TestEnum.B, "B", enumWrapper, 1],
                [TestEnum.C, "C", enumWrapper, 2],
                [TestEnum.D, "D", enumWrapper, 3]
            ]);
        });

        test("with context", () => {
            const context = {
                iteratee: function(value: TestEnum, key: string): string {
                    expect(this).toBe(context);
                    return key + String(value);
                }
            };

            const iterateeSpy = jest.fn(context.iteratee);

            const result = enumWrapper.map(iterateeSpy, context);

            expect(result).toEqual(["A0", "B2", "C2", "D0"]);

            expect(iterateeSpy.mock.calls).toEqual([
                [TestEnum.A, "A", enumWrapper, 0],
                [TestEnum.B, "B", enumWrapper, 1],
                [TestEnum.C, "C", enumWrapper, 2],
                [TestEnum.D, "D", enumWrapper, 3]
            ]);
        });
    });

    test("isKey()", () => {
        expect(enumWrapper.isKey("A")).toBe(true);
        expect(enumWrapper.isKey("B")).toBe(true);
        expect(enumWrapper.isKey("C")).toBe(true);
        expect(enumWrapper.isKey("D")).toBe(true);

        expect(enumWrapper.isKey("blah")).toBe(false);
        // Name of a property on Object.prototype
        expect(enumWrapper.isKey("toString")).toBe(false);
        expect(enumWrapper.isKey(null)).toBe(false);
        expect(enumWrapper.isKey(undefined)).toBe(false);
    });

    test("asKeyOrThrow()", () => {
        expect(enumWrapper.asKeyOrThrow("A")).toBe("A");
        expect(enumWrapper.asKeyOrThrow("B")).toBe("B");
        expect(enumWrapper.asKeyOrThrow("C")).toBe("C");
        expect(enumWrapper.asKeyOrThrow("D")).toBe("D");

        expect(() => {
            enumWrapper.asKeyOrThrow("blah");
        }).toThrow();

        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.asKeyOrThrow("toString");
        }).toThrow();

        expect(() => {
            enumWrapper.asKeyOrThrow(null);
        }).toThrow();

        expect(() => {
            enumWrapper.asKeyOrThrow(undefined);
        }).toThrow();
    });

    test("asKeyOrDefault()", () => {
        expect(enumWrapper.asKeyOrDefault("A")).toBe("A");
        expect(enumWrapper.asKeyOrDefault("B")).toBe("B");
        expect(enumWrapper.asKeyOrDefault("C")).toBe("C");
        expect(enumWrapper.asKeyOrDefault("D")).toBe("D");

        expect(enumWrapper.asKeyOrDefault("blah")).toBe(undefined);
        // Name of a property on Object.prototype
        expect(enumWrapper.asKeyOrDefault("toString")).toBe(undefined);
        expect(enumWrapper.asKeyOrDefault(null, "A")).toBe("A");
        expect(enumWrapper.asKeyOrDefault(undefined, "foo")).toBe("foo");
    });

    test("isValue()", () => {
        expect(enumWrapper.isValue(TestEnum.A)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.B)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.C)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.D)).toBe(true);

        expect(enumWrapper.isValue(-1)).toBe(false);
        expect(enumWrapper.isValue("foo")).toBe(false);
        // Name of a property on Object.prototype
        expect(enumWrapper.isValue("toString")).toBe(false);
        expect(enumWrapper.isValue(null)).toBe(false);
        expect(enumWrapper.isValue(undefined)).toBe(false);
    });

    test("asValueOrThrow()", () => {
        expect(enumWrapper.asValueOrThrow(TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrThrow(TestEnum.B)).toBe(TestEnum.B);
        expect(enumWrapper.asValueOrThrow(TestEnum.C)).toBe(TestEnum.C);
        expect(enumWrapper.asValueOrThrow(TestEnum.D)).toBe(TestEnum.D);

        expect(() => {
            enumWrapper.asValueOrThrow(-1);
        }).toThrow();

        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.asValueOrThrow("toString");
        }).toThrow();

        expect(() => {
            enumWrapper.asValueOrThrow(null);
        }).toThrow();

        expect(() => {
            enumWrapper.asValueOrThrow(undefined);
        }).toThrow();
    });

    test("asValueOrDefault()", () => {
        expect(enumWrapper.asValueOrDefault(TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrDefault(TestEnum.B)).toBe(TestEnum.B);
        expect(enumWrapper.asValueOrDefault(TestEnum.C)).toBe(TestEnum.C);
        expect(enumWrapper.asValueOrDefault(TestEnum.D)).toBe(TestEnum.D);

        expect(enumWrapper.asValueOrDefault(-1)).toBe(undefined);
        expect(enumWrapper.asValueOrDefault("blah")).toBe(undefined);
        // Name of a property on Object.prototype
        expect(enumWrapper.asValueOrDefault("toString")).toBe(undefined);
        expect(enumWrapper.asValueOrDefault(null, TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrDefault(undefined, -2)).toBe(-2);
        // duplicate of testEnum.A, except as a string instead of number
        expect(enumWrapper.asValueOrDefault("0", -2)).toBe(-2);
    });

    test("getKeyOrThrow()", () => {
        // A and D have duplicate values, but D is ordered after A, and last duplicate entry wins,
        // so D's key is returned when looking up the value of A or D.
        expect(enumWrapper.getKeyOrThrow(TestEnum.A)).toBe("D");
        expect(enumWrapper.getKeyOrThrow(TestEnum.B)).toBe("B");
        expect(enumWrapper.getKeyOrThrow(TestEnum.C)).toBe("C");
        expect(enumWrapper.getKeyOrThrow(TestEnum.D)).toBe("D");

        expect(() => {
            enumWrapper.getKeyOrThrow(-1);
        }).toThrow();

        expect(() => {
            enumWrapper.getKeyOrThrow("blah");
        }).toThrow();

        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.getKeyOrThrow("toString");
        }).toThrow();

        expect(() => {
            enumWrapper.getKeyOrThrow(null);
        }).toThrow();

        expect(() => {
            enumWrapper.getKeyOrThrow(undefined);
        }).toThrow();
    });

    test("getKeyOrDefault()", () => {
        // A and D have duplicate values, but D is ordered after A, and last duplicate entry wins,
        // so D's key is returned when looking up the value of A or D.
        expect(enumWrapper.getKeyOrDefault(TestEnum.A)).toBe("D");
        expect(enumWrapper.getKeyOrDefault(TestEnum.B)).toBe("B");
        expect(enumWrapper.getKeyOrDefault(TestEnum.C)).toBe("C");
        expect(enumWrapper.getKeyOrDefault(TestEnum.D)).toBe("D");

        expect(enumWrapper.getKeyOrDefault(-1)).toBe(undefined);
        expect(enumWrapper.getKeyOrDefault("blah")).toBe(undefined);
        // Name of a property on Object.prototype
        expect(enumWrapper.getKeyOrDefault("toString")).toBe(undefined);
        expect(enumWrapper.getKeyOrDefault(null, "A")).toBe("A");
        expect(enumWrapper.getKeyOrDefault(undefined, "foo")).toBe("foo");
        // duplicate of testEnum.A, except as a string instead of number
        expect(enumWrapper.getKeyOrDefault("0", "foo")).toBe("foo");
    });

    test("getValueOrThrow()", () => {
        expect(enumWrapper.getValueOrThrow("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValueOrThrow("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValueOrThrow("C")).toBe(TestEnum.C);
        expect(enumWrapper.getValueOrThrow("D")).toBe(TestEnum.D);

        expect(() => {
            enumWrapper.getValueOrThrow("blah");
        }).toThrow();

        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.getValueOrThrow("toString");
        }).toThrow();

        expect(() => {
            enumWrapper.getValueOrThrow(null);
        }).toThrow();

        expect(() => {
            enumWrapper.getValueOrThrow(undefined);
        }).toThrow();
    });

    test("getValueOrDefault()", () => {
        expect(enumWrapper.getValueOrDefault("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValueOrDefault("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValueOrDefault("C")).toBe(TestEnum.C);
        expect(enumWrapper.getValueOrDefault("D")).toBe(TestEnum.D);

        expect(enumWrapper.getValueOrDefault("blah")).toBe(undefined);
        // Name of a property on Object.prototype
        expect(enumWrapper.getValueOrDefault("toString")).toBe(undefined);
        expect(enumWrapper.getValueOrDefault(null, TestEnum.A)).toBe(
            TestEnum.A
        );
        expect(enumWrapper.getValueOrDefault(undefined, -1)).toBe(-1);
    });
});
