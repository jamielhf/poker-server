import Koa = require("koa");
import websockify = require("koa-websocket");
import * as route from "koa-route";
import { redisUrl } from "./config";
import bodyParser = require("koa-bodyparser");
import { IBaseResp, EStatus } from "./interface";
import redis from "./modules/redis";
import server from "./server/index";

redis.initRedis();
const app = websockify(new Koa());
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
app.ws.use(
  route.all("/ws/channel", async function (ctx) {
    const { channel } = ctx.query;
    ctx.websocket.send("Hello World");
    ctx.websocket.on("message", function (message) {
      console.log(message.toString(), channel);
    });
    ctx.websocket.on("open", function (message: any) {
      console.log("open", message);
    });
    ctx.websocket.on("close", () => {
      console.log("前端关闭了websocket");
    });
  })
);
app.listen(3000);
