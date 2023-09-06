// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";

import authRouter from"./routes/auth.js";
import passport from './config/passport.config.js'; // setting up passport
import { getAccount } from "./controllers/auth.controller.js";

const PORT = 9000;
// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// parse application/x-www-form-urlencoded -- only then you can get req.body onver post method
app.use(bodyParser.urlencoded({ extended: false }));

passport.initialize(); // setting up auth middleware

app.use(cors());

app.use("/api/auth", authRouter);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const wsServerCleanup = useServer({ schema }, wsServer);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
    async serverWillStart() {
      return {
        async drainServer() {
          await wsServerCleanup.dispose();
        }
      }
    }
  }],
});

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      // Get the user token from the headers.
      const token = req.headers.authorization || "";

      // Try to retrieve an account with the token
      const account = await getAccount(token);

      // Add the account to the context
      return { account };
    },
  })
);


// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(
  `GrqphQL Server is running on port http://localhost:${PORT}/graphql`
);

// console.log(
//   `Authentication REST API is running on http://localhost:${PORT}/api/login`
// );
