const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const { ConnectionDb } = require("./connection");
const { autoCommit } = require("oracledb");
const connectionDb = require("./connection");
const { error } = require("console");

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.use(express.json());
app.get("/tasks", async (req, res) => {
  try {
    // Connect to the database
    const connection = await connectionDb();
    if (!connection) {
      return res.status(500).json({ error: "Failed to connect to database" });
    }

    // Execute a query to fetch data from the 'tasks' table
    const result = await connection.execute("SELECT * FROM tasks");
    const tasks = result.rows;

    // Send the data to the client in JSON format
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks from database:", err);
    res.status(500).json({ error: "Failed to fetch tasks from database" });
  }
});
app.use(express.urlencoded({ extended: true }));

app.post("/submit", async (req, res) => {
  const { task, id } = req.body;
  console.log(task);
  try {
    let connection;
    // const query = `INSERT INTO tasks(id,task) values (:id,:task)`,{id:"2",task:task},{};
    connection = await connectionDb();
    if (!connection) {
      throw new error("failed to connect to database!");
    }
    const result = await connection.execute(
      `INSERT INTO tasks (id,task) values (:ids,:tasks)`,
      { ids: id, tasks: task },
      { autoCommit: true }
    );
    res.json({ message: `Task '${task}' added successfully` });
    console.log(result);
  } catch (err) {
    console.log(" error inserting data", err);
    res.status(500).json({ error: "Cannot store task!" });
  }
});
// Delete Task
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const connection = await connectionDb();
    if (!connection) {
      throw new Error("Failed to connect to database!");
    }
    await connection.execute(
      `DELETE FROM tasks WHERE id = :id`,
      { id: id },
      { autoCommit: true }
    );
    res.send(`The task with ID ${id} was deleted successfully`);
  } catch (err) {
    console.error("Error deleting data", err);
    res.status(500).json({ error: "Oops! Cannot delete task!" });
  }
});

// Update Task
app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { task } = req.body;
  try {
    const connection = await connectionDb();
    if (!connection) {
      throw new Error("Failed to connect to database!");
    }
    await connection.execute(
      `UPDATE tasks SET task = :task WHERE id = :id`,
      { task: task, id: id },
      { autoCommit: true }
    );
    res.send(`The task with ID ${id} was updated successfully`);
  } catch (err) {
    console.error("Error updating data", err);
    res.status(500).send("Oops! Cannot update task!");
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
