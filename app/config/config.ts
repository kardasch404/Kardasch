import dotenv from 'dotenv';

dotenv.config();

interface Config{
    port : number ,
    nodeEnv : string,
    mongodbUri : string,
    graphqlPath : string,
    jwtAccessSecret : string,
    jwtRefreshSecret : string,
    jwtAccessExpiry : string,
    jwtRefreshExpiry : string
}

const config : Config = {
    port : Number(process.env.PORT) || 3000,
    nodeEnv : (process.env.NODE_ENV || 'development') as string,
    mongodbUri : (process.env.MONGODB_URI || 'mongodb://localhost:27017/kardasch') as string,
    graphqlPath : (process.env.GRAPHQL_PATH || '/graphql') as string,
    jwtAccessSecret : (process.env.JWT_ACCESS_SECRET || 'access-secret-key') as string,
    jwtRefreshSecret : (process.env.JWT_REFRESH_SECRET || 'refresh-secret-key') as string,
    jwtAccessExpiry : (process.env.JWT_ACCESS_EXPIRY || '15m') as string,
    jwtRefreshExpiry : (process.env.JWT_REFRESH_EXPIRY || '7d') as string
}


export default config ;
