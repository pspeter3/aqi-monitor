import { getDistance } from "geolib";
import { Sensor, SensorData, SensorMetric } from "./sensor";

const metrics: ReadonlyArray<SensorMetric> = [
    "particles",
    "humidity",
    "temperature",
    "pressure",
    "aqi",
];

const createSensorData = () =>
    metrics.reduce(
        (data, key) => ({ ...data, [key]: 0 }),
        {} as Record<SensorMetric, number>
    );

export const mean = (sensors: ReadonlyArray<Sensor>): SensorData => {
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

export const interpolate = (
    { lat, lon, pow }: { lat: number; lon: number; pow?: number },
    sensors: ReadonlyArray<Sensor>
): SensorData => {
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
