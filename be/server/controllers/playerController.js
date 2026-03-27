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
        const currentSongImage = data.item.album.images[0].url; //think imma use this l8er for fun
        res.json({ curr_artist: currentSongArtist, curr_title: currentSongTitle, curr_image: currentSongImage });
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
        const queue = response.data.queue[0]; //only want next song in queue 
        const nextSongArtist = queue?.artists[0]?.name || "No next song available rn";
        const nextSongTitle = queue?.name || "No next song available rn";
        const nextSongImage = queue?.album?.images[0]?.url || null; //store for now
        res.json({ nextSongArtist: nextSongArtist, nextSongTitle: nextSongTitle, nextSongImage: nextSongImage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//this endpoint isnt functioning as i need rn 
export const getPreviousSong = async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const timeStamp = Date.now();
    if (!accessToken) {
        return res.status(401).json({ error: "Access token missing" });
    }
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/me/player/recently-played?limit=2`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const items = response.data.items;
        if (items.length < 2) {
            return res.json({ message: "No previous song found" });
        }

        const previousSong = items[1].track; 
        res.json({
            previousSongName: previousSong.name,
            previousSongArtist: previousSong.artists.map(a => a.name).join(", "),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}