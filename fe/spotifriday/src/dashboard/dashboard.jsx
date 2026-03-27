import { useEffect, useState, useRef } from "react";
import ProfileComponent from "../components/Profile";
import axios from "axios";
import "../css/dashboard.css";

function Dashboard() {
    //my tokens 
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token") || null);
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expires_in") || null);
  const [expiresAt, setExpiresAt] = useState(localStorage.getItem("expires_at") || null);

  //key song fields
  const [currentSongName, setCurrentSongName] = useState(null);
  const [currentSongArtist, setCurrentSongArtist] = useState(null);
  const [previousSongName, setPreviousSongName] = useState(null);
  const [previousSongArtist, setPreviousSongArtist] = useState(null);
  const [nextSongName, setNextSongName] = useState(null);
  const [nextSongArtist, setNextSongArtist] = useState(null);

  //imma need this to store prev song (will l8er store in storage as well or db)
  const prevSongRef = useRef();

  //still cant get the token to refresh auto...so i click button for now 
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

  //whenever current song changes, update prev and next song
  //i couldnt figure out endpoint to get prev song after experimenting with api for a while, so just store in prevRef lol
  useEffect(() => {
    if (!accessToken) return;

    const pollSongs = async () => {
      try {
        const currentRes = await axios.get("http://127.0.0.1:6969/spotify/player/current", {
            //sending header for now l8er will store in cookie/db
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const newCurrentSong = currentRes.data.curr_title;
        const newCurrentArtist = currentRes.data.curr_artist;
        //.current is used to store prev song (not actual current song)
        if (prevSongRef.current && prevSongRef.current !== newCurrentSong) {
          setPreviousSongName(prevSongRef.current);
          setPreviousSongArtist(currentSongArtist);
        }

        setCurrentSongName(newCurrentSong);
        setCurrentSongArtist(newCurrentArtist);
        prevSongRef.current = newCurrentSong;
        //because its a call to be which calls api slight delay
        const nextRes = await axios.get("http://127.0.0.1:6969/spotify/player/next", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
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

    const tokens = {
      access: access_token || localStorage.getItem("access_token"),
      refresh: refresh_token || localStorage.getItem("refresh_token"),
      expires: localStorage.getItem("expires_in"),
      expiresAt: localStorage.getItem("expires_at"),
    };

    setAccessToken(tokens.access);
    setRefreshToken(tokens.refresh);
    setExpiresIn(tokens.expires);
    setExpiresAt(tokens.expiresAt);
  }, []);

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
          <p>{previousSongName || "---"} by {previousSongArtist || "---"}</p>
        </div>

        <div className="song-section center">
          <p className="label">Now Playing</p>
          <p className="current-song">{currentSongName || "Loading..."} by {currentSongArtist || "..."}</p>
        </div>

        <div className="song-section right">
          <p className="label">Next</p>
          <p>{nextSongName || "---"} by {nextSongArtist || "---"}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;