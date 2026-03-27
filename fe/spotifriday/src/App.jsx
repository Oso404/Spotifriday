import './App.css'

function App() {
  return (
  <div className="container">
    <button className="rounded-btn" onClick={()=>{
      console.log("just pressed!")
      //send to our be endpoint -> /login our server is in port 6969
      const token = localStorage.getItem("access_token");
      const expiresAt = localStorage.getItem("expires_at");
      /*
      i noticed tokens aren't matching up 
      */
      if (!token || Date.now() >= expiresAt) {
        console.log("Token is missing or expired, redirecting to login...");
        window.location.href = "http://127.0.0.1:6969/auth/login" //changed to /auth/login 
      }else{
        console.log("Token is valid, redirecting to dashboard...");
        window.location.href = "http://localhost:5173/dashboard"
      }
    }}>
      press to give me permission!
    </button>
    <button  className="rounded-btn" onClick={() => {
        window.location.href = "http://127.0.0.1:6969/auth/login"
    }}>f it manual re-authorization</button>
  </div>
);
}

export default App
