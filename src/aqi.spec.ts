import { calculatAQI } from "./aqi";

describe("aqi", () => {
    describe("calculateAQI", () => {
        it("should return the EPA value", () => {
            // Based on San Francisco sensors
            expect(Math.round(calculatAQI(14.28, 72, 60))).toEqual(30);
        });
        
        it("should throw for high numbers", () => {
            // Based on Battle Mountain sensors
            expect(() => calculatAQI(1000, 25, 77)).toThrow();
        })
    });
});
