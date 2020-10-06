import { stringify } from "querystring";
import { parseParams } from "./params";

describe("params", () => {
    describe("parseParams", () => {
        describe("BaseParams", () => {
            it("should handle a single id", () => {
                expect(parseParams(stringify({ show: 1 }))).toEqual({
                    show: 1,
                });
            });

            it("should handle multiple ids", () => {
                expect(parseParams(stringify({ show: [1, 2] }))).toEqual({
                    show: [1, 2],
                });
            });

            it("should handle a key", () => {
                expect(parseParams(stringify({ key: "foo", show: 1 }))).toEqual(
                    {
                        key: "foo",
                        show: 1,
                    }
                );
            });

            it("should throw for missing ids", () => {
                expect(() => parseParams(stringify({}))).toThrow();
            });

            it("should throw for too many ids", () => {
                expect(() =>
                    parseParams(stringify({ show: [1, 2, 3, 4, 5, 6] }))
                ).toThrow();
            });

            it("should throw for duplicate ids", () => {
                expect(() =>
                    parseParams(stringify({ show: [1, 1] }))
                ).toThrow();
            });
        });
        describe("LocationParams", () => {
            it("should handle lat, lon", () => {
                expect(
                    parseParams(stringify({ show: 1, lat: 0, lon: 0 }))
                ).toEqual({ show: 1, lat: 0, lon: 0 });
            });

            it("should throw for missing lon", () => {
                expect(() =>
                    parseParams(stringify({ show: 1, lat: 0 }))
                ).toThrow();
            });

            it("should throw for missing lat", () => {
                expect(() =>
                    parseParams(stringify({ show: 1, lon: 0 }))
                ).toThrow();
            });

            it("should throw for out of bounds lat", () => {
                expect(() =>
                    parseParams(stringify({ show: 1, lat: -91, lon: 0 }))
                ).toThrow();
                expect(() =>
                    parseParams(stringify({ show: 1, lat: 91, lon: 0 }))
                ).toThrow();
            });

            it("should throw for out of bounds lon", () => {
                expect(() =>
                    parseParams(stringify({ show: 1, lat: 0, lon: -181 }))
                ).toThrow();
                expect(() =>
                    parseParams(stringify({ show: 1, lat: 0, lon: 181 }))
                ).toThrow();
            });
        });

        describe("PowerParams", () => {
            it("should handle pow", () => {
                expect(
                    parseParams(stringify({ show: 1, lat: 0, lon: 0, pow: 2 }))
                ).toEqual({ show: 1, lat: 0, lon: 0, pow: 2 });
            });

            it("should throw for pow without lat & lon", () => {
                expect(() =>
                    parseParams(stringify({ show: 1, pow: 2 }))
                ).toThrow();
            });
        });
    });
});
