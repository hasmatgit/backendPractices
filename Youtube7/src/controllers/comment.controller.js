import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/ApiError";




//TODO: get all comments for a video
const getVideoComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username")
        .skip((page - 1) * limit)
        .limit(Number(limit))

    return res.status(200).json(
        new ApiResponse(200, {
            comments, totalComments,
            currentPage: Number(page),
            totalPages: matchMedia.ceil(totalComments / limit)
        }, "comments featched successfully")
    )
})



//TODO : add a coment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.patams;
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(200, "comment content is required")
    }

    // create comment
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    });

    // populate owner info
    await comment.populate("owner", "username");

    return res.status(200).json(new ApiResponse(201, comment, "comment addd sucsfy"))
})



//TODO: update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    //validate commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    //validate content
    if (!content?.trim()) {
        throw new ApiError(400, "comment content is required")
    }

    //find comment by ID
    const comment = await Comment.findById(commentId)

    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }

    //ensure only the owner can update 
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "U are not authrzd usr to updt ths cmnt")
    }

    // update content and save
    comment.content = content;
    await comment.save();

    //populate ownt info for clarity
    await comment.populate("owner", "username");

    return res.status(200).json(
        new ApiResponse(200, comment, "comment updated Successfully")
    );
});

//TODO: delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    //validate commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    //find the comment
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    //ensure only the owner can delete 
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "U are not authorize to delete this comment")
    }

    //delete comment 
    await comment.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, "comment deleted successfully")
    )
})



export {
    getVideoComment,
    addComment,
    updateComment,
    deleteComment
}