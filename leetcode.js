const TTLCache = require("./TTLCache");
const url = "https://leetcode.com/graphql";

const questions_cache = {};
const user_profile_cache = new TTLCache("Members Cache", 120);
const user_submission_cache = new TTLCache("Submissions Cache", 10);

async function fetchUserProfile(username) {
  if (await user_profile_cache.get(username)) {
    console.log(
      `------------------------------- Read From Cache 1 { NO REQUEST    [+]Account: ${username} } -------------------------------`
    );
    return {
      username: username,
      solved: user_profile_cache.get(username),
      timeToLive: user_profile_cache.getTTL(username),
    };
  }
  // GraphQL query

  const query =
    Object.keys(questions_cache).length === 0
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
    if (await user_profile_cache.get(username)) {
      console.log(
        `------------------------------- Read From Cache 2 { NO REQUEST    [+]Account: ${username} } -------------------------------`
      );
      return {
        username: username,
        solved: user_profile_cache.get(username),
        timeToLive: user_profile_cache.getTTL(username),
      };
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
    user_profile_cache.set(formattedData.username, formattedData.solved, 300);
    formattedData.timeToLive = user_profile_cache.getTTL(
      formattedData.username
    );
    // Return the formatted data
    return formattedData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
}

async function getQuestions() {
  if (Object.keys(questions_cache).length === 0) {
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
            questions_cache.all = question.count;
            break;
          case "Easy":
            questions_cache.easy = question.count;
            break;
          case "Medium":
            questions_cache.medium = question.count;
            break;
          case "Hard":
            questions_cache.hard = question.count;
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
  return questions_cache;
}

async function getSubmissions(username) {
  if (await user_submission_cache.get(username)) {
    console.log(
      `------------------------------- Read From Cache 1 { NO REQUEST    [+]Account: ${username} [*] SUBMISSION } -------------------------------`
    );
    return {
      submissions: user_submission_cache.get(username),
      timeToLive: user_submission_cache.getTTL(username),
    };
  }
  const query = `
        query getUserProfile($username: String!) {
        
            recentSubmissionList(username: $username, limit: 20) {
                title
                timestamp
                statusDisplay
                lang
            }
        }`;

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
        `-------------------------------Request SENT { POST ${url}    [+]Account: ${username} [*] SUBMISSION }-------------------------------`
      );
    if (await user_submission_cache.get(username)) {
      console.log(
        `------------------------------- Read From Cache 2 { NO REQUEST    [+]Account: ${username} [*] SUBMISSION } -------------------------------`
      );
      return {
        submissions: user_submission_cache.get(username),
        timeToLive: user_submission_cache.getTTL(username),
      };
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
    const recentSubmissionList = data.data.recentSubmissionList;

    console.log("RESSPONSE: ", response.status, "\n\n\n");
    user_submission_cache.set(username, recentSubmissionList, 30);
    // Return the formatted data
    return {
      submissions: recentSubmissionList,
      timeToLive: user_submission_cache.getTTL(username),
    };
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
}
module.exports.fetchUserProfile = fetchUserProfile;
module.exports.getQuestions = getQuestions;
module.exports.getSubmissions = getSubmissions;
