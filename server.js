import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { readFile } from "fs/promises";
import cors from "cors";
import express from "express";

import { resolvers } from "./resolvers.js";
// import { authMiddleware, handleLogin } from "./auth.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json());

const typeDefs = await readFile("./schema.graphql", "utf-8");

// app.post("/login", handleLogin);
const apolloServer = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

await apolloServer.start();
app.use("/graphql", expressMiddleware(apolloServer));

app.listen({ port: PORT }, () => {
  console.log(`GrqphQL Server is running on port http://localhost:${PORT}/graphql`);
  console.log(
    `Authentication REST API is running on http://localhost:${PORT}/api/login`
  );
});
