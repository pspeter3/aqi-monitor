import { calculateAQI } from "./aqi";

describe("aqi", () => {
    describe("calculateAQI", () => {
        it("should return the EPA value", () => {
            // Based on San Francisco sensors
            expect(Math.round(calculateAQI(7.14, 38))).toEqual(26);
        });

        it("should throw for high numbers", () => {
            // Based on Battle Mountain sensors
            expect(() => calculateAQI(1000, 25)).toThrow();
        });
    });
});
