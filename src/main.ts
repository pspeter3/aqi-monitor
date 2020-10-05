import { createServer, RequestListener } from "http";
import { name } from "./utils";

const listener: RequestListener = (req, res) => {
    const date = new Date();
    res.on("finish", () => {
        console.info(
            [
                req.connection.remoteAddress,
                date.toISOString(),
                req.method,
                req.url,
                res.statusCode,
                `${Date.now() - date.getTime()}ms`,
                `${res.getHeader("Content-Length") || 0}b`,
            ].join(" "),
        );
    });
    res.setHeader("Content-Type", "text/plain;charset=utf-8");
    res.setHeader("Content-Length", Buffer.byteLength(name, "utf-8"));
    res.writeHead(200);
    res.end(name);
};

const main = (port: number): void => {
    const server = createServer(listener);
    server.listen(port);
};

if (require.main === module) {
    main(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
