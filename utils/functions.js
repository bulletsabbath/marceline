const { MessageEmbed } = require("discord.js");
const errorchannel = "768141715638714425";

function reportError(client, error) {
    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`ERROR MESSAGE:\n
     ${error}`)
    .setFooter("my god that's a lot of errors. good job fab, you ignoramus");
    client.channels.cache.get(errorchannel).send(embed);
}

module.exports = {
    reportError
}