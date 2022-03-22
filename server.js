const {ApolloServer} = require('apollo-server-express');
const express = require('express');
const app = express();

const {typeDefs} = require('./Graphql/TypeDefs');
const {resolvers} = require('./Graphql/Resolvers/Resolvers')



const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./Database/Connection/connection');


dotenv.config({path:'config.env'})
const Port = process.env.Port || 8080;





// Database Connection
connectDB();



app.use(morgan('tiny'));

// app.use(('/') , require('./Server/Routes/Routes'));

async function startApolloServer(typeDefs, resolvers){
    const server = new ApolloServer({typeDefs, resolvers})
    const app = express();
    await server.start();
    server.applyMiddleware({app, path: '/graphql'});
    
    app.listen(Port, () => {
    console.log(`Server is listening on port ${Port}${server.graphqlPath}`);
})
}
// GetAllUsers();

startApolloServer(typeDefs, resolvers);

// app.listen(Port , ()=>{
//     console.log(`gapplebees server running on Port ${Port}`);
// })

