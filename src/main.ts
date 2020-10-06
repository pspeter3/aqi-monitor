import { createServer } from "http";
import { createHandler } from "./handler";
import { createListener } from "./listener";
import { createClient } from "./purple";

const main = (port: number): void => {
    const server = createServer(
        createListener(
            createHandler(port, createClient("https://www.purpleair.com/json"))
        )
    );
    server.listen(port);
};

if (require.main === module) {
    main(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
