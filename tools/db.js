const Sql = require('sqlite3').verbose();
class Userdb {
    ConnectDb(path) {
        const database = new Sql.Database(path);
        return database;
    }
    CreateTable(db, TableName) {
        db.run(`CREATE TABLE IF NOT EXISTS ${TableName} (
        UUID TEXT UNIQUE , 
        UserName TEXT UNIQUE, 
        UserHealth INT, 
        UserLevel INT, 
        UserHungryLevel INT, 
        UserLocation TEXT);`
        );
    }
    InsertData(db, TableName, UUID, UserName, UserHealth, UserLevel, UserHungryLevel, UserLocation) {
        db.run(
            `INSERT INTO ${TableName} (UUID, UserName, UserHealth, UserLevel, UserHungryLevel, UserLocation)
                SELECT '${UUID}', '${UserName}', ${UserHealth}, ${UserLevel}, ${UserHungryLevel}, '[${UserLocation}]'
                WHERE NOT EXISTS (SELECT 1 FROM ${TableName} WHERE UUID = '${UUID}');`
        );
    }
    UpdateData(db, TableName, UUID, UserName, UserHealth, UserLevel, UserHungryLevel, UserLocation) {
        db.run(
            `UPDATE ${TableName} SET 
                UserName = '${UserName}', 
                UserHealth = ${UserHealth}, 
                UserLevel = ${UserLevel}, 
                UserHungryLevel = ${UserHungryLevel}, 
                UserLocation = '[${UserLocation}]' 
                WHERE UUID = '${UUID}';`
        );
    }
    GetAllData(db, TableName) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${TableName}`, [], (err, rows) => {
                if (err) {
                    return resolve({"에러": "데이터가 존재하지 않음"});
                }
                let result = []
                rows.forEach((row) => {
                    let UserLocation= row["UserLocation"].replace("[", "").replace("]", "").split(",")
                    UserLocation.forEach((element) => {
                        UserLocation[UserLocation.indexOf(element)] = parseInt(element);
                    })
                    result.push({
                        "UUID": row["UUID"],
                        "UserName": row["UserName"],
                        "UserHealth": row["UserHealth"],
                        "UserLevel": row["UserLevel"],
                        "UserHungryLevel": row["UserHungryLevel"],
                        "UserLocation": UserLocation,
                    });
                });
                resolve(result);
            });
        });
    }
    GetUserData(db, TableName, UUID) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${TableName} WHERE UUID = '${UUID}';`, [], (err, rows) => {
                rows.forEach((row) => {
                    let UserLocation = row["UserLocation"].replace("[", "").replace("]", "").split(",")
                    UserLocation.forEach((element) => {
                        UserLocation[UserLocation.indexOf(element)] = parseInt(element);
                        resolve({
                            "UUID": row["UUID"],
                            "UserName": row["UserName"],
                            "UserHealth": row["UserHealth"],
                            "UserLevel": row["UserLevel"],
                            "UserHungryLevel": row["UserHungryLevel"],
                            "UserLocation": UserLocation,
                        });
                    })
                });
            });
        });
    }
    DeleteData(db, TableName, UUID) {
        db.run(
            `DELETE FROM ${TableName} WHERE UUID = '${UUID}';`
        );
    }


    DisconnectDb(db) {
        db.close()
    }
}

module.exports = Userdb;