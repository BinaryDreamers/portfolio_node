const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Member = require("./memebers");
const { fetchUserProfile, getQuestions } = require("./leetcode");
const cache = {};

mongoose
  .connect("mongodb://localhost/binary-dreamers")
  .then(console.log("Connected..."))
  .catch((err) => console.log(err.message));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,");
  next();
});

app.get("/api/members", async (request, response) => {
  try {
    console.log(
      `\n\n\n\n------------------------------- REQUEST SENT TO  { GET /api/membersv} -------------------------------\n\n\n\n`
    );
    const data = { questions: {}, members: [] };
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
      });
      member.solved = leetcodeProfile;
      cache[member._id] = member;
    }
    data.members.sort((a, b) => b.solved.total - a.solved.total);
    data.questions = getQuestions();
    response.send(data);
  } catch (err) {
    response.status(400).send(err.message);
  }
});

app.get("/api/members/:id", async (request, response) => {
  try {
    const member = cache[request.params.id]
      ? cache[request.params.id]
      : await Member.findOne({ _id: request.params.id });

    if (cache[request.params.id]) {
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

    cache[request.params.id] = member;

    response.send({
      telegram: member.telegram,
      linkedin: member.linkedin,
      github: member.github,
      leetcode: member.leetcode,
      bannerUrl: member.bannerUrl,
      email: member.email,
      description: member.description,
    });
  } catch (err) {
    response.status(400).send(err.message);
  }
});

const port = 5109;
app.listen(port, () => console.log(`Started Listening on PORT: ${port}...`));
