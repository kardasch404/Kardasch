import Competence from '../../models/Competence.js';

export const competenceResolvers = {
  Query: {
    competences: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Competence.find({ userId: context.userId });
    }
  },
  
  Mutation: {
    createCompetence: async (_: any, args: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      return await Competence.create({ ...args, userId: context.userId });
    },
    
    updateCompetence: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const competence = await Competence.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!competence) throw new Error('Competence not found');
      return competence;
    },
    
    deleteCompetence: async (_: any, { id }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const result = await Competence.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    }
  }
};
