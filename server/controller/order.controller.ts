import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notificationModel";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
import { RedisKey } from "ioredis";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//create order
// export const createOrder = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
//     try {
//         const {courseId, payment_info} = req.body as IOrder;
//         const user = await userModel.findById(req.user?._id);

//         const courseExistInUser = user?.courses.some((course:any) => course._id.toString() === courseId);

//         if(!courseExistInUser){
//             return next(new ErrorHandler("You have already purchased this course", 400));
//         }

//         const course = await CourseModel.findById(courseId);
//         if(!course){
//             return next(new ErrorHandler("Course not found", 404))
//         }

//         const data:any = {
//             course:course._id,
//             user:user?._id,
//             payment_info,
//         }

//         const mailData = {
//             order:{
//                 _id: (course._id as string).toString().slice(0,6),
//                 // _id: course._id.toString().slice(0,6),

//                 name: course.name,
//                 price: course.price,
//                 date: new Date().toLocaleDateString('en-US' ,{year:'numeric',month:'long', day:'numeric'})
//             }
//         }

//         const html = await ejs.renderFile(path.join(__dirname,'../mails/order-confirmation.ejs'),{order:mailData});

//         try {
//             if(user){
//                 await sendMail({
//                     email:user.email,
//                     subject: "Order Confirmation",
//                     tamplate: "order-confirmation.ejs",
//                     data:mailData
//                 })
//             }
//         } catch (error:any) {
//         return next(new ErrorHandler(error.message, 500))
//         }

//         // user?.courses.push(course?._id);
//         if (typeof course?._id === "string") {
//             user?.courses.push({ courseId: course._id });
//         }
//         await user?.save();

//         await NotificationModel.create({
//             user: user?._id,
//             title:"New Order",
//             message:`You have a new order from ${course?.name}`,
//         });
//         newOrder(data, res, next);

//     } catch (error:any) {
//         return next(new ErrorHandler(error.message, 500))
//     }
// })

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized!", 400));
          }
        }
      }
      const user = await userModel.findById(req.user?._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const courseExistInUser = user.courses.some(
        (course: any) => course.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: (course._id as string).toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          tamplate: "order-confirmation.ejs",
          data: mailData,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      // user.courses.push(course._id);
      if (typeof course?._id === "string") {
        user?.courses.push({ courseId: course._id });
      }
// if req.user is a _id then use this line
      await redis.set(req.user?._id as RedisKey, JSON.stringify(user));

      await user?.save();



      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order for ${course.name}`,
      });

      course.purchased ? (course.purchased += 1) : course.purchased;
      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all orders -- only admin

export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//send stripe publishable key
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

//NEW PAYMENT

export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
