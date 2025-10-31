import Experience from '../../models/Experience.js';

export const experienceResolvers = {
  Query: {
    experiences: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Experience.find({ userId: context.userId });
    }
  },
  
  Mutation: {
    createExperience: async (_: any, args: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      return await Experience.create({ ...args, userId: context.userId });
    },
    
    updateExperience: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const experience = await Experience.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!experience) throw new Error('Experience not found');
      return experience;
    },
    
    deleteExperience: async (_: any, { id }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const result = await Experience.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    }
  }
};
