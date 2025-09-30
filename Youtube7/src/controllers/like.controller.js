import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { Like } from "../models/like.model"





// TODO: toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(true, "Video unliked successfull"))
    }

    const like = await Like.create({ video: videoId, likedBy: userId })
    return res.status(200).json(new ApiResponse(true, "Video liked successfully"))
})



// TODO: Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(true, "Comment unliked successfull"))
    }

    const like = await Like.create({ comment: commentId, likedBy: userId })
    return res.status(200).json(new ApiResponse(true, "Comment liked successfully"))
})



// TODO: Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(true, "tweet unliked successfull"))
    }

    const like = await Like.create({ tweet: tweetId, likedBy: userId })
    return res.status(200).json(new ApiResponse(true, "Tweet liked successfully"))
})


// TODO: Get all liked videos by user
const getLikedVideos = asyncHandler(async(req, res) => {
    const userId = req.user._id

    const getLikedVideos = await Like.find({ likedBy: userId, video: { $exists:true, $ne: null }})
    .populate("video")

    res.status(200).json(new ApiResponse(true, "Liked videos fetched successfully"))
})





export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}