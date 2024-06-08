const sleep = require('./tools/sleep')
const express = require('express');
const userDb = require("./tools/db");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config()
const OnlieUserTableName = process.env.ONLIE_USER_TABLE;
const DatabasePath = process.env.DATABASE_PATH;

router.post('/set', (req, res) => {
    const db = new userDb();
    if (
        Object.keys(req.body).includes('UUID') &&
        Object.keys(req.body).includes('UserId') &&
        Object.keys(req.body).includes('UserHealth') &&
        Object.keys(req.body).includes('UserLevel') &&
        Object.keys(req.body).includes('UserHungryLevel') &&
        Object.keys(req.body).includes('UserLocation')
    ){
        const dataBase = db.ConnectDb(DatabasePath)
        db.CreateTable(dataBase, OnlieUserTableName)
        sleep(0.5)
        db.InsertData(
            dataBase,
            OnlieUserTableName,
            req.body["UUID"],
            req.body["UserId"],
            req.body["UserHealth"],
            req.body["UserLevel"],
            req.body["UserHungryLevel"],
            req.body["UserLocation"]
        )
        sleep(0.1)
        db.DisconnectDb(dataBase)
        res.status(200).send({status: "success"});
    } else {
        res.status(411).send({error: "Invalid Request"});
    }
});
router.post('/update', (req, res) => {
    const db  = new userDb();
    if (
        Object.keys(req.body).includes('UUID') &&
        Object.keys(req.body).includes('UserId') &&
        Object.keys(req.body).includes('UserHealth') &&
        Object.keys(req.body).includes('UserLevel') &&
        Object.keys(req.body).includes('UserHungryLevel') &&
        Object.keys(req.body).includes('UserLocation')
    ){
        const dataBase = db.ConnectDb(DatabasePath)
        db.UpdateData(
            dataBase,
            OnlieUserTableName,
            req.body["UUID"],
            req.body["UserId"],
            req.body["UserHealth"],
            req.body["UserLevel"],
            req.body["UserHungryLevel"],
            req.body["UserLocation"]
        )
        sleep(0.1);
        db.DisconnectDb(dataBase);
        res.status(200).send({status: "success"});
    } else {
        res.status(411).send({error: "Invalid Request"});
    }
});
router.post("/delete", (req, res) => {
    const db = new userDb();
    if (Object.keys(req.body).includes('UUID')) {
        const database = db.ConnectDb(DatabasePath);
        db.DeleteData(database, OnlieUserTableName, req.body["UUID"]);
        sleep(0.1);
        db.DisconnectDb(database);
    } else {
        res.status(411).send({error: "Invalid Request"});
    }
})

router.post("/getall", async (req, res) => {
    const db = new userDb();
    const database = db.ConnectDb(DatabasePath)
    const UserData = await db.GetAllData(database, OnlieUserTableName)
    db.DisconnectDb(database)
    res.status(200).send(UserData);
});

router.post("/getuser", async (req, res) => {
    const db = new userDb();
    if (Object.keys(req.body).includes('UUID')) {
        const database = db.ConnectDb(DatabasePath)
        const UserData = await db.GetUserData(database, OnlieUserTableName, req.body["UUID"]);
        db.DisconnectDb(database);
        res.status(200).send(UserData);
    } else {
        res.status(411).send({error: "Invalid Request"});
    }
});

module.exports = router;