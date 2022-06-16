const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const { query } = require("express");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m0coh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("job_portal");
    const usersCollection = database.collection("users");
    const jobsCollection = database.collection("jobs");
    const applicantsCollection = database.collection("applicants");

    // get users
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isCompany = false;
      console.log(user);
      if (user?.userType === "company") {
        isCompany = true;
      }
      res.send({ company: isCompany });
    });

    // get all jobs
    app.get("/jobs", async (req, res) => {
      const query = {};
      const cursor = jobsCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // post a jobs
    app.post("/jobs", async (req, res) => {
      const newJobs = req.body;
      const result = await jobsCollection.insertOne(newJobs);
      res.send(result);
    });

    // get single job
    app.get("/job/:id", async (req, res) => {
      const result = await jobsCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    });

    // post a applicant
    app.post("/applicants", async (req, res) => {
      const newApplicant = req.body;
      const result = await applicantsCollection.insertOne(newApplicant);
      res.send(result);
    });

    // get all applicants
    app.get("/applicants", async (req, res) => {
      const query = {};
      const cursor = applicantsCollection.find(query);
      const applicants = await cursor.toArray();
      res.send(applicants);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Job Portal!");
});
app.listen(port, () => {
  console.log(`listening at ${port}`);
});
