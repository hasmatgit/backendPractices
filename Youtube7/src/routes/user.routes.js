import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route = Router("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            neme: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

export default router