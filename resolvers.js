export const resolvers = {
  Query: {
    hello: () => {
      return 'Hello World!'
    },
    age: () => {
      return 20;
    }
  }
}