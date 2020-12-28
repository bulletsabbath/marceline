const Guild = require("../models/Guild");
const Disabled = require("../models/Disabled");
const mongoose = require("mongoose");

module.exports = async message => {
    let prefix;
    const client = message.client;
    if (message.author.bot || !message.guild) return;

    Guild.findOne({
        guildId: message.guild.id
    }, async (err, data) => {
            if (err) console.log("wtf " + err);

            if (!data) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildId: message.guild.id,
                    prefix: client.config.prefix
                })

                newGuild.save().catch(e => console.log(e));

                prefix = client.config.prefix;
            } else {
                prefix = data.prefix;
            }

            if (!message.content.startsWith(prefix)) return;
            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

            const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
            if (!command) return;

            Disabled.findOne({
                name: "global"
            }, (err, data) => {
                if (err) console.log(err);
                    if (data) {
                        if (data.cmds.includes(command)) return message.channel.send("Sorry this command is disabled momentarily!").then(async m => await m.delete({ timeout: 5000 }));
                    } 
                
            })
            command.run(client, message, args);
    })
}