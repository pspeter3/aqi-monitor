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
