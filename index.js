const { Client, Collection, MessageEmbed } = require("discord.js");
const { Manager } = require("erela.js");
const fs = require("fs");
const client = new Client({
    disableMentions: "everyone"
});
const embed = new MessageEmbed()
.setColor("RANDOM")

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
    selfDeafen: true,
    autoPlay: true,
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
    selfDeafen: true
})
.on("nodeConnect", node => console.log(`Connected to node ${node.options.identifier}.`))
.on("nodeError", (err) => {
    throw new Error(err);
})
.on("trackStart", (player, track) => {
    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`)
    const channel = client.channels.cache.get(player.textChannel);
    channel.send(embed);
})
.on("queueEnd", player => {
    const channel = client.channels.cache.get(player.textChannel);
    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription("Queue has ended! I will leave the voice channel in a minute.")
    .setFooter("24/7 is not available yet so whether you like it or not I'm leaving!")

    channel.send(embed);
    const timeout = setTimeout(() => player.destroy(), 60000);
    clearTimeout(timeout);
});


client.once("ready", () => {
    client.manager.init(client.user.id);
    console.log("Ready to rock 'n roll!");
})

client.on("message", message => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(client.config.prefix)) return;
    const [cmd, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    
    const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
    if (!command) return;
    command.run(client, message, args);
})

client.login(client.config.token);