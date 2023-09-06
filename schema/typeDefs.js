export const typeDefs = `#graphql
  type Query {
    #this is comment for fellow developers to see
    hello: String
    age: Int
    posts(limit: Int!, offset: Int!): [Post]
    postById(id: Int): Post 
    users(cursor: String, limit: Int): [User]
  }

  type User {
    _id: ID!
    name: String!
    phone: String!
    email: String!
  }

  # The following one is for Documentation
  """
  Represents Blog Post
  """
  type Post {
    """ID of the blog post"""
    id: ID!
    """Blog post title"""
    title: String!
    """Blog post article body with ellipsis"""
    body: String!
    user: User!
  }

  #Let's learn about mutation
  type Mutation {
    createPost(title: String!, body: String!): Post
    updatePost(id: ID!, title: String!, body: String!): Post
    deletePost(id: ID!): String,
    addUser(input: UserInput): User!
  }

  input UserInput {
    name: String!
    email: String!
    phone: String!
  }

  # the following has cursor pagination implemented
  # type Photo {
  #   id: ID!
  #   title: String
  # }

  # type PageInfo {
  #   hasNextPage: Boolean!
  # }

  # type PhotoEdge {
  #   cursor: String!
  #   node: Photo 
  # }

  # type PhotoConnection {
  #   edges: [PhotoEdge!]!
  #   pageInfo: PageInfo!
  # }
`;

