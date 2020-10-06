import { createServer } from "http";
import { AddressInfo } from "net";
import { createClient } from "./purple";

describe("purple", () => {
    describe("createClient", () => {
        let port = 3001;

        it("should throw for non 200 status codes", async () => {
            const server = createServer((_, res) => {
                res.writeHead(400);
                res.end();
            });
            server.listen(port++);
            const client = createClient(
                `http://localhost:${(server.address() as AddressInfo).port}`
            );
            await expect(client({ id: 1 })).rejects.toThrow(
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
            const client = createClient(
                `http://localhost:${(server.address() as AddressInfo).port}`
            );
            await expect(client({ id: 1 })).rejects.toThrow(
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
            const client = createClient(
                `http://localhost:${(server.address() as AddressInfo).port}`
            );
            await expect(client({ id: 1 })).rejects.toThrow(
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
            const client = createClient(
                `http://localhost:${(server.address() as AddressInfo).port}`
            );
            await expect(client({ id: 1 })).rejects.toThrow(
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
            const client = createClient(
                `http://localhost:${(server.address() as AddressInfo).port}`
            );
            await expect(client({ id: 1 })).rejects.toThrow(
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
                                Stats: JSON.stringify({ v1: 15 }),
                            },
                            { ParentID: 0, Stats: JSON.stringify({ v1: 15 }) },
                        ],
                    })
                );
            });
            server.listen(port++);
            const client = createClient(
                `http://localhost:${(server.address() as AddressInfo).port}`
            );
            await expect(client({ id: 1 })).resolves.toEqual({
                lat: 0,
                lon: 0,
                data: {
                    particles: 15,
                    humidity: 72,
                    temperature: 60,
                    pressure: 1000,
                    aqi: 31.749166666666667,
                },
            });
            server.close();
        });
    });
});
