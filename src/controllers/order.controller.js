import Order from "../models/order.model.js";
import { asyncHandler } from "../utils/async-handler.js"
import {ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"

const placedOrder = asyncHandler(async(req, res) => {
    const { items, total } = req.body


    if(!items || !total){
        return res.status(400).json(
            new ApiError(400, false, ["Fill all the details to placed order!"])
        )
    }

    const order = await Order.create({
        user: req.user._id,
        items,
        total
    })

    res.status(201).json(
        new ApiResponse(
            201,
            "Order placed successfully",
            { order }
        )
    )
})

const getAllOrderDetailsForUser = asyncHandler(async(req, res) => {
    const userId = req.user._id

    const allOrders = await Order.find({
        user: userId
    })

    res.status(200).json(
        new ApiResponse(
            200,
            "Orders fetched Successfully",
            {allOrders}
        )
    )
})

const getOrderDetailsById = asyncHandler(async(req, res) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId)

    if(!order){
        return res.status(400).json(
            new ApiError(
                400,
                false,
                ["No Order found!"]
            )
        )
    } 
        
    res.status(200).json(
        new ApiResponse(
            200,
            "Order fetched Successfully!",
            {order}
        )
    )
})

export {
    placedOrder,
    getAllOrderDetailsForUser,
    getOrderDetailsById
}