"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoUrl = exports.deleteCourse = exports.getAdminAllCourses = exports.addReplyToReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.getAllCourse = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_service_1 = require("../services/course.service");
const course_model_1 = __importDefault(require("../models/course.model"));
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const axios_1 = __importDefault(require("axios"));
//upload course
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//edit course
// export const editCourse = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = req.body;
//       const thumbnail = data.thumbnail;
//       const courseId = req.params.id;
//       const courseData = await CourseModel.findById(courseId) as any;
//       if (thumbnail && !thumbnail.startsWith("https")) {
//         await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
//         const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
//           folder: "courses",
//         });
//         data.thumbnail = {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         };
//       }
//       if(thumbnail.startsWith("https")){
//         data.thumbnail = {
//           public_id: courseData?.thumbnail.public_id,
//           url:courseData?.thumbnail.url
//         }
//       }
//       const course = await CourseModel.findByIdAndUpdate(
//         courseId,
//         {
//           $set: data,
//         },
//         {
//           new: true,
//         }
//       );
//       res.status(200).json({
//         success: true,
//         course,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseId = req.params.id;
        const courseData = await course_model_1.default.findById(courseId);
        if (!courseData) {
            return res.status(404).json({
                success: false,
                message: "Course not found!",
            });
        }
        if (thumbnail && !thumbnail.startsWith("https")) {
            if (courseData.thumbnail && courseData.thumbnail.public_id) {
                await cloudinary_1.default.v2.uploader.destroy(courseData.thumbnail.public_id);
            }
            else {
                console.warn("Warning: No previous thumbnail found.");
            }
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (thumbnail.startsWith("https")) {
            if (courseData.thumbnail) {
                data.thumbnail = {
                    public_id: courseData.thumbnail.public_id,
                    url: courseData.thumbnail.url,
                };
            }
            else {
                console.warn("Warning: No previous thumbnail found.");
                data.thumbnail = {
                    public_id: "",
                    url: "",
                };
            }
        }
        const course = await course_model_1.default.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get single course ---- without purchasing
exports.getSingleCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis_1.redis.get(courseId);
        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course,
            });
        }
        else {
            const course = await course_model_1.default.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
            res.status(200).json({
                success: true,
                course,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all course -- without purchaseing
exports.getAllCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const courses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        await redis_1.redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get courses content --only valid user
exports.getCourseByUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        // return res.json({courseId, userCourseList, reqUser: req.user}); //checked by aqib
        const courseExist = userCourseList?.find((course) => course._id.toString() === courseId);
        if (!courseExist) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course,course doesn't exits", 404));
        }
        const course = await course_model_1.default.findById(courseId);
        const content = course?.courseData;
        console.log("Requested Course ID:", courseId);
        console.log("User Courses:", userCourseList);
        res.status(200).json({
            success: true,
            courseData: content, //add courseData in later
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addQuestion = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        const courseContent = course?.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        //create new question
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        //add this question to our course content
        courseContent.questions.push(newQuestion);
        await notificationModel_1.default.create({
            user: req.user?._id,
            title: "New Question",
            message: `You have a new question in ${courseContent.title}`,
        });
        //save upload course
        await course?.save();
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addAnswer = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        const courseContent = course?.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        const question = courseContent?.questions?.find((item) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler_1.default("Invalid question id", 400));
        }
        //create new answer object
        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        //add this answer to our course content
        question.questionReplies?.push(newAnswer);
        await course?.save();
        if (req.user?._id === question.user._id) {
            //create a notification
            await notificationModel_1.default.create({
                user: req.user?._id,
                title: "New Question Rely Received",
                message: `You have a new question reply in ${courseContent.title}`,
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data);
            try {
                await (0, sendMail_1.default)({
                    email: question.user.email,
                    subject: "Question Reply",
                    tamplate: "question-reply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 400));
            }
        }
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReview = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExist = userCourseList?.some((course) => course._id.toString() === courseId.toString());
        if (!courseExist) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            rating,
            comment: review,
        };
        course?.reviews.push(reviewData);
        let avg = 0;
        course?.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        if (course) {
            course.ratings = avg / course.reviews.length;
        }
        await course?.save();
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); //7 days
        // const notification = {
        //   title: "New Review Received",
        //   message: `${req.user?.name} has given review in ${course?.name}`,
        // };
        //create notification later
        await notificationModel_1.default.create({
            user: req.user?._id,
            title: "New Review Received",
            message: `${req.user?.name} has given review in ${course?.name}`,
        });
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReplyToReview = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const review = course?.reviews?.find((rev) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found", 404));
        }
        const replyData = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies?.push(replyData);
        await course?.save();
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); //7 days
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all courses -- only admin
exports.getAdminAllCourses = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, course_service_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//delete course ---only for admin
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await course_model_1.default.findById(id);
        if (!course) {
            return next(new ErrorHandler_1.default("course not found", 404));
        }
        await course.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(201).json({
            success: true,
            message: "Course deleted successfully ",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//generate video url
exports.generateVideoUrl = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
