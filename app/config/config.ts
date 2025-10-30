import dotenv from 'dotenv';

dotenv.Config();

interface Config{
    port : number ,
    nodeEnv : string 
}

const config : Config = {
    port : Number(process.env.PORT),
    nodeEnv : process.env.NODE_ENV,
}


export default config ; 