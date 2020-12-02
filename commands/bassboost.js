const levels = {
    none: 0.0,
    low: 0.10,
    medium: 0.15,
    high: 0.25,
};

module.exports = {
    name: "bassboost",
    aliases: ["boost", "bass"],
    run: (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return message.channel.send("There is no song to bass boost!");

        const { channel } = message.member.voice;

        if (!channel) return message.channel.send("You need to be in a voice channel to use this command!");

        let level = "none";
        if (!args.length || !levels[args[0]) return message.channel.send("Bass boost level must be one of the following: ``none``, ``low``, ``medium``, ``high``")

        level = args[0].toLowerCase();

        player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

        return message.channel.send(`Set the bass boost to ${level}.`);
    }
}