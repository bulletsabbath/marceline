const { MessageEmbed } = require("discord.js");
const { Player } = require("erela.js");

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "Quuee? Que? Q! Q-tips?? wazzafak is this and how do you pronounce it",
    run: async (client, message) => {
        let page = 0;
        const embed = new MessageEmbed()
        .setColor("RANDOM");

        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send("There is no queue in this guild!");

        if (player.queue.length <= 10) {

        } else if (player.queue.length > 10) {
            
        }
    }
}