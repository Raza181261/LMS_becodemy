import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotifications, updateNotification } from "../controller/notification.controller";
import { updateAccessToken } from "../controller/user.controller";

const notificationRouter = express.Router();

notificationRouter.get(
    "/get-all-notifications",
    updateAccessToken,
     isAuthenticated,
      authorizeRoles("admin"),
       getNotifications
    )

    notificationRouter.put(
        "/update-notification/:id",
        updateAccessToken,
        isAuthenticated,
        authorizeRoles("admin"),
        updateNotification
        )

export default notificationRouter;