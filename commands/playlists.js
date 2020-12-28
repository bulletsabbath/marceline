module.exports = {
    name: "playlists",
    aliases: ["playlist", "plist", "pl"],
    description: "Custom playlists that you can save",
    subcommands: ["import", "create", "play", "list", "delete"],
    subdesc: ["Import a playlist from YouTube, Spotify or Soundcloud", "Create a new playlist", "Load a custom playlist to play", "All playlists", "Delete a playlist"],
    run: (client, message, args) => {
        
    },
    /*
    runSubcommands: (client, msg, args) => {
        switch (args[1]) {
            case "import":
                return import(args);
            case "create":
                return create(args);
            case "play":
                return play(args);
            case "list":
                return list(args);
            case "delete":
                return delete(args);
        }
    },
    import(args) {

    },
    create(args) {
        
    }
    play(args) {
        
    },
    list(args) {

    },
    delete(args) {

    }
    */
}