const { MessageEmbed } = require("discord.js");
const { reportError } = require("../utils/functions");

module.exports = {
    name: "clearqueue",
    aliases: ["cq"],
    description: "as clean and smooth as a baby's butt!",
    run: (client, message) => {
        const player = client.manager.players.get(message.guild.id);
        
        if (!player) return message.channel.send("There is no queue to clear???");
        if (!player.queue) return message.channel.send("There is no queue to clear!");
        
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`
            Oh shit oh fuck are you sure? <:shake:772882367340871702>

            Gotta warn you mate if you clear the queue you'll never get it back?

            :white_check_mark: Clear it!
            :negative_squared_cross_mark: OMG NVM I CHANGED MY MIND (or just wait a minute)
        `)

        message.channel.send(embed)
        .then(async msg => {
            await msg.react("✅");
            await msg.react("❎");

            const filter = (reaction, user) => reaction.emoji.name === `✅` || reaction.emoji.name === `❎` && user.id === call.message.author.id;
            const collector = msg.createReactionCollector(filter, { time: 30000 });
    
            collector.on("collect", (reaction, user) => {
                try {
                    if (reaction.emoji.name === "✅") {
                        player.queue.clear()
                        .then(() => {
                            message.channel.send("Cleared queue!");
                        })
                    } else if (reaction.emoji.name === "❎") {
                        message.channel.send("Okay, cancelled command.");
                    } else {
                        collector.stop();
                    }
                } catch (e) {
                    message.channel.send("Oops! Cannot clear queue right now, try again later?");
                    reportError(client, message.guild, e, "In clearQueue command: Cannot collect reactions.");
                }
            })

            collector.on("end", () => {});
        })
    }
}