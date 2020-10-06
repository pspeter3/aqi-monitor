import { IncomingMessage } from "http";
import { parseParams } from "./params";
import { PurpleClient } from "./purple";

export interface APIResponse {
    readonly timestamp: number;
    readonly ids: ReadonlyArray<number>;
    readonly particles: number;
    readonly humidity: number;
    readonly temperature: number;
    readonly pressure: number;
    readonly aqi: number;
}

type Measurement = keyof Omit<APIResponse, "timestamp" | "ids">;

export const createHandler = (
    port: number,
    client: PurpleClient
): ((req: IncomingMessage) => Promise<APIResponse>) => async (req) => {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    const { key, show } = parseParams(url.searchParams.toString());
    const ids = Array.isArray(show) ? show : [show];
    const sensors = await Promise.all(ids.map((id) => client({ key, id })));
    const keys: Measurement[] = [
        "particles",
        "humidity",
        "temperature",
        "pressure",
        "aqi",
    ];
    const values = sensors.reduce(
        (measurements, sensor) =>
            keys.reduce(
                (m, key) => ({ ...m, [key]: m[key] + sensor[key] }),
                measurements
            ),
        keys.reduce(
            (obj, key) => ({ ...obj, [key]: 0 }),
            {} as Record<Measurement, number>
        )
    );
    keys.forEach((key) => {
        values[key] = values[key] / ids.length;
    });
    return { timestamp: Date.now(), ids, ...values };
};
