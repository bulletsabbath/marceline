module.exports = {
    name: "ping",
    aliases: [],
    description: "ping? pong!",
    run: async (client, message) => {
        await message.channel.send("Pinging...")
        .then(m => m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms`));
    }
}