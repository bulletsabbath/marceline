const { Schema, model } = require("mongoose");

const Playlist = new Schema({
    _id: Schema.Types.ObjectId,
    url: String,
    songs: Array
});

module.exports = model("Playlist", Playlist);