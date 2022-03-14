import { RedisClient } from "../RedisClient";

let client: RedisClient

beforeAll(() => {
    client = RedisClient.Initialize();
})

afterAll((done) => {
    client.Disconnect();
    done();
});

describe("RedisClientTests", () => {

    //////////////////////////////// Pub-Sub Tests \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    it("should subscribe to channel and consume buffer", async () => {

        var channel = "foo";
        var data = {
            foo: "bar",
        };

        client.SubscribeToChannel(channel, function (message: string) {
            expect(message).toBe(
                JSON.stringify(data)
            );
        })
    })

    it("should publish to channel as buffer", async () => {
        var channel = "foo";
        var data = {
            foo: "bar",
        };

        await client.PublishMessage(channel, data);
        return;
    });

    //////////////////////////////// Read-Write Tests \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    it("should write value as buffer to redis", async () => {
        const key = "foo";
        const value = {
            foo: "bar",
        };
        await client.SetKeyValueBuffered(key, value);
        return;
    });

    it("should get value from redis", async () => {
        const key = "foo";
        const value = {
            foo: "bar",
        };
        await expect(client.GetValueForKey(key)).resolves.toBe(
            JSON.stringify(value)
        );

        return;
    });

    //////////////////////////////// Set Tests \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    it("should add to set", async () => {
        const key = "setKey";
        const value = "foo:bar"

        await client.AddToSet(key, value)
    })

    it("should list set items", async () => {
        const key = "setKey";
        const value = Array<string>("foo:bar")

        await expect(client.ListSetItems(key)).resolves.toStrictEqual(value)
    })

    it("should remove set item", async () => {
        const key = "setKey";
        const value = Array<string>("foo:bar")

        await client.RemoveFromSet(key, value)
        await expect(client.ListSetItems(key)).resolves.toHaveLength(0)
    })

    //////////////////////////////// HashSet Tests \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    it("should set hashset key value", async () => {
        const key = "hashKey"
        const value = "foo:bar"
        const hashField = "foo"
        await client.SetKeyToHashSet(key, hashField, value)
    })

    it("should get value for field from hashset", async () => {
        const key = "hashKey"
        const value ="foo:bar"
        const hashField = "foo"

        await expect(client.GetKeyFromHashSet(key,hashField)).resolves.toBe(value)
    })

    it("should remove key from hashset", async()=>{
        const key = "hashKey"
        const hashField = "foo"

        await client.RemoveKeyFromHashSet(key,hashField)

        await expect(client.GetKeyFromHashSet(key,hashField)).resolves.toBeNull()
    })

     //////////////////////////////// ZSet Tests \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

     it("should add to set", async () => {
        const key = "setKey";
        const value = "foo:bar"

        await client.AddToSortedSet(key, value)
    })

    it("should list set items", async () => {
        const key = "setKey";
        const value = Array<string>("foo:bar")

        await expect(client.GetItemsFromSortedSet(key)).resolves.toStrictEqual(value)
    })

    it("should remove set item", async () => {
        const key = "setKey";
        const value = Array<string>("foo:bar")

        await client.RemoveItemFromSortedSet(key, value)
        await expect(client.ListSetItems(key)).resolves.toHaveLength(0)
    })
});
