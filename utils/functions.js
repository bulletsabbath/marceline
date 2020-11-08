const { MessageEmbed } = require("discord.js");
const errorchannel = "768141715638714425";
const fs = require("fs");

module.exports = { 
    reportError(client, guild, error, string) {
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`
        This happened in: \`${guild.name}\`
        When it happened: \`${string}\`
        ERROR MESSAGE:\n
        ${error}`)
        .setFooter("my god that's a lot of errors. good job fab, you ignoramus");
        client.channels.cache.get(errorchannel).send(embed);
    },
    generate() {
        const files = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
        const index = files.indexOf("eval.js")
        const index1 = files.indexOf("reload.js");
        files.splice(index, 1);
        files.splice(index1, 1);
        const commands = [];

        for (let file of files) {
            const cmd = require(`../commands/${file}`);
            if (file == "reload.js" || file == "eval.js") {}
            else commands.push(cmd);
        }

        const cmds = commands.map((cmd) => `\`${cmd.name}\` - ${cmd.description}`).join("\n");
        return cmds;

    },
    clean(text) {
        return text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/, '@' + String.fromCharCode(8203));
    }
}