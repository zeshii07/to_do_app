const oracle = require("oracledb");
oracle.initOracleClient({ libDir: "C:\\oraclexe\\instantclient_23_6" });

async function connectionDb() {
  let connection;

  try {
    connection = await oracle.getConnection({
      user: "zeeshan",
      password: "tiger123",
      connectString: "localhost/xe",
    });
    console.log("Connected to Oracle Database");

    // await creatData(connection);
    return connection;
  } catch (err) {
    console.log("Error connecting to Oracle Database", err);
  }
}
connectionDb();
module.exports = connectionDb;
