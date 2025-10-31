import Social from '../../models/Social.js';

export const socialResolvers = {
  Query: {
    socials: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Social.find({ userId: context.userId });
    }
  },
  
  Mutation: {
    createSocial: async (_: any, args: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      return await Social.create({ ...args, userId: context.userId });
    },
    
    updateSocial: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const social = await Social.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!social) throw new Error('Social not found');
      return social;
    },
    
    deleteSocial: async (_: any, { id }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const result = await Social.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    }
  }
};
