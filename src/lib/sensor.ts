import { getDistance } from "geolib";

export interface SensorData {
    readonly particles: number;
    readonly humidity: number;
    readonly temperature: number;
    readonly pressure: number;
    readonly aqi: number;
}

export type SensorMetric = keyof SensorData;

export interface Sensor {
    readonly id: number;
    readonly lat: number;
    readonly lon: number;
    readonly data: SensorData;
}

const metrics: ReadonlyArray<SensorMetric> = [
    "particles",
    "humidity",
    "temperature",
    "pressure",
    "aqi",
];

function createSensorData(): Record<SensorMetric, number> {
    return metrics.reduce(
        (data, key) => ({ ...data, [key]: 0 }),
        {} as Record<SensorMetric, number>
    );
}

/**
 * Calculates the mean sensor data for a list of sensors.
 * @param sensors The sensors to evaluate.
 * @returns The mean sensor data.
 */
export function mean(sensors: ReadonlyArray<Sensor>): SensorData {
    const data = createSensorData();
    for (const sensor of sensors) {
        for (const metric of metrics) {
            data[metric] += sensor.data[metric];
        }
    }
    for (const metric of metrics) {
        data[metric] = data[metric] / sensors.length;
    }
    return data;
};

export interface InterpolationParams {
    readonly lat: number;
    readonly lon: number;
    readonly pow?: number;
}

/**
 * Interpolates sensor data from a list of sensors.
 * @param params The interpolation params.
 * @param sensors The sensors to evaluate.
 * @returns The interpolated sensor data.
 */
export function interpolate(
    { lat, lon, pow }: InterpolationParams,
    sensors: ReadonlyArray<Sensor>
): SensorData {
    const power = pow || 1;
    let total = 0;
    const data = createSensorData();
    for (const sensor of sensors) {
        const weight =
            1 /
            Math.pow(
                getDistance(
                    { lat, lon },
                    { lat: sensor.lat, lon: sensor.lon }
                ) + Number.EPSILON,
                power
            );
        total += weight;
        for (const metric of metrics) {
            data[metric] += weight * sensor.data[metric];
        }
    }
    for (const metric of metrics) {
        data[metric] = data[metric] / total;
    }
    return data;
};
