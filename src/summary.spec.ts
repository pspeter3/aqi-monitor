import { mean } from "./summary";

describe("summary", () => {
    describe("mean", () => {
        it("should calculate the average", () => {
            expect(
                mean([
                    {
                        lat: 0,
                        lon: 0,
                        data: {
                            particles: 10,
                            humidity: 70,
                            temperature: 60,
                            pressure: 1000,
                            aqi: 25,
                        },
                    },
                    {
                        lat: 0,
                        lon: 0,
                        data: {
                            particles: 20,
                            humidity: 80,
                            temperature: 70,
                            pressure: 1010,
                            aqi: 35,
                        },
                    },
                ])
            ).toEqual({
                particles: 15,
                humidity: 75,
                temperature: 65,
                pressure: 1005,
                aqi: 30,
            });
        });
    });
});
