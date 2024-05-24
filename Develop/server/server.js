const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

async function startApolloServer() {
  // Create Apollo server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware({ req }),  
  });

  // Start the Apollo server
  await server.start();
  console.log('Apollo Server started.');

  // Apollo GraphQL middleware 
  server.applyMiddleware({ app });
  console.log('Apollo Middleware applied.');

  // Middleware
  app.use(cors());  // Enable CORS
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());


  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Connects to db & starts the Express server
  db.once('open', () => {
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

// Start the server
startApolloServer();