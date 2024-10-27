const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Member = require("./memebers");
const {
  fetchUserProfile,
  getQuestions,
  getSubmissions,
} = require("./leetcode");
const TTLCache = require("./TTLCache");

const cache = new TTLCache("MongoDB Cache", 900);

mongoose
  .connect(config.get("db_url"))
  .then(console.log("Connected..."))
  .catch((err) => console.log(err.message));

app.use(helmet());
app.use(compression());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/api/members", async (request, response) => {
  try {
    console.log(
      `\n\n\n\n------------------------------- REQUEST SENT TO  { GET /api/members} -------------------------------\n\n\n\n`
    );
    const data = { members: [] };
    const members = await Member.find();
    for (const member of members) {
      const leetcodeProfile = await fetchUserProfile(member.leetcode);
      data.members.push({
        id: member._id,
        profileUrl: member.profileUrl,
        name: member.name,
        dateAdded: member.dateAdded,
        role: member.role,
        leetcode: member.leetcode,
        solved: leetcodeProfile.solved,
        timeToLive: leetcodeProfile.timeToLive,
      });
      member.solved = leetcodeProfile;
      cache.set(member._id.toString(), member, 1800);
    }
    data.members.sort((a, b) => b.solved.total - a.solved.total);
    response.send(data);
  } catch (err) {
    response.status(400).send(err.message);
  }
});

app.get("/api/members/:id", async (request, response) => {
  try {
    const member = cache.get(request.params.id)
      ? cache.get(request.params.id)
      : await Member.findOne({ _id: request.params.id });

    if (cache.get(request.params.id)) {
      console.log(
        `\n\n\n------------------------------- Read From Cache { GET /api/members/:id ${request.params.id}      [+]Account: ${member.leetcode} }-------------------------------\n\n\n`
      );
    } else {
      console.log(
        `\n\n\n------------------------------- REQUEST SENT TO MONGO_DB { GET /api/members/:id - ${request.params.id} }-------------------------------\n\n\n`
      );
    }

    if (!member) {
      response
        .status(400)
        .send(`User withh id: ${request.params.id} not found`);
      return;
    }
    cache.set(member._id.toString(), member, 1800);
    response.send({
      telegram: member.telegram,
      linkedin: member.linkedin,
      github: member.github,
      leetcode: member.leetcode,
      bannerUrl: member.bannerUrl,
      email: member.email,
      description: member.description,
      timeToLive: cache.getTTL(member._id.toString()),
    });
  } catch (err) {
    response.status(400).send(err.message);
  }
});

app.get("/api/questions", async (request, response) => {
  console.log(
    `\n\n\n\n------------------------------- REQUEST SENT TO  { GET /api/questions} -------------------------------\n\n\n\n`
  );
  try {
    response.send(await getQuestions());
  } catch (err) {
    response.status(400).send(err.message);
  }
});

app.get("/api/submissions/:id", async (request, response) => {
  console.log(
    `\n\n\n\n------------------------------- REQUEST SENT TO  { GET /api/submissions/:id} -------------------------------\n\n\n\n`
  );
  try {
    const member = cache.get(request.params.id)
      ? cache.get(request.params.id)
      : await Member.findOne({ _id: request.params.id });

    if (cache.get(request.params.id)) {
      console.log(
        `\n\n\n------------------------------- Read From Cache { GET /api/submissions/:id ${request.params.id}      [+]Account: ${member.leetcode} }-------------------------------\n\n\n`
      );
    } else {
      console.log(
        `\n\n\n------------------------------- REQUEST SENT TO MONGO_DB { GET /api/submissions/:id - ${request.params.id} }-------------------------------\n\n\n`
      );
    }

    if (!member) {
      response
        .status(400)
        .send(`User withh id: ${request.params.id} not found`);
      return;
    }
    response.send(await getSubmissions(member.leetcode));
    cache.set(member._id.toString(), member, 1800);
  } catch (err) {
    response.status(400).send(err.message);
  }
});

const port = process.env.PORT || 5109;
app.listen(port, () => console.log(`Started Listening on PORT: ${port}...`));
