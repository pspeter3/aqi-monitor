import { createServer, Server } from "http";
import { AddressInfo } from "net";
import { Purple, PurpleClient } from "./purple";

describe("Purple", () => {
    describe("epa", () => {
        it("should return the EPA value", () => {
            // Based on San Francisco sensors
            expect(Math.round(Purple.epa(7.14, 38))).toEqual(26);
        });

        it("should throw for high numbers", () => {
            // Based on Battle Mountain sensors
            expect(() => Purple.epa(1000, 25)).toThrow();
        });
    });

    describe("constructor", () => {
        it("should not require a base URL", () => {
            expect(() => new Purple("key")).not.toThrow();
        });
    });

    describe("sensor", () => {
        let port = 4001;
        const id = 1;

        const createClient = (server: Server): PurpleClient =>
            new Purple(
                "key",
                `http://localhost:${(server.address() as AddressInfo).port}`
            );

        it("should throw for non 200 status codes", async () => {
            const server = createServer((_, res) => {
                res.writeHead(400);
                res.end();
            });
            server.listen(port++);
            const client = createClient(server);
            await expect(client.sensor(id)).rejects.toThrow(
                "Purple Air API Error."
            );
            server.close();
        });

        it("should throw for result without parent", async () => {
            const server = createServer((_, res) => {
                res.writeHead(200);
                res.end(JSON.stringify({ results: [] }));
            });
            server.listen(port++);
            const client = createClient(server);
            await expect(client.sensor(id)).rejects.toThrow(
                "Could not find parent sensor."
            );
            server.close();
        });

        it("should throw for result without humidity", async () => {
            const server = createServer((_, res) => {
                res.writeHead(200);
                res.end(JSON.stringify({ results: [{}] }));
            });
            server.listen(port++);
            const client = createClient(server);
            await expect(client.sensor(id)).rejects.toThrow(
                "Invalid parent sensor."
            );
            server.close();
        });

        it("should throw for result without temperature", async () => {
            const server = createServer((_, res) => {
                res.writeHead(200);
                res.end(JSON.stringify({ results: [{ humidity: "72" }] }));
            });
            server.listen(port++);
            const client = createClient(server);
            await expect(client.sensor(id)).rejects.toThrow(
                "Invalid parent sensor."
            );
            server.close();
        });

        it("should throw for result without pressure", async () => {
            const server = createServer((_, res) => {
                res.writeHead(200);
                res.end(
                    JSON.stringify({
                        results: [{ humidity: "72", temp_f: "60" }],
                    })
                );
            });
            server.listen(port++);
            const client = createClient(server);
            await expect(client.sensor(id)).rejects.toThrow(
                "Invalid parent sensor."
            );
            server.close();
        });

        it("should calculate aqi", async () => {
            const server = createServer((_, res) => {
                res.writeHead(200);
                res.end(
                    JSON.stringify({
                        results: [
                            {
                                Lat: 0,
                                Lon: 0,
                                humidity: "72",
                                temp_f: "60",
                                pressure: "1000",
                                pm2_5_cf_1: 15,
                            },
                            { ParentID: 0, pm2_5_cf_1: 15 },
                        ],
                    })
                );
            });
            server.listen(port++);
            const client = createClient(server);
            await expect(client.sensor(id)).resolves.toEqual({
                id,
                lat: 0,
                lon: 0,
                data: {
                    particles: 15,
                    humidity: 72,
                    temperature: 60,
                    pressure: 1000,
                    aqi: 31.405,
                },
            });
            server.close();
        });
    });
});
