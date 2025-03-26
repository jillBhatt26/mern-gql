
# MERN Apollo GraphQL

A basic sandbox application to demonstrate the usage of Apollo GraphQL to build a full-stack application using the MERN stack.

NOTE: Since the app is hosted on a free tier of https://render.com, which does not support shell scripts which are required to generate builds. Hence the client build has to be generated locally and pushed to the origin for it to be used in the server static middleware.
## Demo

https://mern-gql.onrender.com

## Tech Stack

**Client:** vite + react.js, graphql, @apollo/client, apollo-upload-client, bootstrap, zustand, react-router-dom, react-responsive-masonry

**Server:** node.js, express.js, mongodb, graphql, @apollo/server, supabase, express-session, graphql-middleware, graphql-shield, graphql-upload, graphql-rate-limit, supertest


## Server

- Express, MongoDB, GraphQL, Apollo Server
- Todo API
- File handling using graphql
- Express-session user authentication
- GraphQL-Shield for rate-limiting and query / mutation protection at individual level rather than endpoint level.
- GraphQL File Upload
- Supabase cloud storage
- Supertest e2e tests

## Client

- Vite React.js app 
- Multiple apollo clients and providers
- Zustand state manager
- Slate Bootswatch theme (Bootstrap)
- User Signup, Login and Logout
- Update and Delete account
- Todo manager page
- Image Gallery page
- Custom reusable modal component
- Custom reusable outside click handler
## Usage

Clone the repo

```bash
  git clone https://github.com/jillBhatt26/graphql-express-reference.git
```

cd to the repo
```bash
  cd graphql-express-reference
```

Install dependencies in server as well as client directories
```bash
  yarn install && cd client && yarn install
```

Create and add environment variables as listed below
```bash
  touch .env && cd client && touch .env
```

Start development servers
```bash
  yarn dev && cd client && yarn dev
```
    
Build client
```bash
  cd client && yarn build
```
    
## Server Environment Variables

To run this project, you will need to add the following environment variables to your root .env file

`NODE_ENV = development`

`PORT = 5000`

`DB_URL = mongodb://localhost:27017/graphql-express-mongo-todos`

`TEST_DB_URL = mongodb://localhost:27017/test-graphql-express-mongo-todos`

`SESSION_SECRET = shhhhhh!!!!`

`FE_URL = http://localhost:3000`

`INTROSPECTION_URL = http://localhost:5000/graphql`

`SUPABASE_PROJECT_URL = make your own supabase project`

`SUPABASE_API_KEY = get your own Supabase API Key`

## Client Environment Variables

To run this project, you will need to add the following environment variables to your client's .env file

`VITE_PORT = 3000` 

`VITE_NODE_ENV = development`

`VITE_BE_URL = http://localhost:5000/graphql`