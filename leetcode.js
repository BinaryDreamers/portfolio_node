const url = "https://leetcode.com/graphql";

const cache = {
  questions: {},
  members: {},
};

async function fetchUserProfile(username) {
  if (await cache.members[username]) {
    console.log(
      `------------------------------- Read From Cache 1 { NO REQUEST } -------------------------------`
    );
    return { username: username, solved: cache.members[username] };
  }
  // GraphQL query

  const query =
    Object.keys(cache.questions).length === 0
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
    if (await cache.members[username]) {
      console.log(
        `------------------------------- Read From Cache 2 { NO REQUEST } -------------------------------`
      );
      return { username: username, solved: cache.members[username] };
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

    if (Object.keys(cache.questions).length === 0) {
      console.log(
        "\n----------------------------- IN QUESTIONS CACHE -----------------------------"
      );

      data.data.allQuestionsCount.forEach((question) => {
        switch (question.difficulty) {
          case "All":
            cache.questions.all = question.count;
            break;
          case "Easy":
            cache.questions.easy = question.count;
            break;
          case "Medium":
            cache.questions.medium = question.count;
            break;
          case "Hard":
            cache.questions.hard = question.count;
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
    cache.members[formattedData.username] = formattedData.solved;
    // Return the formatted data
    return formattedData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
}

function getQuestions() {
  return cache.questions;
}

module.exports.fetchUserProfile = fetchUserProfile;
module.exports.getQuestions = getQuestions;
