const { MessageEmbed } = require("discord.js");
const { embedify } = require("../utils/functions");

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "shows the current queue",
    run: async (client, message) => {
        const player = client.manager.get(message.guild.id);

        if (!player) return message.channel.send("There is no player in this guild!");
        if (!player.queue) return message.channel.send("There is no queue to show lol");

        let page = 0;
        const embeds = embedify(message, player.queue);
    }
}