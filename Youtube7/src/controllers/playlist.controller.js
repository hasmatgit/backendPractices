import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Playlist } from "../models/playlist.model";
import { ApiResponse } from "../utils/ApiResponse";






//TODO: create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    //use owner from authenticated user
    const owner = req.user._id;

    const playlist = await Playlist.create({ name, description, owner, videos: [] })
    res.status(201).json(new ApiResponse(true, "Playlist created successfully", playlist))
})


//TODO: Get all playlists of a user
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const playlists = await Playlist.find({ user: userId }).populate("videos")
    res.status(200).json(new ApiResponse(true, "User playlist fetched successfully", playlists))
})



//TODO: Get playlist by ID
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId).populate("videos")
    if (!playlist) throw new ApiError(404, "Playlist not found")

    res.st
    atus(200).json(new ApiResponse(true, "Playlist fetched successfully", playlist))
})



//TODO: Add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")

    if (!playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId)
        await playlist.save()
    }

    res.status(200).json(new ApiResponse(true, "Video added to playlist", playlist))
})



// TODO: remove a video a from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")

    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId)
    await playlist.save()

    res.status(200).json(new ApiResponse(true, "Playlist removed successfully", playlist))
})



// TODO: delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    res.status(200).json(new ApiError(true, "Playlist deleted successfully"))
})



//TODO: update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, "Invalid playlist ID")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (name) playlist.name = name
    if (description) playlist.description = description

    await playlist.save()

    res.status(200).json(new ApiResponse(true, "Playlist updated successfully"))
})






export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}