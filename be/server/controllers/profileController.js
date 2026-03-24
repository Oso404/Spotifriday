import axios from "axios";

export const getProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization; // "Bearer <token>"
        if (!authHeader) return res.status(401).json({ error: "No token provided" });

        const access_token = authHeader.split(" ")[1];

        // Fetch the profile once
        const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const data = response.data;

        const profile = {
            username: data.display_name,
            profileImageUrl: data.images.length > 0 ? data.images[0].url : null,
            country: data.country,
            isPremium: data.product === "premium"
        };

        res.json(profile);
    } catch (error) {
        console.error("Error fetching Spotify profile:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};