import { AirtableError } from "airtable-lite";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { NextApiHandler } from "next";
import { ZodError } from "zod";

export interface ErrorResponse {
    readonly message: string;
}

/**
 * Wraps a handler with exception tracking.
 * @param handler The handler to wrap.
 * @returns The wrapped handler.
 */
export function withErrorHandler<T>(
    handler: NextApiHandler<T>,
): NextApiHandler<T | ErrorResponse> {
    return async function (req, res) {
        try {
            await handler(req, res);
        } catch (err) {
            if (createHttpError.isHttpError(err)) {
                res.status(err.status);
                if (err.headers) {
                    for (const [name, value] of Object.entries(err.headers)) {
                        res.setHeader(name, value);
                    }
                }
                if (err.expose) {
                    return res.json(err);
                }
                return res.end();
            }
            if (err instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST);
                res.json(err);
            }
            if (err instanceof AirtableError) {
                res.status(err.status);
                res.json(err);
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            return res.end();
        }
    };
}