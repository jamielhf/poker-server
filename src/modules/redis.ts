import { createClient } from "redis";
import { redisUrl } from "../config";

class RedisServer {
  client: ReturnType<typeof createClient>;
  initRedis() {
    this.client = createClient({
      url: redisUrl,
    });
    this.client.on("error", (err: any) =>
      console.log("Redis Client Error", err)
    );
    this.client.connect();
  }
}

const redisServer = new RedisServer();
export default redisServer;
