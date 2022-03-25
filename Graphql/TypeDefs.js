const {gql} = require('apollo-server-express')

const typeDefs = gql`


    type user{
        Uid:String,
        Email:String,
        Password:String,
        UserName: String,
        Country: String,
        Images:[String],
        CarManufacturer: String,
        CarModel: String,
        CarProductionYear: String,
        Likes:[String],
        Matchs:[String],
        Notinterested:[String],
        Token:String
    }
    type Message{
        # MessageId: String!
        content:String!
        from:String!
        to:String
        created_at:String
    }

    #Queries 
        type Query {
            login(UserName:String! , Password:String! , Uid:String):user
            getAllUsers: [user]
            getProfiles:[user]
            getUser(id: ID ): user
            getMessages(from:String! , to:String! , created_at:String):[Message]
        }

        input userInput{
            Uid:String
            Email:String!
            Password:String!
            UserName:String!
            Country: String,
            Images:[String],
            Joined: String,
            CarManufacturer: String,
            CarModel: String,
            CarProductionYear: String,
            Likes:[String],
            Matchs:[String],
            Notinterested:[String],
        }
        
   

    #Mutations
        type Mutation{
                createNewUser(UserName:String ,Email: String , Password: String) : user
                deleteUser(id:ID): user
                updateUser(id:ID ,user: userInput): user
                sendMessage(from:String! , to: String! , content: String!): Message!
        }

`;

module.exports = { typeDefs }