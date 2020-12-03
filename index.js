const { Client, Collection, MessageEmbed } = require("discord.js");
const { Manager } = require("erela.js");
const fs = require("fs");
const client = new Client({
    disableMentions: "everyone"
});
const Spotify = require("erela.js-spotify");

client.config = require("./config.json");
client.commands = new Collection();
client.aliases = new Collection();
//client.timeout = new Collection();

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
    setInterval(() => {
        //if my theory is correct this will check every minute and see if theres a song playing
        if (!player.queue.current) player.destroy();
    }, 60000);
})
.on("playerMove", (player, oldChannel, newChannel) => {
    if (!newChannel) return player.destroy();
    if (newChannel && oldChannel) player.voiceChannel = newChannel;
})


client.once("ready", () => {
    client.manager.init(client.user.id);
    console.log("Ready to rock 'n roll!");
    client.user.setStatus("idle");
    setInterval(() => {
        client.user.setActivity(`songs for ${client.manager.players.size} guild(s)!`);
    }, 10000);
})

client.on("message", message => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(client.config.prefix)) return;
    const [cmd, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    
    const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
    if (!command) return;
    command.run(client, message, args);

    /*
    //checks if theres a new song playing???
    //no, it doesnt.
    while (true) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return;

        const now = Date.now();
        const timestamp = client.timeout.get(message.guild.id);
        const timeout = 60000;

        if (timestamp) {
            const timedout = timestamp + timeout;

            if (now > timedout && !player.queue.current) {
                player.destroy();
                client.timeout.delete(message.guild.id);
            }
        }
    }
    */
})

//will it even reach here
client.login(client.config.token);