const { Schema, model } = require("mongoose");

const Guild = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    prefix: String,
});

module.exports = model("Guild", Guild);