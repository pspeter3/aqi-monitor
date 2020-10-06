import { EventEmitter } from "events";
import createHttpError from "http-errors";
import { createRequest, createResponse } from "node-mocks-http";
import { createListener } from "./listener";

describe("listener", () => {
    describe("createListener", () => {
        it("should log info", (callback) => {
            jest.spyOn(console, "info").mockReturnThis();
            const listener = createListener(async () => true);
            const req = createRequest({
                url: "/",
            });
            const res = createResponse({
                eventEmitter: EventEmitter,
            });
            listener(req, res);
            res.on("finish", () => {
                expect(console.info).toHaveBeenCalledWith(
                    expect.stringMatching(
                        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z GET \/ 200 \d+ms \d+b/
                    )
                );
                callback();
            });
        });

        it("should handle http errors", (callback) => {
            jest.spyOn(console, "info").mockReturnThis();
            const listener = createListener(async () => {
                throw createHttpError(400);
            });
            const res = createResponse({ eventEmitter: EventEmitter });
            listener(createRequest(), res);
            res.on("finish", () => {
                expect(res.statusCode).toEqual(400);
                callback();
            });
        });

        it("should handle normal errors", (callback) => {
            jest.spyOn(console, "info").mockReturnThis();
            const listener = createListener(async () => {
                throw new Error();
            });
            const res = createResponse({ eventEmitter: EventEmitter });
            listener(createRequest(), res);
            res.on("finish", () => {
                expect(res.statusCode).toEqual(500);
                callback();
            });
        });
    });
});
