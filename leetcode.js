const TTLCache = require("./TTLCache");
const url = "https://leetcode.com/graphql";

const questions = {};
const cache = new TTLCache(3);

async function fetchUserProfile(username) {
  if (await cache.get(username)) {
    console.log(
      `------------------------------- Read From Cache 1 { NO REQUEST    [+]Account: ${username} } -------------------------------`
    );
    return {
      username: username,
      solved: cache.get(username),
      timeToLive: cache.getTTL(username),
    };
  }
  // GraphQL query

  const query =
    Object.keys(questions).length === 0
      ? `
        query getUserProfile($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                username
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
      `
      : `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;

  // Variables
  const variables = {
    username: username,
  };

  try {
    // Make the request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });
    if (response)
      console.log(
        `-------------------------------Request SENT { POST ${url}    [+]Account: ${username} }-------------------------------`
      );
    if (await cache.get(username)) {
      console.log(
        `------------------------------- Read From Cache 2 { NO REQUEST    [+]Account: ${username} } -------------------------------`
      );
      return { username: username, solved: cache.get(username) };
    }

    // Check if the response is ok (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Check for GraphQL errors
    if (data.errors) {
      throw new Error("GraphQL query errors: " + JSON.stringify(data.errors));
    }

    // Extract the relevant data
    const userData = data.data.matchedUser;
    const solvedSubmissions = userData.submitStats.acSubmissionNum;

    // Initialize the formatted data
    const formattedData = {
      username: userData.username,

      solved: {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0,
      },
    };

    // Map the questions count

    if (Object.keys(questions).length === 0) {
      console.log(
        "\n----------------------------- IN QUESTIONS CACHE -----------------------------"
      );

      data.data.allQuestionsCount.forEach((question) => {
        switch (question.difficulty) {
          case "All":
            questions.all = question.count;
            break;
          case "Easy":
            questions.easy = question.count;
            break;
          case "Medium":
            questions.medium = question.count;
            break;
          case "Hard":
            questions.hard = question.count;
            break;
        }
      });
    }

    // Map the solved submissions
    solvedSubmissions.forEach((solved) => {
      switch (solved.difficulty) {
        case "All":
          formattedData.solved.total = solved.count;
          break;
        case "Easy":
          formattedData.solved.easy = solved.count;
          break;
        case "Medium":
          formattedData.solved.medium = solved.count;
          break;
        case "Hard":
          formattedData.solved.hard = solved.count;
          break;
      }
    });

    console.log("RESSPONSE: ", response.status, "\n\n\n");
    cache.set(formattedData.username, formattedData.solved, 300);
    formattedData.timeToLive = cache.getTTL(formattedData.username);
    // Return the formatted data
    return formattedData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
}

async function getQuestions() {
  if (Object.keys(questions).length === 0) {
    const query = `
        query getUserProfile($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                username
            }
        }
        `;

    // Variables
    const variables = {
      username: "eyosi_y",
    };

    try {
      // Make the request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      });
      if (response)
        console.log(
          `-------------------------------Request SENT { POST ${url}  FOR  QUESTIONS }-------------------------------`
        );

      // Check if the response is ok (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Check for GraphQL errors
      if (data.errors) {
        throw new Error("GraphQL query errors: " + JSON.stringify(data.errors));
      }

      // Map the questions count
      data.data.allQuestionsCount.forEach((question) => {
        switch (question.difficulty) {
          case "All":
            questions.all = question.count;
            break;
          case "Easy":
            questions.easy = question.count;
            break;
          case "Medium":
            questions.medium = question.count;
            break;
          case "Hard":
            questions.hard = question.count;
            break;
        }
      });

      console.log("RESSPONSE: ", response.status, "\n\n\n");
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error for further handling if necessary
    }
  } else {
    console.log(
      "\n----------------------------- READ FROM QUESTIONS CACHE -----------------------------"
    );
  }
  return questions;
}

module.exports.fetchUserProfile = fetchUserProfile;
module.exports.getQuestions = getQuestions;
