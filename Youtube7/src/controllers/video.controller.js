import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


// 📌 Get all videos (with query, pagination, sorting, user filter)
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    const filter = {}

    if (query) {
        filter.title = { $regex: query, $options: "i" }
    }

    if (userId && isValidObjectId(userId)) {
        const userExists = await User.findById(userId)
        if (!userExists) {
            throw new ApiError(404, "User not found")
        }
        filter.owner = userId
    }

    const sortOptions = { [sortBy]: sortType === "asc" ? 1 : -1 }

    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("owner", "username email avatar")

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})


// 📌 Publish a new video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const videoFilePath = req.files?.video?.[0]?.path
    const thumbnailPath = req.files?.thumbnail?.[0]?.path

    if (!title || !description || !videoFilePath) {
        throw new ApiError(400, "Title, description and video file are required")
    }

    const videoUpload = await uploadOnCloudinary(videoFilePath)
    const thumbnailUpload = thumbnailPath ? await uploadOnCloudinary(thumbnailPath) : null

    if (!videoUpload?.url) {
        throw new ApiError(500, "Failed to upload video")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload?.url || "",
        duration: videoUpload.duration || 0,
        owner: req.user?._id
    })

    // ✅ Update User → add videoId into user's videos array
    await User.findByIdAndUpdate(
        req.user?._id,
        { $push: { videos: video._id } },
        { new: true }
    )

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    )
})


// 📌 Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId).populate("owner", "username email avatar")

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})


// 📌 Update video details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailPath = req.file?.path

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description

    if (thumbnailPath) {
        const thumbnailUpload = await uploadOnCloudinary(thumbnailPath)
        updateData.thumbnail = thumbnailUpload?.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, { new: true })

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})


// 📌 Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // ✅ Remove from User's videos[]
    await User.findByIdAndUpdate(
        video.owner,
        { $pull: { videos: video._id } }
    )

    await video.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})


// 📌 Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video publish status updated")
    )
})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
