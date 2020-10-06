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
