import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                book: {
                    type: Schema.Types.ObjectId,
                    ref: "Book",
                    required: true
                },
                quantity: {
                   type: Number,
                   required: true,
                   default: 1 
                }
            },
        ],
        total: {
            type: Number,
            required: true
        },
        orderStatus: {
            type: String, 
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: 'pending'
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "failed"],
            default: 'unpaid'
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema)

export default Order