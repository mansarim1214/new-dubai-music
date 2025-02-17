const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Artist {
    id: ID!
    title: String!
    category: String!
    speciality: String!
    description: String
    videoUrl: String
    imageUrl: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Venue {
    id: ID!
    title: String!
    description: String!
    location: String!
    category: String!
    featuredImage: String!
    gallery: [String!]!
  }

  type Query {
    artists: [Artist!]!
    artist(id: ID!): Artist
    categories: [Category!]!
    category(id: ID!): Category
    venues: [Venue!]!
    venue(id: ID!): Venue
  }

  type Mutation {
    addArtist(title: String!, category: String!, speciality: String!, description: String, videoUrl: String, imageUrl: String!): Artist!
    updateArtist(id: ID!, title: String!, category: String!, speciality: String!, description: String, videoUrl: String, imageUrl: String!): Artist!
    deleteArtist(id: ID!): Artist!
    
    addCategory(name: String!): Category!
    updateCategory(id: ID!, name: String!): Category!
    deleteCategory(id: ID!): Category!
    
    addVenue(title: String!, description: String!, location: String!, category: String!, featuredImage: String!, gallery: [String!]!): Venue!
    updateVenue(id: ID!, title: String!, description: String!, location: String!, category: String!, featuredImage: String!, gallery: [String!]!): Venue!
    deleteVenue(id: ID!): Venue!
  }
`;

module.exports = typeDefs;
