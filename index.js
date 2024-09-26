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
  console.log("\n\n\n Middleware -ON NNN");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,");
  next();
});

app.get("/api/members", async (request, response) => {
  try {
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

    if (!member) {
      response
        .status(400)
        .send(`User withh id: ${request.params.id} not found`);
      return;
    }

    if (!member.solved) {
      console.log(`\n\n\n Username: ${member.leetcode} \n\n\n\n`);
      member.solved = (await fetchUserProfile(member.leetcode)).solved;
    }
    response.send({
      telegram: member.telegram,
      linkedin: member.linkedin,
      github: member.github,
      leetcode: member.leetcode,
      bannerUrl: member.bannerUrl,
      email: member.email,
      description: member.description,
      //   easy: member.solved.easy,
      //   medium: member.solved.medium,
      //   hard: member.solved.hard,
    });
  } catch (err) {
    response.status(400).send(err.message);
  }
});

const port = 5109;
app.listen(port, () => console.log(`Started Listening on PORT: ${port}...`));
