# API Endpoints Documentation

## Setup Instructions

To set up the project, ensure you have Node.js installed. Then, follow these steps:

1. Clone the repository or navigate to your project directory.
2. Install the required dependencies using npm:

   ```bash
   npm install
   ```

3. For ease of development, you can use `nodemon` to automatically restart the server when changes are made. If you haven't installed `nodemon` globally, you can do so with the following command:

   ```bash
   npm install -g nodemon
   ```

4. Start the server using `nodemon`:

   ```bash
   nodemon index.js
   ```

---

## Get All Members

### Endpoint

`GET /api/members`

### Description

Retrieves a list of all members along with their profiles.

### Response

- `200 OK` on success, with the response body containing:

  - `members`: An array of member objects, each containing:
    - `id`: The unique identifier of the member.
    - `profileUrl`: The profile URL of the member.
    - `name`: The name of the member.
    - `dateAdded`: The date the member was added.
    - `role`: The role of the member.
    - `leetcode`: The LeetCode username of the member.
    - `solved`: An object with the total number of solved questions and their breakdown:
      - `easy`: The number of easy questions solved.
      - `medium`: The number of medium questions solved.
      - `hard`: The number of hard questions solved.
    - `timeToLive`: The time to live for the cache entry.

- `400 Bad Request` if there is an error, with the response body containing the error message.

### Example Request

```bash
curl -X GET http://localhost:5109/api/members
```

### Example Response

```json
{
  "members": [
    {
      "id": "60d0fe4f5311236168a109ca",
      "profileUrl": "https://example.com/profile/1",
      "name": "John Doe",
      "dateAdded": "2023-01-01T00:00:00.000Z",
      "role": "Developer",
      "leetcode": "john_doe",
      "solved": {
        "total": 100,
        "easy": 50,
        "medium": 30,
        "hard": 20
      }
    },
    {
      "id": "91d0fe4f4b1122a168a109ac",
      "profileUrl": "https://example.com/profile/2",
      "name": "Jhon Smith",
      "dateAdded": "2024-01-01T00:00:00.000Z",
      "role": "Designer",
      "leetcode": "jhon_smith",
      "solved": {
        "total": 70,
        "easy": 40,
        "medium": 20,
        "hard": 10
      },
      "timeToLive": 300
    }
  ]
}
```

## Get Member by ID

### Endpoint

`GET /api/members/:id`

### Description

Retrieves detailed profile information of a specific member by their unique identifier.

### URL Parameters

- `id`: The unique identifier of the member.

### Response

- `200 OK` on success, with the response body containing:

  - `telegram`: The Telegram username of the member.
  - `linkedin`: The LinkedIn profile of the member.
  - `github`: The GitHub profile of the member.
  - `leetcode`: The LeetCode username of the member.
  - `bannerUrl`: The banner URL of the member.
  - `email`: The email of the member.
  - `description`: The description of the member.
  - `timeToLive`: The time to live for the cache entry.

- `400 Bad Request` if the member is not found or there is an error, with the response body containing the error message.

### Example Request

```bash
curl -X GET http://localhost:5109/api/members/60d0fe4f5311236168a109ca
```

### Example Response

```json
{
  "telegram": "https://t.me/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "github": "https://github.com/johndoe",
  "leetcode": "john_doe",
  "bannerUrl": "https://example.com/banner/1",
  "email": "johndoe@example.com",
  "description": "Software developer with 5 years of experience",
  "timeToLive": 300
}
```

## Get Questions

### Endpoint

`GET /api/questions`

### Description

Retrieves the list of currently available leetcode questions.

### Response

- `200 OK` on success, with the response body containing the list of questions.
- `400 Bad Request` if there is an error, with the response body containing the error message.

### Example Request

```bash
curl -X GET http://localhost:5109/api/questions
```

### Example Response

```json
{
  "questions": {
    "total": 3299,
    "easy": 826,
    "medium": 1726,
    "hard": 747
  }
}
```

## Get Submissions by Member ID

### Endpoint

`GET /api/submissions/:id`

### Description

Retrieves a list of the last 20 submissions made by a specific member identified by their unique identifier.

### URL Parameters

- `id`: The unique identifier of the member.

### Response

- `200 OK` on success, with the response body containing the list of submissions.
- `400 Bad Request` if the member is not found or there is an error, with the response body containing the error message.

### Example Request

```bash
curl -X GET http://localhost:5109/api/submissions/60d0fe4f5311236168a109ca
```

### Example Response

```json
{
  "submissions": [
    {
      "title": "Group Anagrams",
      "timestamp": "1727561061",
      "statusDisplay": "Wrong Answer",
      "lang": "cpp"
    },
    {
      "title": "Two Sum",
      "timestamp": "1727559025",
      "statusDisplay": "Accepted",
      "lang": "javascript"
    }
  ],
  "timeToLive": 1727563858487
}
```
