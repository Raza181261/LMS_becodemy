"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.sendStripePublishableKey = exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//create order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId, payment_info } = req.body;
        const user = (await user_model_1.default.findById(req.user?._id));
        const courseExistInUser = user?.courses.some((course) => course._id.toString() === courseId);
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const data = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
        };
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                // _id: course._id.toString().slice(0,6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        };
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user) {
                await (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    tamplate: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        // user?.courses.push(course._id);
        user.courses.push(courseId);
        // console.log("User" ,user)
        // if (typeof course?._id === "string") {
        //     user?.courses.push({ courseId: course._id });
        // }
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        await user?.save();
        await notificationModel_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
        });
        course.purchased = course.purchased + 1;
        await course?.save();
        (0, order_service_1.newOrder)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// export const createOrder = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { courseId, payment_info } = req.body as IOrder;
//       if (payment_info) {
//         if ("id" in payment_info) {
//           const paymentIntentId = payment_info.id;
//           const paymentIntent = await stripe.paymentIntents.retrieve(
//             paymentIntentId
//           );
//           if (paymentIntent.status !== "succeeded") {
//             return next(new ErrorHandler("Payment not authorized!", 400));
//           }
//         }
//       }
//       const user = await userModel.findById(req.user?._id);
//       if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//       }
//       const courseExistInUser = user.courses.some(
//         (course: any) => course.toString() === courseId
//       );
//       if (courseExistInUser) {
//         return next(
//           new ErrorHandler("You have already purchased this course", 400)
//         );
//       }
//       const course = await CourseModel.findById(courseId);
//       if (!course) {
//         return next(new ErrorHandler("Course not found", 404));
//       }
//       const data: any = {
//         courseId: course._id,
//         userId: user._id,
//         payment_info,
//       };
//       const mailData = {
//         order: {
//           _id: (course._id as string).toString().slice(0, 6),
//           name: course.name,
//           price: course.price,
//           date: new Date().toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }),
//         },
//       };
//       const html = await ejs.renderFile(
//         path.join(__dirname, "../mails/order-confirmation.ejs"),
//         { order: mailData }
//       );
//       try {
//         await sendMail({
//           email: user.email,
//           subject: "Order Confirmation",
//           tamplate: "order-confirmation.ejs",
//           data: mailData,
//         });
//       } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//       }
//       // user.courses.push(course._id);
//       if (typeof course?._id === "string") {
//         user?.courses.push({ courseId: course._id });
//       }
// // if req.user is a _id then use this line
//       await redis.set(req.user?._id as RedisKey, JSON.stringify(user));
//       await user?.save();
//       await NotificationModel.create({
//         user: user?._id,
//         title: "New Order",
//         message: `You have a new order for ${course.name}`,
//       });
//       course.purchased ? (course.purchased += 1) : course.purchased;
//       await course.save();
//       newOrder(data, res, next);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );
//get all orders -- only admin
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//send stripe publishable key
exports.sendStripePublishableKey = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res) => {
    res.status(200).json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});
//NEW PAYMENT
exports.newPayment = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "USD",
            metadata: {
                company: "E-Learning",
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.status(201).json({
            success: true,
            client_secret: myPayment.client_secret,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
