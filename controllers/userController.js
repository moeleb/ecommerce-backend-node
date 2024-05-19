const { generateToken } = require("../config/jsonwebtoken");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbID = require("../utils/validateMongoDb");
const {generateRefreshToken} = require("../config/refreshToken")
const jwt = require("jsonwebtoken")
const createUser = asyncHandler(
    async (req, res) => {
        const { firstname, lastname, email, password, mobile } = req.body;
            const findUser = await userModel.findOne({ email });
            if (findUser) {
                throw new Error('User Already Exists');
            } else {
                const newUser = await userModel.create({
                    firstname,
                    lastname,
                    email,
                    password,
                    mobile
                });
                return res.status(201).json({ data: newUser, success: true });
            }
        } 
    
);

const loginUser = asyncHandler(async(req,res)=>{
    
        const {email,password} = req.body ;
        const findUser = await userModel.findOne({email})
        if(!findUser){
            throw new Error("User does not exisit");
        }
        if(findUser && await findUser.isPasswordMatched(password)){
           const refreshToken = await generateRefreshToken(findUser._id)
           const updateUser = await userModel.findByIdAndUpdate(findUser.id,{
            refreshToken : refreshToken,
        }, {
            new:true
        })
            res.cookie('refreshToken', refreshToken,{
                httpOnly :true,
                maxAge :72*60 *60 *1000,
            })
            res.json({
                _id: findUser._id,
                firstname : findUser.firstname,
                lastname : findUser.lastname,
                email: findUser.email,
                mobile: findUser.mobile,
                token:generateToken(findUser._id)
            });
        } else{
            throw new Error("invalid Credentials");

        }
})

const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies ;
    if(!cookie.refreshToken){
        throw new Error("No Refresh Token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await userModel.findOne({refreshToken})
    if(!user){
        throw new Error("User is not found");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err,decode)=>{
        // console.log(decode)
        if(err || user.id !== decode.id){
            throw new Error('There is something wrong in refresh Token')
        }
        const accessToken = generateToken(user._id)
        res.json({accessToken})
            
        
    })

});

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
        throw new Error("No Refresh Token in cookies");
    }

    const refreshToken = cookies.refreshToken;
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None' // Ensure this matches your cookie settings
        });
        return res.status(204).send(); // send() method should be used to end the response
    }

    await userModel.findByIdAndUpdate(user._id, { refreshToken: "" });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None' // Ensure this matches your cookie settings
    });

    return res.sendStatus(204);
});

// get all users 

const getAllUsers = asyncHandler(async(req,res)=>{
    try{
        const getUsers = await userModel.find();
        res.send(getUsers);
    }catch(error){
        throw new Error(error);
    }
})

const getUser = asyncHandler(async(req,res)=>{
    const {id} = req.params ;
    validateMongoDbID(id)
    try{
        console.log(id);
        const getUser = await userModel.findById(id);
        res.json({
            getUser
        })
    } catch(e){
        throw new Error(e)
    }
})

const deleteUser = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params ;
        console.log(id);
        const deleteUser = await userModel.findByIdAndDelete(id);
        res.json({
            deleteUser
        })
    } catch(e){
        throw new Error(e)
    }
})

const updateUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{    
        const updatedUser = await userModel.findByIdAndUpdate(id,{
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,

        }, {
            new:true
        });
        res.json(updatedUser);
 
    } catch(e){
        throw new Error(e);
    }
})

const blockUser = asyncHandler(async (req,res)=>{
    console.log(req);
    validateMongoDbID(id)
 
    const {id} = req.params ;
    try{
        const block = userModel.findByIdAndUpdate(id,{
            isBlocked:true,
        }, {
            new:true
        })
        res.json({msg:"User Blocked"})
    }catch(e){
        throw new Error(e)
    }
});


const unBlockUser = asyncHandler(async (req,res)=>{
    const {id} = req.params ;
    validateMongoDbID(id)

    try{
        const unblock = userModel.findByIdAndUpdate(id,{
            isBlocked:false,
        }, {
            new:true
        })
        res.json({msg:"User Unblocked"});
    }catch(e){
        throw new Error(e)
    }
});

const updatePassword = asyncHandler(async(req,res)=>{
    const {_id} = req.user ;
    const {password} = req.body ;
    validateMongoDbID(_id);
    const user = await userModel.findById(_id);
    if(password){
        user.password = password
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else{
        res.json(user)
    }
});

module.exports = { createUser, loginUser, getAllUsers, getUser ,deleteUser,updateUser,blockUser,unBlockUser, handleRefreshToken,logout,updatePassword};
