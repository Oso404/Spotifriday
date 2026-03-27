import axios from "axios";


export const getCurrentSong = async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ error: "Access token missing" });
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.status === 204) {
            return res.status(200).json({ message: "No song currently playing" });
        }
        if (!response.ok) {
            throw new Error("Failed to fetch current song");
        }
        const data = await response.json();
        const currentSongArtist = data.item.artists[0].name;
        const currentSongTitle = data.item.name;
        res.json({ curr_artist: currentSongArtist, curr_title: currentSongTitle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}


export const getNextSong = async (req, res) => {
    //will send access token via header from fe (will make swith later)
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ error: "Access token missing" });
    }
    try {
        const response = await axios.get(
            "https://api.spotify.com/v1/me/player/queue",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        //spotify api returns in json form (testing out endpoint in terminal)
        const queue  = response.data.queue[0]; //only want next song in queue 
        const nextSongArtist = queue?.artists[0]?.name || "No next song available rn";
        const nextSongTitle = queue?.name || "No next song available rn";
        res.json({ nextSongArtist: nextSongArtist, nextSongTitle: nextSongTitle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getPreviousSong = async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ error: "Access token missing" });
    }
    try {
        const response = await axios.get(
            "https://api.spotify.com/v1/me/player/recently-played?limit=2",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const recentTracks = response.data.items;
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}