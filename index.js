const { Client, Collection } = require("discord.js")
const fs = require("fs")
const Manager = require("./events/music/Manager")
const client = new Client({
    disableMentions: "everyone"
})

require("./events/util/eventHandler")(client);

client.config = require("./config.json")
client.commands = new Collection()
client.aliases = new Collection()

const files = fs.readdirSync("./commands").filter(f => f.endsWith(".js"))

for (let file in files) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
    client.aliases.forEach(alias => {
        client.aliases.set(alias, command.name)
    });
}

client.on("raw", d => client.manager.updateVoiceState(d))

const opt = {
    nodes: client.config.nodes,
    autoPlay: true,
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
    plugins: [ new Spotify({
        clientID: client.config.clientID,
        clientSecret: client.config.clientSecret
    })]
}

client.manager = new Manager(opt)

client.login(client.config.token);