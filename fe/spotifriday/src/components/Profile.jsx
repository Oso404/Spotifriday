import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileComponent() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:6969/spotify/profile", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.username}</h1>
      {/* <p>{profile.profileImageUrl}</p> */}
      {profile.profileImageUrl ? (
        <img
          src={profile.profileImageUrl}
          alt="Profile"
          style={{ width: "150px", borderRadius: "50%" }}
        />
      ) : (
        <p>No profile image available</p>
      )}
      <p>Country: {profile.country}</p>
      <p>Status: {profile.isPremium ? "Premium" : "Free"}</p>
    </div>
  );
}