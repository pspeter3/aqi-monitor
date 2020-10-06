import { createServer } from "http";
import { createListener } from "./listener";
import { parseParams } from "./params";

const main = (port: number): void => {
    const server = createServer(
        createListener(async (req) => {
            const url = new URL(req.url || "/", `http://localhost:${port}`);
            const params = parseParams(url.searchParams.toString());
            return params;
        })
    );
    server.listen(port);
};

if (require.main === module) {
    main(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
