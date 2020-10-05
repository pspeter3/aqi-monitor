import { name } from "./main";

describe("main", () => {
    describe("name", () => {
        it("should be the project name", () => {
            expect(name).toEqual("aqi-monitor");
        });
    });
});
