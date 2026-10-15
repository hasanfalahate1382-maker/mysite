import { Hono } from "hono";

const users = new Hono();

users.get("/", (c) => {
    return c.json({
        users: []
    });
});

users.get("/:id", (c) => {
    const id = c.req.param("id");

    return c.json({
        id
    });
});

export {users};