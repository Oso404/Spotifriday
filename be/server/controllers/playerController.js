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