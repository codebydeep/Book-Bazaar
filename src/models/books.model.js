import mongoose, { Schema } from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true
    }
);

const Book = mongoose.model("Book", bookSchema)

export default Book;