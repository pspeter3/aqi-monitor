import { name } from "./utils";

describe("utils", () => {
    describe("name", () => {
        it("should be the project name", () => {
            expect(name).toEqual("aqi-monitor");
        });
    });
});
