const { MessageEmbed } = require("discord.js");
const errorchannel = "768141715638714425";
const fs = require("fs");
const find = require("lyrics-finder");

module.exports = { 
    //this is mostly so i know where the errors are
    reportError(client, guild, error, string) {
        const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`
        This happened in: \`${guild.name}\`
        When it happened: \`${string}\` 
        Message:\n
        ${error}`)
        client.channels.cache.get(errorchannel).send(embed);
    },
    generate() {
        const files = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
        const commands = [];

        for (let file of files) {
            const cmd = require(`../commands/${file}`);
            //obviously dont want these in our help list
            if (file == "reload.js" || file == "eval.js" || file == "disable.js") continue
            else commands.push(cmd);
        }

        const cmds = commands.map((cmd) => `\`${cmd.name}\` - ${cmd.description}`).join("\n");
        return cmds;

    },
    embedify(client, queue, page) {
        let embeds = [];
        if (!queue) return;
        for (let i = 0; i < queue.length; i += 10) {
            ++page;
            let songArray = [];
            let tracks = queue.slice(i, i+10);
            let j = i;
            for (let track of tracks) {
                let msg = `${++j} - ${track.title}`;
                songArray.push(msg);
            }
            let embed = new MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`\`\`\`css
${songArray.join("\n")}\`\`\``)
                .setFooter(`Page ${page}/${Math.floor(queue.length / 10)}`)
            embeds.push(embed);
        }
        return embeds;
    },
    async lyricsify(client, message, song, page) {
        let embeds = [];
        let lyrics;
        try {
            lyrics = await find(song.title, req.author);
            if (!lyrics) return null;
        } catch (e) {
            //probably a reason i commented this out so im gonna keep it that way.
            //reportError(client, message.guild, e, "In lyrics command: Couldn't search for lyrics");
            message.channel.send("Sorry, can't show the lyrics right now.")
        }

        lyrics = lyrics.split(" ");

        if (lyrics.length > 200) {
            ++page;
            for (let i = 0; i < lyrics.length; i += 200) {
                let temp = lyrics.slice(i, i + 200);
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(temp.join(" "))
                    .setFooter(`Page ${page}/${Math.floor(lyrics / 200)}`);

                embeds.push(embed);
            }

            return embeds;
        } else {
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(lyrics.join(" "))
                .setFooter("Page 1/1")

            embeds.push(embed);

            return embeds;
        }
    },
    clean(text) {
        return text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/, '@' + String.fromCharCode(8203));
    },
    //idek what this is, it probably looks cool
    percentage(current, max, length) {
        current = parseInt(current);
        max = parseInt(max);
        let percent = current / max;
        let result = "`[";
        if (!length) length = 20;
        for (let i = 0; i < length; i++) {
            if (i < percent * length) {
                result += "■";
            } else {
                result += "□";
            }
        }

        percent = Math.trunc(percent * 10000) / 100;
        result += "]`";
        return { bar: result, percent: percent };
    }
}