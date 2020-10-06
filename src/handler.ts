import { IncomingMessage } from "http";
import { isLocationParams, parseParams } from "./params";
import { PurpleClient } from "./purple";
import { SensorData } from "./sensor";
import { interpolate, mean } from "./summary";

export interface APIResponse {
    readonly timestamp: number;
    readonly ids: ReadonlyArray<number>;
    readonly data: SensorData;
}

export const createHandler = (
    port: number,
    client: PurpleClient
): ((req: IncomingMessage) => Promise<APIResponse>) => async (req) => {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    const params = parseParams(url.searchParams.toString());
    const { key, show } = params;
    const ids = Array.isArray(show) ? show : [show];
    const sensors = await Promise.all(ids.map((id) => client({ key, id })));
    const data = isLocationParams(params)
        ? interpolate(params, sensors)
        : mean(sensors);
    return { timestamp: Date.now(), ids, data };
};
