// app.js

const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient("mongodb://localhost:27017/");

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

connectToDatabase();

const db = client.db("project");
const usersCollection = db.collection("users");
const adminCollection=db.collection("admin")

app.get('/users', async (req, res) => {
  try {
    // Retrieve all users from the collection
    const users = await usersCollection.find().toArray();
    res.json(users); // Send the users data as JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await adminCollection.findOne({ username, password });
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    // Set session or JWT token for authentication
    // For simplicity, let's assume setting a session cookie
    // req.session.user = user;
    res.send('Login successful');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await usersCollection.findOne({ username, password });
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    // Set session or JWT token for authentication
    // For simplicity, let's assume setting a session cookie
    // req.session.user = user;
    res.send('Login successful');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
            console.log("i am in signup");
  try {
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // Insert new user
    await usersCollection.insertOne({ username, password });
    // Send success response
    res.send('Signup successful');
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('Error signing up');
  }
});

app.listen(8081);
console.log("Server Running");
