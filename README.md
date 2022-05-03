# 🐕 Fetch Reward Points Api
API that that accepts HTTP requests and returns responses to read, add, and spend user points through payer/partner transactions. 

## Background
- Users have points in their accounts
- Users only see a single balance in their accounts
- For reporting purposes points are tracked by payer/partner
- Transaction records contain:

| transaction_id| Payer         | Points  | Timestamp |
| ------------- |:-------------:| -------:| ---------:|
| integer       | string.       | integer | date      |

- ```Transactions```: stored by payer and date
- ```Add Points```: new transaction that records payer and point amount
- ```Spend Points```: new transaction that records point amount and follows below conditions
    + oldest points to be spent first (oldest based on transaction timestamp, not the order they’re received)
    + payer's points cannot be negative.

## Technologies
- [Node](https://nodejs.org/en/docs/)
- [Express](https://expressjs.com/)
- [Knex](http://knexjs.org/)
- [PostgreSql](https://www.postgresql.org/docs/)
- [Jest](https://jestjs.io/docs/getting-started)

## Setup

### Quick Setup
- the program is deployed with Heroku at [https://fetch-reward-points.herokuapp.com/](https://fetch-reward-points.herokuapp.com/)
   + to make API calls/test endpoints to the deployed program, skip ahead to the **API Calls** section


### Run Locally

1. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) the repository
```
$ git clone git@github.com:kfam22/reward-points-api.git
```

2. Go to the root directory and install dependencies
```
npm i
```

3. Start the server
```
npm run start
```
 - the following should be logged in the terminal
 ```
 lisetning on 9000
 ```
4. Confirm server is up by visiting ```http://localhost:9000/``` in the browser
- you should see the following message
```
{
  "message": "Here to fetch reward points? Please navigate to a valid endpoint."
}
```
5. Run Tests
```
npm run test
```
- There are two test files
    + ```transactionsModel.test.js``` tests the database access functions
    + ```server.test.js``` tests the endpoints

## API Calls
The database is initialized with the following seed data:

| transaction_id| Payer         | Points  | Timestamp |
| ------------- |:-------------:| -------:| ---------:|
| 1             | TARGET        | 100     | date      |
| 2             | WALMART       | 1000    | date      |
| 3             | AMAZON        | 400     | date      |
| 4             | TRADER JOES   | 100     | date      |
| 5             | TARGET        | 100     | date      |
| 6             | WALMART       | 200     | date      |

You can use [Postman](https://www.postman.com/) to make API calls and test endpoints
1. Signup/Login to [Postman](https://www.postman.com/)
2. Click the button below to access the workspace with collection of enpoints </br>
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/18625043-89d52db2-fbeb-4c4e-a459-f80f22984c3e?action=collection%2Ffork&collection-url=entityId%3D18625043-89d52db2-fbeb-4c4e-a459-f80f22984c3e%26entityType%3Dcollection%26workspaceId%3D03fcd6ef-efb3-4483-aac1-95d0b9431345)

- Click view collection in public workspace first
<img width="1663" alt="Screen Shot 2022-05-03 at 9 36 21 AM" src="https://user-images.githubusercontent.com/92267062/166483523-d61ddceb-f2aa-484c-9c39-969d341c9a07.png">

- Click the dropdown arrow for the correct endpoint collection you want to test.  If you are not running locally, use the Heroku endpoints
<img width="1673" alt="Screen Shot 2022-05-03 at 9 41 13 AM" src="https://user-images.githubusercontent.com/92267062/166483752-c0cd2568-b973-4941-b208-fdf99b3a1092.png">

- For GET requests, click the blue send button in the top right corner
<img width="1678" alt="Screen Shot 2022-05-03 at 9 41 48 AM" src="https://user-images.githubusercontent.com/92267062/166483983-2e667249-99e4-40ec-994e-9866a551a560.png">

- For POST requests, click the body button beneath the endpoint to view the request body which is already filled with the correct format. You may change the data to test the endpoint.  Click the blue send button in the top right corner.
<img width="1677" alt="Screen Shot 2022-05-03 at 9 48 05 AM" src="https://user-images.githubusercontent.com/92267062/166484332-dfae57d9-e31e-4fa7-8db3-88864a2b1b3f.png">

## Endpoints

### [GET] api/transactions
Returns a list of all transactions in the following format

```
[
    {
        "transaction_id": 1,
        "payer": "TARGET",
        "points": 100,
        "timestamp": "2022-05-03T14:05:59.149Z"
    },
    {
        "transaction_id": 2,
        "payer": "WALMART",
        "points": 1000,
        "timestamp": "2022-05-03T14:05:59.149Z"
    },
    {
        "transaction_id": 3,
        "payer": "AMAZON",
        "points": 400,
        "timestamp": "2022-05-03T14:05:59.149Z"
    },
    {
        "transaction_id": 4,
        "payer": "TRADER JOES",
        "points": 100,
        "timestamp": "2022-05-03T14:05:59.149Z"
    },
    {
        "transaction_id": 5,
        "payer": "TARGET",
        "points": 100,
        "timestamp": "2022-05-03T14:05:59.149Z"
    },
    {
        "transaction_id": 6,
        "payer": "WALMART",
        "points": 200,
        "timestamp": "2022-05-03T14:05:59.149Z"
    }
]
```

### [GET] api/transactions/points
Returns users total points in the following format

```
{
    "total_points": "1900"
}
```

### [GET] api/transactions/points/payer
Returns a list of payers and their points balance in the following format
```
[
    {
        "payer": "TARGET",
        "points": 100
    },
    {
        "payer": "WALMART",
        "points": 600
    },
    {
        "payer": "AMAZON",
        "points": 400
    },
    {
        "payer": "TRADER JOES",
        "points": 100
    }
]
```
### [POST] api/transactions/points/add
Requires a request body in the following format
```
{
"payer": "WALMART", 
"points": 500
}
```
Returns a list of all transactions including the newly created transaction in the following format
```
[
    {
        "transaction_id": 1,
        "payer": "TARGET",
        "points": 100,
        "timestamp": "2022-05-03T14:07:18.394Z"
    },
    {
        "transaction_id": 2,
        "payer": "WALMART",
        "points": 1000,
        "timestamp": "2022-05-03T14:07:18.394Z"
    },
    {
        "transaction_id": 3,
        "payer": "AMAZON",
        "points": 400,
        "timestamp": "2022-05-03T14:07:18.394Z"
    },
    {
        "transaction_id": 4,
        "payer": "TRADER JOES",
        "points": 100,
        "timestamp": "2022-05-03T14:07:18.394Z"
    },
    {
        "transaction_id": 5,
        "payer": "TARGET",
        "points": 100,
        "timestamp": "2022-05-03T14:07:18.394Z"
    },
    {
        "transaction_id": 6,
        "payer": "WALMART",
        "points": 200,
        "timestamp": "2022-05-03T14:07:18.394Z"
    },
    {
        "transaction_id": 7,
        "payer": "WALMART",
        "points": 500,
        "timestamp": "2022-05-03T14:24:43.030Z"
    }
]
```

### [POST] api/transactions/points/spend
Requires a request body in the following format
```
{
"points": 700
}
```
Returns a batch(list) of spend transactions in the following format
```
[
    {
        "payer": "TARGET",
        "points": -100
    },
    {
        "payer": "WALMART",
        "points": -600
    }
]
```
