# Serverless example with typescript

AWS serverless(lambda, dynamodb) example(to-do list app) using serverless framework.

## Install

```shell
npm install
```

## How to run

Sample Requests is placed under `/check`.

### local

```shell
# install dynamodb-local
npm run dynamodb:install

# run serverless-offline
npm run start:offline
```

## Steps

### 1 - Create user entity

User should have userName, fullName, emailAddress, creation date

### 2 - Create add user handler

Create a handler that accepts user params and creates the user in database


### 3 - Use a third party api to inform the user is logged in

Use a POST request to inform third party system about user is created using this api below:

[](https://664c87b635bbda109880bf18.mockapi.io/third-party-api/auditTrail)

Request schema:

```jsx
{
	"username": string
}
```
