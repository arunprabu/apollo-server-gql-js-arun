import axios from "axios";
import UserModel from "../models/users.model.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    hello: () => {
      return "Hello World!";
    },
    age: () => {
      return 20;
    },
    posts: async () => {
      // // let connect to third party rest api endpoint
      // const result = await axios.get(
      //   "https://jsonplaceholder.typicode.com/posts"
      // );
      // console.log(result);
      // return result.data;
      //Let's handle error and customize it
      try {
        // let connect to third party rest api endpoint
        const result = await axios.get(
          "https://jsonplaceholder.typicode.com/posts897654"
        );
        console.log(result);
        return result.data;
      } catch (err) {
        throw new GraphQLError("Unable to fetch posts. Try again later", {
          extensions: { code: "UNABLE_TO_FETCH" },
        });
      }
    },
    postById: async (parent, args) => {
      console.log(parent);
      console.log(args);
      
      //Let's handle error and customize it
      try {
        // let connect to third party rest api endpoint
        const result = await axios.get(
          "https://jsonplaceholder.typicode.com/posts/" + args.id
        );
        console.log(result);
        return result.data;
      } catch (err) {
        throw new GraphQLError("No Post Found with id: " + args.id, {
          extensions: { code: "NOT_FOUND" }
        });
      }
    },
    users: async () => {
      // Let's connect to MongoDB
      
      // saving to create a new document by folowing syntax of mongoose
      const result = await UserModel.find();
      console.log(result);
      return result;
    },
    // userById: async (parent, args) => {
    //   console.log(parent);
    //   console.log(args);
    //   // let connect to third party rest api endpoint
    //   const result = await axios.get(
    //     "https://jsonplaceholder.typicode.com/users/1"
    //   );
    //   console.log(result);
    //   return result.data;
    // }
  },
  // The following is called Field Resolver fn
  /* Custom Type Post has id, title, body field. 
    I want to customize, body field to have something more along with the original title.
    Let's add ellipsis here in title. 
    You can do data transformations here
    THe following stuff will be part of the final result.. 
    you can also customize/ tranform other fields like id, title as well
  */
  Post: {
    // This should match with the custom type we have in schema.graphql
    // Further customizing select field
    body: (post) => {
      // this is field in the custom type
      console.log(post.body);
      return post.body + "..."; // updating all body properties with '...'
    },
    user: (post) => {
      console.log(post);
      return {
        id: post.userId,
        name: "",
        email: "",
        phone: "",
      };
    },
  },
  Mutation: {
    createPost: async (parent, args) => {
      // we can connect to db.. I am sending it directly from here
      console.log(parent);
      console.log(args); // this is req body
      const result = await axios.post(
        "https://jsonplaceholder.typicode.com/posts/",
        args
      );
      // console.log(result);
      return result.data;
      // return {
      //   id: 9999,
      //   title: args.title,
      //   body: args.body,
      // };
    },
    updatePost: async (parent, args) => {
      // we can connect to db.. I am sending it directly from here
      console.log(parent);
      console.log(args); // this is req body
      const result = await axios.put(
        "https://jsonplaceholder.typicode.com/posts/" + args.id,
        args
      );
      // console.log(result);
      return result.data;
    },
    deletePost: async (parent, args) => {
      const result = await axios.delete(
        "https://jsonplaceholder.typicode.com/posts/" + args.id,
        args
      );
      // console.log(result);
      return 'Deleted Successfully!';
    },
    addUser: async (parent, {input}) => {
      console.log(input); // this is req body
      // Let's connect to MongoDB
      // creating DAO
      const userDao = new UserModel(input);
      // saving to create a new document by folowing syntax of mongoose
      const result  = await userDao.save();
      console.log(result);
      return result;
    }
  },
};