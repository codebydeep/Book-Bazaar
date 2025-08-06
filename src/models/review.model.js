import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
       user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
       },
       book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
       },
       description: {
        type: String,
        required: true,
       },
       rating: {
        type: Number,
        required: true
       } 
    },
    {
        timestamps: true
    }
);

const Review = mongoose.model("Review", reviewSchema)

export default Review