import { RedisClient } from "../RedisClient";

afterAll((done) => {
    done();
});

describe("RedisClientTests", () => {
    it("should write value as buffer to redis", async () => {
        var client = RedisClient.Initialize();
        const key = "foo";
        const value = {
            foo: "bar",
        };
        await client.SetKeyValueBuffered(key, value);
        client.Disconnect();
        return;
    });

    it("should get value from redis", async () => {
        var client = RedisClient.Initialize();
        const key = "foo";
        const value = {
            foo: "bar",
        };
        await expect(client.GetValueForKey(key)).resolves.toBe(
            JSON.stringify(value)
        );

        client.Disconnect();
        return;
    });

    it("should publish to channel as buffer", async () => {
        var client = RedisClient.Initialize();
        var channel = "foo";
        var data = {
            foo: "bar",
        };

        await client.PublishMessage(channel, data);
        client.Disconnect();
        return;
    });
});
