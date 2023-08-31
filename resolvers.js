import axios from "axios";
import User from "./models/users.model.js";

export const resolvers = {
  Query: {
    hello: () => {
      return "Hello World!";
    },
    age: () => {
      return 20;
    },
    posts: async () => {
      // let connect to third party rest api endpoint
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      console.log(result);
      return result.data;
    },
    users: async () => {
      // Let's connect to MongoDB
      // creating DAO
      // const userDao = new User({
      //   name: "John"
      // });
      // // saving to create a new document by folowing syntax of mongoose
      // userDao.save((err, data) => {
      //   if (!err) {
      //     console.log(data);
      //     return data;
      //   }
      // });
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
  // The following is called  Field Resolver fn
  /* Custom Type Post has id, title, body field. 
    I want to customize, body field to have something more along with the original title.
    Let's add ellipsis here in title. 
    You can do data transformations here
  */
  Post: { // This should match with the custom type we have in schema.graphql 
    // Further customizing select field
    body: (post) => { // this is field in the custom type
      console.log(post.title);
      return post.title + "..."; // updating all titles with '...'
    },
  },
};