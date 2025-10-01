import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


//TODO: Toggle subscription (subscribe/unsubscribe)
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user?._id; //logged-in user

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    if (userId.toString() === channelId.toString()) {
        throw new ApiError(400, "You cant subscribe to yourslf")
    }

    //check if already subscribed
    const existingSub = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    })

    if (existingSub) {
        // unsubscribe (delete)
        await Subscription.findByIdAndDelete(existingSub._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
    }

    // otherwise subscribe
    const newSub = await Subscription.create({
        subscriber: userId,
        channel: channelId,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newSub, "Subscribed successfully"));

})

//TODO: Get all subscribers of a chennel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const subscribers = await Subscription.find({channel: channelId})
    .populate("subscriber", "username email") //jo subscribe kar rahe hai

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
})

//TODO: Get all channels subscribed by a user
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const channels = await Subscription.find({ subscriber: subscriberId})
    .populate("channel", "username email") //jis chnl ko follow kiya hai

    return res.status(200).json(new ApiResponse(200, channels, "subscribed chanls ftched ssfly"))
})




export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}