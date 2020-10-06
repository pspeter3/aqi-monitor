import { parse } from "querystring";
import Ajv from "ajv";
import createHttpError from "http-errors";

export interface BaseParams {
    readonly key?: string;
    readonly show: number | ReadonlyArray<number>;
}

export interface LocationParams extends BaseParams {
    readonly lat: number;
    readonly lon: number;
}

export interface PowerParams extends LocationParams {
    readonly pow: number;
}

export type Params = BaseParams | LocationParams | PowerParams;

const validate = new Ajv({ coerceTypes: true }).compile({
    $schema: "http://json-schema.org/schema",
    type: "object",
    properties: {
        key: {
            type: "string",
        },
        show: {
            anyOf: [
                {
                    $ref: "#/definitions/id",
                },
                {
                    type: "array",
                    items: {
                        $ref: "#/definitions/id",
                    },
                    minItems: 2,
                    maxItems: 5,
                    uniqueItems: true,
                },
            ],
        },
        lat: {
            type: "number",
            minimum: -90,
            maximum: 90,
        },
        lon: {
            type: "number",
            minimum: -180,
            maximum: 180,
        },
        pow: {
            type: "integer",
            minimum: 0,
        },
    },
    required: ["show"],
    dependencies: {
        lat: ["lon"],
        lon: ["lat"],
        pow: ["lat", "lon"],
    },
    definitions: {
        id: {
            type: "integer",
        },
    },
});

export const parseParams = (query: string): Params | never => {
    const data: unknown = parse(query);
    const isValid = validate(data);
    if (!isValid) {
        const err = createHttpError(400, "Invalid params", {
            errors: validate.errors,
        });
        throw err;
    }
    return data as Params;
};
