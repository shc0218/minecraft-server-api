const express = require("express")
const app = express()
const user = require("./UserData");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/user", user)
app.listen(port, () => {
    console.log(`http://localhost:${process.env.PORT}!`)
});