import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import playerRoutes from './routes/playerRoutes.js'


dotenv.config() 

const port = process.env.PORT
const app = express()

app.use(
    cors({
        origin: 'http://localhost:5173',
    })
)

app.use("/auth", authRoutes) 
app.use("/spotify/profile", profileRoutes)
app.use("/spotify/player", playerRoutes)


app.listen(port, "127.0.0.1", () => {
    console.log(`Server is running on port ${port}`)
})





