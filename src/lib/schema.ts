export interface PurpleParams {
    readonly key: string;
    readonly show: number | ReadonlyArray<number>;
}

export interface LocationParams {
    readonly lat: number;
    readonly lon: number;
    readonly pow?: number;
}

export interface PurpleParamsWithLocation extends PurpleParams, LocationParams {}

export type Params = PurpleParams | PurpleParamsWithLocation;

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
