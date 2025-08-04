import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        accessToken: {
            type: String,
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    } 

    this.password = await bcrypt.hash(this.password, 10)
    next();
})


userSchema.methods.isPasswordMatched = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id: this._id, 
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}  

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            id: this._id,
            role: this.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema)

export default User;