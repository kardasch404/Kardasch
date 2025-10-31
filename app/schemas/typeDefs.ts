export const typeDefs = `#graphql
  enum Role {
    ADMIN
    VISITOR
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    lastLogin: String
    createdAt: String!
    updatedAt: String!
  }

  type Education {
    id: ID!
    school: String!
    degree: String!
    field: String!
    startDate: String!
    endDate: String
    description: String
  }

  type Experience {
    id: ID!
    company: String!
    position: String!
    startDate: String!
    endDate: String
    description: String
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    technologies: [String!]!
    url: String
    github: String
    startDate: String!
    endDate: String
  }

  type Competence {
    id: ID!
    name: String!
    level: Int!
    category: String!
  }

  type Social {
    id: ID!
    platform: String!
    url: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type Query {
    hello: String
    me: User
    educations: [Education!]!
    experiences: [Experience!]!
    projects: [Project!]!
    competences: [Competence!]!
    socials: [Social!]!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    logout(refreshToken: String!): Boolean!
    
    createEducation(school: String!, degree: String!, field: String!, startDate: String!, endDate: String, description: String): Education!
    updateEducation(id: ID!, school: String, degree: String, field: String, startDate: String, endDate: String, description: String): Education!
    deleteEducation(id: ID!): Boolean!
    
    createExperience(company: String!, position: String!, startDate: String!, endDate: String, description: String): Experience!
    updateExperience(id: ID!, company: String, position: String, startDate: String, endDate: String, description: String): Experience!
    deleteExperience(id: ID!): Boolean!
    
    createProject(title: String!, description: String!, technologies: [String!]!, url: String, github: String, startDate: String!, endDate: String): Project!
    updateProject(id: ID!, title: String, description: String, technologies: [String!], url: String, github: String, startDate: String, endDate: String): Project!
    deleteProject(id: ID!): Boolean!
    
    createCompetence(name: String!, level: Int!, category: String!): Competence!
    updateCompetence(id: ID!, name: String, level: Int, category: String): Competence!
    deleteCompetence(id: ID!): Boolean!
    
    createSocial(platform: String!, url: String!): Social!
    updateSocial(id: ID!, platform: String, url: String): Social!
    deleteSocial(id: ID!): Boolean!
  }
`;
