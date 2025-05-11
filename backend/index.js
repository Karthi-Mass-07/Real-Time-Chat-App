const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const userRoutes = require("./routes/UserRoutes");
const messageRoutes = require("./routes/MessageRoutes")



dotenv.config({ path: path.resolve(__dirname, "config", ".env") });
connectDB();


const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/user",userRoutes);
app.use("/api/message",messageRoutes);



const PORT = process.env.PORT || 5050;
app.listen(PORT, ()=>console.log(`Server runnning port ${PORT}`));

