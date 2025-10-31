import dotenv from 'dotenv';

dotenv.config();

interface Config{
    port : number ,
    nodeEnv : string,
    mongodbUri : string,
    graphqlPath : string
}

const config : Config = {
    port : Number(process.env.PORT) || 3000,
    nodeEnv : (process.env.NODE_ENV || 'development') as string,
    mongodbUri : (process.env.MONGODB_URI || 'mongodb://localhost:27017/kardasch') as string,
    graphqlPath : (process.env.GRAPHQL_PATH || '/graphql') as string
}


export default config ; 