import Project from '../../models/Project.js';

export const projectResolvers = {
  Query: {
    projects: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await Project.find({ userId: context.userId });
    }
  },
  
  Mutation: {
    createProject: async (_: any, args: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      return await Project.create({ ...args, userId: context.userId });
    },
    
    updateProject: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const project = await Project.findOneAndUpdate(
        { _id: id, userId: context.userId },
        args,
        { new: true }
      );
      if (!project) throw new Error('Project not found');
      return project;
    },
    
    deleteProject: async (_: any, { id }: any, context: any) => {
      if (!context.userId || context.role !== 'ADMIN') throw new Error('Unauthorized');
      const result = await Project.deleteOne({ _id: id, userId: context.userId });
      return result.deletedCount > 0;
    }
  }
};
