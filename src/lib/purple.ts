import createHttpError from "http-errors";
import { stringify } from "querystring";
import { Sensor } from "./sensor";

export interface PurpleClient {
    sensor(id: number): Promise<Sensor>;
}

/**
 * PurpleAir API Client.
 */
export class Purple implements PurpleClient {
    private readonly key: string;
    private readonly url: string;

    private static readonly AQI_LIMITS = [
        [0, 0],
        [12.0, 50],
        [35.4, 100],
        [55.4, 150],
        [150.4, 200],
        [250.4, 300],
        [500.4, 500],
    ] as const;

    /**
     * Calculates the EPA AQI value from Purple Air sensor data.
     * @param particles The sensor particles data.
     * @param humidity The sensor humity data.
     * @returns The EPA AQI value.
     */
    static epa(particles: number, humidity: number): number {
        const value = 0.534 * particles - 0.0844 * humidity + 5.604;
        for (const [index, [maxPM, maxAQI]] of Purple.AQI_LIMITS.entries()) {
            if (value < maxPM) {
                const [minPM, minAQI] = Purple.AQI_LIMITS[index - 1];
                return (
                    ((maxAQI - minAQI) / (maxPM - minPM)) * (value - minPM) +
                    minAQI
                );
            }
        }
        throw new Error(`Could not calculate AQI for ${value}`);
    }

    /**
     * Constructs a PurpleClient.
     * @param key The Purple Air API Key.
     * @param url The Purple Air API URL.
     */
    constructor(key: string, url = "https://www.purpleair.com/json") {
        this.key = key;
        this.url = url;
    }

    /**
     * Fetches sensor data from Purple Air.
     * @param id The sensor id.
     * @returns The sensor data.
     */
    async sensor(id: number): Promise<Sensor> {
        const res = await fetch(
            `${this.url}?${stringify({ key: this.key, show: id })}`
        );
        if (res.status !== 200) {
            throw createHttpError(res.status, "Purple Air API Error.");
        }
        const { results } = (await res.json()) as Response;
        const index = results.findIndex(
            (result: { ParentID?: number }) => result.ParentID === undefined
        );
        if (index === -1) {
            throw new Error("Could not find parent sensor.");
        }
        const parent = results[index];
        if (!parent.humidity || !parent.temp_f || !parent.pressure) {
            throw new Error("Invalid parent sensor.");
        }
        const lat: number = parent.Lat;
        const lon: number = parent.Lon;
        const particles =
            results
                .map((result) => parseFloat(result.pm2_5_cf_1))
                .reduce((sum, value) => sum + value) / results.length;
        const humidity = parseFloat(parent.humidity);
        const temperature = parseFloat(parent.temp_f);
        const pressure = parseFloat(parent.pressure);
        const aqi = Purple.epa(particles, humidity);
        const data = { particles, humidity, temperature, pressure, aqi };
        return { id, lat, lon, data };
    }
}

interface Response {
    mapVersion: string;
    baseVersion: string;
    mapVersionString: string;
    results: Result[];
}

interface Result {
    ID: number;
    Label: string;
    DEVICE_LOCATIONTYPE?: string;
    THINGSPEAK_PRIMARY_ID: string;
    THINGSPEAK_PRIMARY_ID_READ_KEY: string;
    THINGSPEAK_SECONDARY_ID: string;
    THINGSPEAK_SECONDARY_ID_READ_KEY: string;
    Lat: number;
    Lon: number;
    PM2_5Value: string;
    LastSeen: number;
    Type?: string;
    Hidden: string;
    DEVICE_BRIGHTNESS?: string;
    DEVICE_HARDWAREDISCOVERED?: string;
    Version?: string;
    LastUpdateCheck?: number;
    Created: number;
    Uptime?: string;
    RSSI?: string;
    Adc?: string;
    p_0_3_um: string;
    p_0_5_um: string;
    p_1_0_um: string;
    p_2_5_um: string;
    p_5_0_um: string;
    p_10_0_um: string;
    pm1_0_cf_1: string;
    pm2_5_cf_1: string;
    pm10_0_cf_1: string;
    pm1_0_atm: string;
    pm2_5_atm: string;
    pm10_0_atm: string;
    isOwner: number;
    humidity?: string;
    temp_f?: string;
    pressure?: string;
    AGE: number;
    Stats: string;
    ParentID?: number;
}
