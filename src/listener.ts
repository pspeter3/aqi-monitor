import { IncomingMessage, RequestListener, ServerResponse } from "http";
import { isHttpError } from "http-errors";

const logRequest = (req: IncomingMessage, res: ServerResponse): void => {
    const start = new Date();
    res.on("finish", () => {
        console.info(
            [
                req.socket.remoteAddress,
                start.toISOString(),
                req.method,
                req.url,
                res.statusCode,
                `${Date.now() - start.getTime()}ms`,
                `${res.getHeader("Content-Length")}b`,
            ].join(" ")
        );
    });
};

const writeResponse = (res: ServerResponse): ((data: unknown) => void) => (
    data
) => {
    const statusCode = isHttpError(data)
        ? data.statusCode
        : data instanceof Error
        ? 500
        : 200;
    const body = JSON.stringify(data);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", Buffer.byteLength(body, "utf-8"));
    res.writeHead(statusCode);
    res.end(body);
};

export const createListener = (
    handler: (req: IncomingMessage) => Promise<unknown>
): RequestListener => (req, res) => {
    logRequest(req, res);
    const write = writeResponse(res);
    handler(req).then(write, write);
};
