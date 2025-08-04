import User from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json(
        new ApiError(400, "All the details are required", [
          "fullname",
          "email",
          "password",
        ]),
      );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json(new ApiError(400, false, ["User already exists"]));
  }

  const user = await User.create({
    fullname,
    email,
    password,
  });


  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  const accessToken = user.generateAccessToken()

  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false});

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 15,
  });
  

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "User registered Successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(new ApiError(400, ["Invalid credentials"]));
  }

  const user = await User.findOne({ email });

  const isMatched = await user.isPasswordMatched(password)

  if (!isMatched) {
    return res.status(400).json(new ApiError(400, ["Invalid credentials"]));
  }

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  const accessToken = await user.generateAccessToken()

  const refreshToken = await user.generateRefreshToken()

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 15,
  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json(new ApiResponse(201, "User LoggedIn", loginUser));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            }
        },
        {
            new: true,
        }
    )

  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
  });
  
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(201).json(new ApiResponse(201, {}, "User LoggedOut"));
});

const getProfile = asyncHandler(async (req, res) => {
  res
    .status(201)
    .json(new ApiResponse(201, "Profile fetched Successfully", req.user));
});

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getProfile 
};