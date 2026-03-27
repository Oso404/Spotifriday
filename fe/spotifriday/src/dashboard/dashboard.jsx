import { useEffect, useState } from "react";
import ProfileComponent from "../components/Profile";
import axios from "axios";

function Dashboard() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token") || null);
    const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expires_in") || null);
    const [expiresAt, setExpiresAt] = useState(localStorage.getItem("expires_at") || null);
    const [currentSongName, setCurrentSongName] = useState(null);
    const [currentSongArtist, setCurrentSongArtist] = useState(null);
    const [nextSongName, setNextSongName] = useState(null);
    const [nextSongArtist, setNextSongArtist] = useState(null);
    const [previousSongName, setPreviousSongName] = useState(null);
    const [previousSongArtist, setPreviousSongArtist] = useState(null);

    const [profile, setProfile] = useState(null);



    // Function moved inside component so it can access state setters
    const generateNewAccessToken = async () => {
        try {
            //modifying function so can call our new refresh endpoint (/refresh -> /auth/refresh)
            const response = await fetch("http://127.0.0.1:6969/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

            });

            const data = await response.json();

            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("expires_in", data.expires_in);
            localStorage.setItem("expires_at", data.expires_at);

            setAccessToken(data.access_token);
            setExpiresIn(data.expires_in);
            setExpiresAt(data.expires_at);

            console.log("New access token:", data.access_token);
            console.log("Expires in:", data.expires_in);
            console.log("Expires at:", data.expires_at);
        } catch (error) {
            console.error("Error generating new access token:", error);
        }
    };

    const viewCurrentSong = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:6969/spotify/player/current", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setCurrentSongName(response.data.curr_title);
            setCurrentSongArtist(response.data.curr_artist);
        } catch (error) {
            console.error("Error fetching current song:", error);
        }
    };

    const viewNextSong = async () => {
        try {
            const res = await axios.get("http://127.0.1:6969/spotify/player/next", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(res.data.nextSongTitle, res.data.nextSongArtist);
            setNextSongName(res.data.nextSongTitle);
            setNextSongArtist(res.data.nextSongArtist);
        } catch (error) {
            console.error("Error fetching next song:", error);
        }

    }


    const fetchPreviousSong = async () => {

        
    };


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const access_token = urlParams.get("access_token");
        const refresh_token = urlParams.get("refresh_token");

        const tokens = {
            access: access_token || localStorage.getItem("access_token"),
            refresh: refresh_token || localStorage.getItem("refresh_token"),
            expires: localStorage.getItem("expires_in"),
            expiresAt: localStorage.getItem("expires_at"),
        };


        const now = Date.now(); // rn
        console.log("Current time (ms):", now);
        console.log("Token expires at (ms):", tokens.expiresAt);
        // Convert expiresAt to a number (in case it's stored as string)
        const expiresAt = Number(tokens.expiresAt);

        // Check if token is expired
        const isExpired = now >= expiresAt * 1000;

        if (isExpired) {
            console.log("Access token expired, need to refresh");
        } else {
            console.log("Access token still valid");
        }




        setAccessToken(tokens.access);
        setRefreshToken(tokens.refresh);
        setExpiresIn(tokens.expires);
        setExpiresAt(tokens.expiresAt);

        window.history.replaceState({}, document.title, "/dashboard");



    }, []);



    return (
        <div>
            <h1>Dashboard</h1>
            <p>Access Token: {accessToken}</p>
            <p>Refresh Token: {refreshToken}</p>
            <p>Expires In: {expiresIn} seconds</p>
            <p>Expires At: {expiresAt}</p>

            <button>View current user's playlist</button>
            <button onClick={generateNewAccessToken}>
                Generate new access token!
            </button>
            <ProfileComponent />

            <p>Current Song: {currentSongName} by {currentSongArtist}</p>
            <p>Next Song: {nextSongName} by {nextSongArtist}</p>
            <p>Previous Song: {previousSongName} by {previousSongArtist}</p>
            <button onClick={viewCurrentSong}>View current song playing!</button>
            <button onClick={viewNextSong}>View next song</button>
            <button onClick={fetchPreviousSong}>View previous song</button>
        </div>
    );
}

export default Dashboard;