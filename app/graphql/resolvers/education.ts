import Education from '../../models/Education.js';

export const educationResolvers = {
  Query: {
    educations: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Education.find({ userId: context.userId });
    }
  },
  
  Mutation: {
    createEducation: async (_: any, args: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      return await Education.create({ ...args, userId: context.userId });
    },
    
    updateEducation: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const education = await Education.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!education) throw new Error('Education not found');
      return education;
    },
    
    deleteEducation: async (_: any, { id }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const result = await Education.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    }
  }
};
