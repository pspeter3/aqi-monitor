import { createRequest } from "node-mocks-http";
import { createHandler } from "./handler";

describe("handler", () => {
    describe("createHandler", () => {
        it("should respond for a single sensor", async () => {
            const client = jest.fn().mockReturnValue(
                Promise.resolve({
                    lat: 0,
                    lon: 0,
                    data: {
                        particles: 15,
                        humidity: 72,
                        temperature: 60,
                        pressure: 1000,
                        aqi: 31.749166666666667,
                    },
                })
            );
            const handler = createHandler(3000, client);
            const res = await handler(createRequest({ url: "/?show=1" }));
            expect(res).toEqual(
                expect.objectContaining({
                    ids: [1],
                    data: {
                        particles: 15,
                        humidity: 72,
                        temperature: 60,
                        pressure: 1000,
                        aqi: 31.749166666666667,
                    },
                })
            );
        });

        it("should respond for multiple sensors", async () => {
            const client = jest.fn().mockReturnValue(
                Promise.resolve({
                    lat: 0,
                    lon: 0,
                    data: {
                        particles: 15,
                        humidity: 72,
                        temperature: 60,
                        pressure: 1000,
                        aqi: 31.749166666666667,
                    },
                })
            );
            const handler = createHandler(3000, client);
            const res = await handler(
                createRequest({ url: "/?show=1&show=2" })
            );
            expect(res).toEqual(
                expect.objectContaining({
                    ids: [1, 2],
                    data: {
                        particles: 15,
                        humidity: 72,
                        temperature: 60,
                        pressure: 1000,
                        aqi: 31.749166666666667,
                    },
                })
            );
        });

        it("should error for no url", async () => {
            const client = jest.fn();
            const handler = createHandler(3000, client);
            await expect(handler(createRequest())).rejects.toThrow();
        });
    });
});
