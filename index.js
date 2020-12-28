const { Client, Collection, MessageEmbed } = require("discord.js");
const { Manager } = require("erela.js");
const fs = require("fs");
const client = new Client({
    disableMentions: "everyone"
});
const Spotify = require("erela.js-spotify");
const mongoose = require("mongoose");

require("./utils/eventHandler")(client);

client.config = require("./config.json");
client.commands = new Collection();
client.aliases = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    command.aliases.forEach(alias => {
        client.aliases.set(alias, command.name);
    });
};

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.manager = new Manager({
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
})
.on("nodeConnect", node => console.log(`Connected to node ${node.options.identifier}.`))
.on("nodeError", (err) => {
    throw new Error(err);
})
.on("trackStart", (player, track) => {
    const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`)
    const channel = client.channels.cache.get(player.textChannel);
    channel.send(embed);
})
.on("queueEnd", player => {
    const channel = client.channels.cache.get(player.textChannel);
    const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setDescription("Queue has ended! I will leave the voice channel in a minute.")
        .setFooter("There is no 24/7 so I'm leaving lmao")

    channel.send(embed);
    setTimeout(() => {
        if (player.guild == "768141715101843538") return;
        if (!player.queue.current) player.destroy();
    }, 60000);
})
.on("playerMove", (player, oldChannel, newChannel) => {
    if (!newChannel) return player.destroy();
    if (newChannel && oldChannel) player.voiceChannel = newChannel;
})
.on("playerCreate", player => {
    client.user.setActivity(`Playing songs in ${client.manager.players.size} guild${client.manager.players.size == 1 ? "" : "s"}!`);
})
.on("playerDestroy", player => {
    client.user.setActivity(`Playing songs in ${client.manager.players.size} guild${client.manager.players.size == 1 ? "" : "s"}!`);
})

mongoose.connect(`mongodb+srv://admin:${client.config.dbPass}@cluster0.e4zxl.mongodb.net/marceline?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("connects to database cutely (without an e because i want to stabby stab myself)");
});

client.login(client.config.token);