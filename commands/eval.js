const { MessageEmbed } = require("discord.js");
const { clean } = require("../utils/functions");
const fetch = require("node-fetch");
const { inspect } = require("util");
const url = require("url");

module.exports = {
    name: "eval",
    aliases: [],
    description: "evaluationn",
    run: async (client, message, args) => {
        if (message.author.id !== client.config.owner) return;
        const msg = await message.channel.send("Evaluting...");

        const evaluate = args.join(" ");
        let evaled = eval(evaluate);
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        if (evaled.includes(client.config.token || client.config.clientSecret || client.config.key) || evaled.includes(client.config.clientSecret) || evaled.includes(client.config.key)) return msg.edit("no fuck you lmao");

        try {
            let result = eval(evaluate);
            if (result instanceof Promise || (Boolean(result) && typeof result.then === 'function' && typeof result.catch === 'function')) result = await result;
            result = inspect(result, { depth: 0 });

            result = clean(result);
            

            if (result.length > 1000) {
                const bin = async (code, format) => {
                    const response = await fetch("https://hasteb.in/documents", {
                        method: "POST",
                        body: code.toString()
                    })

                    if (response.ok) {
                        const { key } = await response.json();
                        const parsed = url.parse(`https://hasteb.in/${key}.${format}`);
                        const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setDescription(`Posted in hastebin because it was too long:\n\n ${parsed}`)

                        msg.edit("", embed);
                    } else {
                        result = result.split(" ");
                        let first = result.slice(0, 100);
                        let second = result.slice(100, result.length - 1);

                        const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setDescription(first)
                        const embed1 = new MessageEmbed()
                        .setColor("RANDOM")
                        .setDescription(second)

                        message.channel.send(embed);
                        message.channel.send(embed1);
                        msg.delete();
                    }
                }
            } else {
                const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`\`\`\`js
                ${result}
                \`\`\``)
                msg.edit("", embed);
            }
        } catch (e) {
            let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("There has been an error!")
            .setDescription(`\`\`\`js
            ${e}
            \`\`\``)
            msg.edit(message.author, embed);
            throw new Error(e);
        }
    }
}