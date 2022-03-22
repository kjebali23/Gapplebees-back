const Userdb = require('../../Database/Models/User');
const Message = require('../../Database/Models/Messages');
const bcrypt = require('bcrypt');
const {UserInputError} = require('apollo-server-express')


const resolvers ={
    Query :{
        getAllUsers: async ()=>{
           return await Userdb.find()
        },
        getProfiles: async ()=>{
            // const ToShow = [];
            const response = await Userdb.aggregate([{$sample: {size: 20}}]);
            // response.map((res)=>{
            // const userId = res._id.toString();
            // })
            // console.log(ToShow);
            return response

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
            const {UserName , Password} = args
            let errors = {}
            const username = UserName.trim();
            try{
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
                return user
            }catch(err){
                console.log(err);
                throw err
            }
        }

    },
    
    Mutation:{
        // register: async(_,args) =>{
        //     const { UserName , email , password , confirmPassword } = args

        //     try{
        //         const user  = new Userdb({
        //             UserName,
        //             email,
        //             password
        //         });
        //         await user.save
        //     return user

        //     }catch(err){
        //         console.log(err)
        //     }
        // },

        createNewUser: async (parent, args)=>{
            let {
                        Email,
                        Password,
                        UserName,
                        Country,
                        Images,
                        CarManufacturer,
                        CarModel,
                        CarProductionYear,
                        Likes,
                        Matchs,
                        Notinterested} = args.user;
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
                            Country,
                            Images,
                            CarManufacturer,
                            CarModel,
                            CarProductionYear,
                            Likes,
                            Matchs,
                            Notinterested
                        });

                await user.save();
                return user;
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