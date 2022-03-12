import test, { ExecutionContext } from "ava";

import { RedisClient } from "../RedisClient";

// test.beforeEach((t) => {
//   t.context = {
//     client: RedisClient.Initialize(),
//   };
// });

const testSetValue = async (t: ExecutionContext, key: string, value: any) => {
    var client = RedisClient.Initialize();
    await client.SetKeyValueBuffered(key, value);
    t.pass("View Redis Client");
};

test("Write data to Redis", testSetValue, "foo", { foo: "bar" });
