import { PurpleClient } from "./purple";
import {
    interpolate,
    InterpolationParams,
    mean,
    Sensor,
    SensorData,
} from "./sensor";

export interface MonitorResponse {
    readonly timestamp: number;
    readonly ids: ReadonlyArray<number>;
    readonly data: SensorData;
    readonly sensors: ReadonlyArray<Sensor>;
}

/**
 * Monitors a set of sensors.
 * @param client The Purple Air API Client.
 * @param ids The sensor ids.
 * @param params The interpolation params.
 * @returns The monitoring data.
 */
export async function monitor(
    client: PurpleClient,
    ids: ReadonlyArray<number>,
    params?: InterpolationParams
): Promise<MonitorResponse> {
    const sensors = await Promise.all(ids.map((id) => client.sensor(id)));
    const data =
        params !== undefined ? interpolate(params, sensors) : mean(sensors);
    return { timestamp: Date.now(), ids, data, sensors };
}
