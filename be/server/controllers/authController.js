/*
made the transition from having all auth logic in serve.js to over here 
*/

import axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";

dotenv.config();

export const login = (req, res) => {
  const scopes = "playlist-read-private playlist-read-collaborative user-library-read user-read-currently-playing user-read-playback-state user-read-recently-played";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scopes,
        redirect_uri: process.env.REDIRECT_URI,
      })
  );
};

export const callback = async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    res.redirect(
      `http://localhost:5173/dashboard?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`
    );
  } catch (err) {
    res.status(500).json({ error: "Auth failed" });
  }
};

export const refreshToken = async (req, res) => {
  ///originally the refresh token was sent from the fe but i have it in env file (will swtich to cookie some other time)
  const refresh_token  = process.env.REFRESH_TOKEN;
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Refresh response:", response.data);
    //need to return access token and expires in and expires at 
    const { access_token, expires_in} = response.data;
    let expires_at = Date.now() + expires_in * 1000;  
    res.json({ access_token, expires_in, expires_at });
  } catch (err) {
    res.status(500).json({ error: "Refresh failed" });
  }

};