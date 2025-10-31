import User from '../../models/User.js';
import JWTUtil from '../../utils/jwt.js';

export const authResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await User.findById(context.userId);
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
    }
  }
};
