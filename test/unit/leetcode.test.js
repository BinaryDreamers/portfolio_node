const {
  fetchUserProfile,
  getQuestions,
  getSubmissions,
} = require("../../leetcode");

describe("Retrive Data from leetcode", () => {
  const username = "eyosi_y";
  it("should return a vaild user info", async () => {
    const info = await fetchUserProfile(username);
    expect(info).toHaveProperty("username", username);
  });

  it("should return a vaild user submission", async () => {
    const info = await getSubmissions(username);
    expect(info).toHaveProperty("submissions");
  });

  it("should return a vaild questions", async () => {
    const info = await getQuestions(username);
    expect(info).toHaveProperty("all");
    expect(info).toHaveProperty("easy");
    expect(info).toHaveProperty("medium");
    expect(info).toHaveProperty("hard");
  });
});
