const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// TEMP STORAGE

let users = [];
let tasks = [];

// JWT MIDDLEWARE

const authMiddleware = (req, res, next) => {

  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      message: "No token"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded.id;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

// REGISTER

app.post("/api/auth/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const userExists = users.find(
      (u) => u.email === email
    );

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    };

    users.push(user);

    res.status(201).json({
      message: "Registration successful"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// LOGIN

app.post("/api/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = users.find(
      (u) => u.email === email
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// CREATE TASK

app.post("/api/tasks", authMiddleware, (req, res) => {

  const task = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: "Pending",
    userId: req.user
  };

  tasks.push(task);

  res.status(201).json(task);

});

// GET TASKS

app.get("/api/tasks", authMiddleware, (req, res) => {

  const userTasks = tasks.filter(
    (task) => task.userId === req.user
  );

  res.json(userTasks);

});

// UPDATE TASK

app.put("/api/tasks/:id", authMiddleware, (req, res) => {

  const task = tasks.find(
    (t) => t.id === req.params.id
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  task.title = req.body.title || task.title;

  task.description =
    req.body.description || task.description;

  task.status = req.body.status || task.status;

  task.priority = req.body.priority || task.priority;

  res.json(task);

});

// DELETE TASK

app.delete("/api/tasks/:id", authMiddleware, (req, res) => {

  tasks = tasks.filter(
    (t) => t.id !== req.params.id
  );

  res.json({
    message: "Task deleted"
  });

});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});