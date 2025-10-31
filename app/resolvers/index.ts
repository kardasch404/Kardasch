import User from '../models/User.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Project from '../models/Project.js';
import Competence from '../models/Competence.js';
import Social from '../models/Social.js';
import JWTUtil from '../utils/jwt.js';

export const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
    me: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await User.findById(context.userId);
    },
    educations: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Education.find({ userId: context.userId });
    },
    experiences: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Experience.find({ userId: context.userId });
    },
    projects: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Project.find({ userId: context.userId });
    },
    competences: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Competence.find({ userId: context.userId });
    },
    socials: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Social.find({ userId: context.userId });
    }
  },
  
  Mutation: {
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');
      
      const isValid = await user.validatePassword(password);
      if (!isValid) throw new Error('Invalid credentials');
      
      user.lastLogin = new Date();
      const tokens = user.generateTokens();
      await user.save();
      
      return { ...tokens, user };
    },
    
    refreshToken: async (_: any, { refreshToken }: any) => {
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);
      
      if (!user) throw new Error('User not found');
      
      const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
      if (!tokenExists) throw new Error('Invalid refresh token');
      
      user.revokeToken(refreshToken);
      const tokens = user.generateTokens();
      await user.save();
      
      return { ...tokens, user };
    },
    
    logout: async (_: any, { refreshToken }: any) => {
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);
      
      if (!user) return false;
      
      const revoked = user.revokeToken(refreshToken);
      await user.save();
      
      return revoked;
    },
    
    createEducation: async (_: any, args: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Education.create({ ...args, userId: context.userId });
    },
    
    updateEducation: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const education = await Education.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!education) throw new Error('Education not found');
      return education;
    },
    
    deleteEducation: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const result = await Education.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    },
    
    createExperience: async (_: any, args: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Experience.create({ ...args, userId: context.userId });
    },
    
    updateExperience: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const experience = await Experience.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!experience) throw new Error('Experience not found');
      return experience;
    },
    
    deleteExperience: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const result = await Experience.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    },
    
    createProject: async (_: any, args: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Project.create({ ...args, userId: context.userId });
    },
    
    updateProject: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const project = await Project.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!project) throw new Error('Project not found');
      return project;
    },
    
    deleteProject: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const result = await Project.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    },
    
    createCompetence: async (_: any, args: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Competence.create({ ...args, userId: context.userId });
    },
    
    updateCompetence: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const competence = await Competence.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!competence) throw new Error('Competence not found');
      return competence;
    },
    
    deleteCompetence: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const result = await Competence.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    },
    
    createSocial: async (_: any, args: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Social.create({ ...args, userId: context.userId });
    },
    
    updateSocial: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const social = await Social.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!social) throw new Error('Social not found');
      return social;
    },
    
    deleteSocial: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      const result = await Social.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    }
  }
};
