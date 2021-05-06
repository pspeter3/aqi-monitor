import { interpolate, mean } from "./sensor";

describe("sensor", () => {
    describe("mean", () => {
        it("should calculate the average", () => {
            expect(
                mean([
                    {
                        id: 0,
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
                        id: 1,
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

    describe("interpolate", () => {
        it("should calculate the interpolated average", () => {
            expect(
                interpolate({ lat: 37.7749, lon: -122.4194 }, [
                    {
                        id: 0,
                        lat: 37.77,
                        lon: -122.41,
                        data: {
                            particles: 10,
                            humidity: 70,
                            temperature: 60,
                            pressure: 1000,
                            aqi: 25,
                        },
                    },
                    {
                        id: 1,
                        lat: 37.78,
                        lon: -122.42,
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
                particles: 16.34849455477258,
                humidity: 76.34849455477257,
                temperature: 66.34849455477259,
                pressure: 1006.3484945547725,
                aqi: 31.348494554772582,
            });
        });

        it("should calculate the interpolated average with power", () => {
            expect(
                interpolate({ lat: 37.7749, lon: -122.4194, pow: 2 }, [
                    {
                        id: 0,
                        lat: 37.77,
                        lon: -122.41,
                        data: {
                            particles: 10,
                            humidity: 70,
                            temperature: 60,
                            pressure: 1000,
                            aqi: 25,
                        },
                    },
                    {
                        id: 1,
                        lat: 37.78,
                        lon: -122.42,
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
                particles: 17.514118414881317,
                humidity: 77.51411841488131,
                temperature: 67.51411841488131,
                pressure: 1007.5141184148812,
                aqi: 32.51411841488132,
            });
        });
    });
});
