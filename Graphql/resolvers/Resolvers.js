const Userdb = require('../../Database/Models/User');
const Message = require('../../Database/Models/Messages');
const bcrypt = require('bcrypt');
const {UserInputError , AuthenticationError} = require('apollo-server-express')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'})



const secret = process.env.JWT_Secret;

const resolvers ={
    Query :{
       
        getProfiles: async (_, __, context)=>{
            try {
                let user
                  if (context.req && context.req.headers.Authorization) {
                   const token = context.req.headers.Authorization.split('Bearer ')[1]
                //    console.log(token)
                  jwt.verify(token, secret, (err, decodedToken) => {
                    if (err) {
                      throw new AuthenticationError('Unauthenticated')
                    }
                    user = decodedToken
                    console.log('lena fama error')
                    
                  })
                
                  
                }else{
                    const response = await Userdb.aggregate([{$sample: {size: 20}},
                        //  {$match:{_id: { $ne: user_id}}}
                         ]);
                        //  console.log(response)
                         return response
                }

            const response = await Userdb.aggregate([{$sample: {size: 20}},
                //  {$match:{_id: { $ne: user_id}}}
                 ]);
                 
            return response
        }catch(err){
            console.log(err)
            throw  err
        }

        },
        getUser: async(parent , {id})=>{
            return await Userdb.findById(id);
        },
        getMessages: async(parent, args)=>{
            const firstUser = args.from.toString();
            const secondUser = args.to;
            // let date = args.created_at;

            const result =  await Message.find(
                {
                    $or:[
                        { "from" :  firstUser , "to": secondUser },
                        { "from" :  secondUser , "to": firstUser }
                    ]
                },
            )
            return result            
        },
        login: async(_,args)=>{
            const {UserName , Password , Uid} = args
            let errors = {}
            try{
                if(UserName.trim() === ''){errors.username = 'Username must not be empty'}
                if(Password.trim() === ''){errors.password = 'Password must not be empty'}
                
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad input' , {errors})
                }
                
                const user = await Userdb.findOne({UserName : UserName});
                if(!user){
                    errors.username = "User not found"
                    throw new UserInputError('User not found', {errors})
                }                
                const correctPassword = await bcrypt.compare(Password , user.Password)

                if(!correctPassword){ 
                    errors.password = "Wrong password"
                    throw new UserInputError('Wrong password' , {errors})
                }

                const token = jwt.sign({ UserName } , secret , {expiresIn: 60 * 60});
                user.Token = token;
                return user
            }catch(err){
                console.log(err);
                throw err
            }
        }

    },
    
    Mutation:{

        createNewUser: async (parent, args)=>{
            let {
                        Email,
                        Password,
                        UserName,
                        
                    } = args;
            let errors = {}

            try{
                //validate input data:
                if (Email.trim() === "") errors.email = 'Email must not be empty'
                if (Password.trim() === "") errors.password = 'Password must not be empty'
                if (UserName.trim() === "") errors.usename = 'Username must not be empty'

                // check if UserName / Email exists
                const userByUserName = await Userdb.findOne({UserName : UserName });
                const userByEmail = await Userdb.findOne({Email : Email });

                if(userByUserName){errors.username = 'Username is Taken'};
                if(userByEmail){errors.email = 'Email already in use'};

                if(Object.keys(errors).length > 0){
                    throw errors
                }



                Password = await bcrypt.hash(Password , 6);
           
                const user = new Userdb({
                            Email,
                            Password,
                            UserName ,
                        });

                await user.save();
                const token = jwt.sign({ UserName } , secret , {expiresIn: 60 * 60});
                user.Token = token;
                return user
                // return user;
        }catch(err){
            console.log(err);
            throw new UserInputError('Bad Input' , {errors: err})
        }
        },

        deleteUser: async (parent , {id})=>{
            return await Userdb.findByIdAndDelete(id);
        },

        updateUser: async (parent , args , context , info)=>{
            const {id} = args
            const {
                UserName,
                Country,
                Images,
                CarManufacturer,
                CarModel,
                CarProductionYear,
                Likes,
                Matchs,
                Notinterested} = args.user;
                const user = await Userdb.findByIdAndUpdate(id , {
                    UserName,
                    Country,
                    Images,
                    CarManufacturer,
                    CarModel,
                    CarProductionYear,
                    Likes,
                    Matchs,
                    Notinterested}, {new: true});
                    return user
        },
        sendMessage: async (parent , args , context , info)=>{
            const from = args.from;
            const to = args.to;
            const content = args.content;

            const message = await new Message({
                from,
                to,
                content
            });
            await message.save();
            return message
        }

        }
}



module.exports = {resolvers}