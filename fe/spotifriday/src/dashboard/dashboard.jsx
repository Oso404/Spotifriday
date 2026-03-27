import { useEffect, useState, useRef } from "react";
import ProfileComponent from "../components/Profile";
import axios from "axios";
import "../css/dashboard.css";

function Dashboard() {
    // my tokens will need to change l8er 
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token") || null);
    const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expires_in") || null);
    const [expiresAt, setExpiresAt] = useState(localStorage.getItem("expires_at") || null);

    // song fields for current, prev and next songs
    const [currentSongName, setCurrentSongName] = useState(null);
    const [currentSongArtist, setCurrentSongArtist] = useState(null);
    const [previousSongImage, setPreviousSongImage] = useState(null);
    const [previousSongName, setPreviousSongName] = useState(null);
    const [previousSongArtist, setPreviousSongArtist] = useState(null);
    const [nextSongName, setNextSongName] = useState(null);
    const [nextSongArtist, setNextSongArtist] = useState(null);
    const [currentSongImage, setCurrentSongImage] = useState(null);
    const [nextSongImage, setNextSongImage] = useState(null);

    const [currentProgress, setCurrentProgress] = useState(0);
    const [currentDuration, setCurrentDuration] = useState(0);

    /*
    after a hrs of experimenting i coudlnt figure out the whole api thing
    resorted to href polling for now (may change l8er and use web sockets )
    */
    const prevSongRef = useRef({ name: null, artist: null, image: null });

    // Refresh token manually for now
    const generateNewAccessToken = async () => {
        try {
            const response = await fetch("http://127.0.0.1:6969/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("expires_in", data.expires_in);
            localStorage.setItem("expires_at", data.expires_at);

            setAccessToken(data.access_token);
            setExpiresIn(data.expires_in);
            setExpiresAt(data.expires_at);

            console.log("New access token:", data.access_token);
        } catch (error) {
            console.error("Error generating new access token:", error);
        }
    };

    useEffect(() => {
        if (!accessToken) return;

        const pollSongs = async () => {
            try {
                const currentRes = await axios.get("http://127.0.0.1:6969/spotify/player/current", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                const newCurrentSong = currentRes.data.curr_title;
                const newCurrentArtist = currentRes.data.curr_artist;
                const currentSongImg = currentRes.data.curr_image;

                setCurrentDuration(currentRes.data.curr_duration);

                if (prevSongRef.current.name && prevSongRef.current.name !== newCurrentSong) {
                    setPreviousSongName(prevSongRef.current.name);
                    setPreviousSongArtist(prevSongRef.current.artist);
                    setPreviousSongImage(prevSongRef.current.image);
                }

                setCurrentSongName(newCurrentSong);
                setCurrentSongArtist(newCurrentArtist);
                setCurrentSongImage(currentSongImg);

                prevSongRef.current = { name: newCurrentSong, artist: newCurrentArtist, image: currentSongImg };

                const nextRes = await axios.get("http://127.0.0.1:6969/spotify/player/next", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                setNextSongImage(nextRes.data.nextSongImage);
                setNextSongName(nextRes.data.nextSongTitle);
                setNextSongArtist(nextRes.data.nextSongArtist);
            } catch (error) {
                console.error("Error polling songs:", error);
            }
        };

        pollSongs();
        const intervalId = setInterval(pollSongs, 1000);
        return () => clearInterval(intervalId);
    }, [accessToken, currentSongArtist]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const access_token = urlParams.get("access_token");
        const refresh_token = urlParams.get("refresh_token");

        setAccessToken(access_token || localStorage.getItem("access_token"));
        setRefreshToken(refresh_token || localStorage.getItem("refresh_token"));
        setExpiresIn(localStorage.getItem("expires_in"));
        setExpiresAt(localStorage.getItem("expires_at"));
    }, []);


    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get("http://127.0.0.1:6969/spotify/timestamp/", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const { progress_ms, duration_ms } = response.data;
                setCurrentProgress(progress_ms);
                console.log("Progress ms:", progress_ms, "Duration ms:", duration_ms);
            } catch (err) {
                console.error("Error fetching timestamp:", err);
            }
        }, 1000);

        return () => clearInterval(interval); 
    }, []); 


    const formatTime = (ms) => {
        if (!ms) return "0:00";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };
    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>

            <div style={{ textAlign: "center" }}>
                <button className="token-button" onClick={generateNewAccessToken}>
                    Generate new access token
                </button>
            </div>

            {/* <ProfileComponent /> */}

            <div className="song-bar">
                <div className="song-section left">
                    <p className="label">Prev</p>
                    {previousSongName ? (
                        <div className="song-row">
                            <img
                                src={previousSongImage || "placeholder.png"}
                                alt={previousSongName}
                                className="song-image"
                            />
                            <div className="song-text">
                                <p className="song-name">{previousSongName}</p>
                                <p className="song-artist">{previousSongArtist || "---"}</p>
                            </div>
                        </div>
                    ) : (
                        <p>---</p>
                    )}
                </div>

                <div className="song-section center">
                    <p className="label">Now Playing</p>
                    {currentSongName && currentSongImage ? (
                        <div className="song-row">
                            <img
                                src={currentSongImage}
                                alt={currentSongName}
                                className="song-image"
                            />
                            {/* <div className="song-text">
                                <p className="song-name">{currentSongName}</p>
                                <p className="song-artist">{currentSongArtist}</p> */}
                                <div className="song-text">
                                    <p className="song-name">{currentSongName}</p>
                                    <p className="song-artist">{currentSongArtist}</p>

                                    <div className="song-progress-container">
                                        <p className="song-timestamp">
                                            {formatTime(currentProgress)} / {formatTime(currentDuration)}
                                        </p>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: currentDuration
                                                        ? `${(currentProgress / currentDuration) * 100}%`
                                                        : "0%",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            {/* </div> */}

                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                <div className="song-section right">
                    <p className="label">Next</p>
                    {nextSongName && nextSongImage ? (
                        <div className="song-row">
                            <img
                                src={nextSongImage}
                                alt={nextSongName}
                                className="song-image"
                            />
                            <div className="song-text">
                                <p className="song-name">{nextSongName}</p>
                                <p className="song-artist">{nextSongArtist}</p>

                            </div>
                        </div>
                    ) : (
                        <p>---</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;