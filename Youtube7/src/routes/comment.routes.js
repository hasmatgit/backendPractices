import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controller";





const router = Router()

router.use(verifyJWT)

router.route("/:videoId").get(getVideoComment).post(addComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment)


export default  router