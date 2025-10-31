import { authResolvers } from './auth.js';
import { portfolioResolvers } from './portfolio.js';
import { educationResolvers } from './education.js';
import { experienceResolvers } from './experience.js';
import { projectResolvers } from './project.js';
import { competenceResolvers } from './competence.js';
import { socialResolvers } from './social.js';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...portfolioResolvers.Query,
    ...educationResolvers.Query,
    ...experienceResolvers.Query,
    ...projectResolvers.Query,
    ...competenceResolvers.Query,
    ...socialResolvers.Query
  },
  
  Mutation: {
    ...authResolvers.Mutation,
    ...educationResolvers.Mutation,
    ...experienceResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...competenceResolvers.Mutation,
    ...socialResolvers.Mutation
  }
};
