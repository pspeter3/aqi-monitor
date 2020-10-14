import createHttpError from "http-errors";
import fetch from "node-fetch";
import { stringify } from "querystring";
import { calculateAQI } from "./aqi";
import { Sensor } from "./sensor";

export type PurpleClient = (params: {
    key: string;
    id: number;
}) => Promise<Sensor>;

export const createClient = (url: string): PurpleClient => async ({
    key,
    id,
}) => {
    const res = await fetch(`${url}?${stringify({ key, show: id })}`);
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
    const aqi = calculateAQI(particles, humidity);
    const data = { particles, humidity, temperature, pressure, aqi };
    return { lat, lon, data };
};

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
