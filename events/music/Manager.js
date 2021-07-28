const { Manager } = require("erela.js")

class extends Manager {

    constructor(client, opt) {
        super(opt)


        this
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
        
            channel.send(
                new MessageEmbed()
                .setColor(client.config.color)
                .setDescription("Queue has ended! I will leave the voice channel in a minute.")
                .setFooter("There is no 24/7 I'm leaving lmao")
            );
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
    }
}