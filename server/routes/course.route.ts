import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addAnswer, addQuestion, addReplyToReview, addReview, deleteCourse, editCourse, getAllCourse, getCourseByUser, getSingleCourse, uploadCourse } from "../controller/course.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
    "/edit-course/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    editCourse
  );

  courseRouter.get(
    "/get-course/:id",
    getSingleCourse
  );

  courseRouter.get(
    "/get-courses",
    getAllCourse
  );

  courseRouter.get(
    "/get-course-content/:id",
    isAuthenticated,
    getCourseByUser
  );

  courseRouter.put(
    "/add-questions",
    isAuthenticated,
    addQuestion
  );

  courseRouter.put(
    "/add-answer",
    isAuthenticated,
    addAnswer
  );

  courseRouter.put(
    "/add-review/:id",
    isAuthenticated,
    addReview
  );

  courseRouter.put(
    "/add-reply",
    isAuthenticated,
    authorizeRoles("admin"),
    addReplyToReview
  );

  courseRouter.get(
    "/get-courses",
    isAuthenticated,
    authorizeRoles("admin"),
    getAllCourse
  );

  courseRouter.delete(
    "/delete-course/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteCourse
  );

export default courseRouter;
