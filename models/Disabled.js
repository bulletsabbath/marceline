const { Schema, model } = require("mongoose");

const Disabled = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    cmds: Array
});

module.exports = model("Disabled", Disabled);