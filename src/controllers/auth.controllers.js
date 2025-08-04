import User from "../models/user.model.js"
import {asyncHandler} from "../utils/async-handler.js"
import {ApiError} from "../utils/api-error.js"
import {ApiResponse} from "../utils/api-response.js"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body

    if(!fullname || !email || !password){
        res.status(400).json(new ApiError(400, "All the details are required", ["fullname", "email", "password"]
        ))
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        res.status(400).json(
            new ApiError(400, false, ["User already exists"])
        )
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
        fullname,
        email,
        password: hashed,
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );

    await user.save()

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24*60*60*1000,
    })

    res.status(201).json(
        new ApiResponse(201, "User registered Successfully", user)
    )
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if(!email || !password){
        res.status(400).json(
            new ApiError(400, ["Invalid credentials"])
        )
    }

    const user = await User.findOne({email})

    const isMatched = bcrypt.compare(password, user.password)

    if(!isMatched){
        res.status(400).json(
            new ApiError(400, ["Invalid credentials"])
        )
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24*60*60*1000,
    })
       

    res.status(201).json(
        new ApiResponse(201, "User LoggedIn", user)
    )
})

const logoutUser = asyncHandler(async(req, res) => {
     res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    })

    res.status(201).json(
        new ApiResponse(201, "User LoggedOut")
    )
})

export { registerUser, loginUser, logoutUser }