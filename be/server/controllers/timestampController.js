import axios from "axios";
export const getTimeStamp = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ error: "Access token missing" });
    }

    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Spotify returns 204 if nothing is playing
    if (!response.data || !response.data.item) {
      return res.status(204).json({ message: "No track playing" });
    }

    const { progress_ms, item } = response.data;

    return res.json({
      progress_ms,
      duration_ms: item.duration_ms,
      track_name: item.name,
      artist: item.artists.map(a => a.name).join(", "),
    });

  } catch (err) {
    console.error("Backend error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch timestamp" });
  }
};