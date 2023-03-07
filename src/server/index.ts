import Koa = require("koa");
import redis from "../modules/redis";
import { IBaseResp, EStatus } from "../interface";
import { generateUUID } from "../utils/utils";
const room: Record<string, string[]> = {};
export default {
  register: async (ctx: Koa.Context) => {
    const { username, password } = ctx.request.body as Record<string, string>;
    const resp: IBaseResp = {
      status: EStatus.fail,
      msg: "失败",
      data: {},
    };
    if (username && password) {
      const value = await redis.client.HGETALL(username);
      if (value.username) {
        resp.status = EStatus.fail;
        resp.msg = "已存在用户";
      } else {
        await redis.client.HSET(username, "username", username);
        await redis.client.HSET(username, "password", password);
        resp.status = EStatus.success;
        resp.msg = "成功";
      }
    }
    ctx.body = resp;
  },
  login: async (ctx: Koa.Context) => {
    const { username, password } = ctx.request.body as Record<string, string>;
    const resp: IBaseResp = {
      status: EStatus.fail,
      msg: "失败",
      data: {},
    };
    if (username) {
      const value = await redis.client.HGETALL(username);
      if (value.username && password === value.password) {
        resp.status = EStatus.success;
        resp.msg = "成功";
        resp.data = value;
      }
    }
    ctx.body = resp;
  },
  websocket: async (ctx: Koa.Context) => {
    const { channel } = ctx.query;
    const nChannel = String(channel);
    if (nChannel) {
      if (!room[nChannel]) {
        room[nChannel] = [];
      }
      room[nChannel].push();
    }
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
  },
};
