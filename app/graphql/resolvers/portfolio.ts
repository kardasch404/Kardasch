import User from '../../models/User.js';
import Education from '../../models/Education.js';
import Experience from '../../models/Experience.js';
import Project from '../../models/Project.js';
import Competence from '../../models/Competence.js';
import Social from '../../models/Social.js';

export const portfolioResolvers = {
  Query: {
    portfolio: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      
      const [user, educations, experiences, projects, competences, socials] = await Promise.all([
        User.findById(context.userId),
        Education.find({ userId: context.userId }),
        Experience.find({ userId: context.userId }),
        Project.find({ userId: context.userId }),
        Competence.find({ userId: context.userId }),
        Social.find({ userId: context.userId })
      ]);
      
      if (!user) throw new Error('User not found');
      
      return { user, educations, experiences, projects, competences, socials };
    }
  }
};
