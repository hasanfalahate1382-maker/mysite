import { Hono } from "hono";

import { send_tel } from "#cloudflare/routes/utils.js";

const telegram = new Hono();

telegram.get("/", async (c) => {

    await send_tel(
        "with api at",
        c.env
    );

    return c.json({
        msg: "ok"
    });
});

export { telegram }