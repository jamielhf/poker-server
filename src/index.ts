import Koa = require("koa");
import websockify = require("koa-websocket");
import * as route from "koa-route";
const app = websockify(new Koa());
// Note it's app.ws.use and not app.use
app.ws.use(function (ctx, next) {
  // return `next` to pass the context (ctx) on to the next ws middleware
  return next();
});

// Using routes
app.ws.use(
  route.all("/ws/channel", function (ctx) {
    const { channel } = ctx.query;
    ctx.websocket.send("Hello World");
    ctx.websocket.on("message", function (message) {
      console.log(message.toString(), channel);
    });
    ctx.websocket.on("close", () => {
      console.log("前端关闭了websocket");
    });
  })
);

app.listen(3000);
