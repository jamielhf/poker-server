import Koa = require("koa");
import websockify = require("koa-websocket");
import * as route from "koa-route";
import bodyParser = require("koa-bodyparser");
import cookie = require("koa-cookie");
import redis from "./modules/redis";
import server from "./server/index";

redis.initRedis();
const app = websockify(new Koa());
app.use(cookie());
app.use(bodyParser());
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Headers", "Content-Type");
  ctx.set("Access-Control-Allow-Methods", "POST");
  await next();
});
app.use(route.post("/poker/register", server.register));
app.use(route.post("/poker/login", server.login));
// Using routes
app.ws.use(route.all("/ws/channel", server.websocket));
app.listen(3000);
