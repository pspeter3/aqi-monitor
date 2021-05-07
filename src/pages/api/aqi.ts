import createHttpError from "http-errors";
import HTTPMethod from "http-method-enum";
import { StatusCodes } from "http-status-codes";
import { NextApiHandler } from "next";
import { z } from "zod";
import { monitor, MonitorResponse } from "../../lib/monitor";
import { Purple } from "../../lib/purple";
import { withErrorHandler } from "../../lib/withErrorHandler";

const PurpleParams = z.object({
    key: z.string(),
    sensors: z.union([
        z.number().int().positive(),
        z.array(z.number().int().positive()).max(5),
    ]),
});

const InterpolationParams = z.object({
    lat: z.number(),
    lon: z.number(),
    pow: z.number().optional(),
});

const handler: NextApiHandler<MonitorResponse> = async (req, res) => {
    if (req.method !== HTTPMethod.GET) {
        throw createHttpError(StatusCodes.METHOD_NOT_ALLOWED, "", {
            headers: {
                Allow: [HTTPMethod.GET],
            },
        });
    }
    const query = PurpleParams.parse(req.query);
    const sensors = Array.isArray(query.sensors)
        ? query.sensors
        : [query.sensors];
    const client = new Purple(query.key);
    const test = InterpolationParams.safeParse(req.query);
    const data = test.success ? test.data : undefined;
    const result = await monitor(client, sensors, data);
    return res.json(result);
};

export default withErrorHandler(handler);
