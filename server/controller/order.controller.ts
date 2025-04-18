import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, {IOrder} from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import ejs from "ejs"
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notificationModel";
import { getAllOrdersService, newOrder } from "../services/order.service";


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


export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;
        const user = await userModel.findById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const courseExistInUser = user.courses.some((course: any) => course.toString() === courseId);

        if (courseExistInUser) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const data:any = {
            courseId: course._id,
            userId: user._id,
            payment_info,
        };

        const mailData = {
            order: {
                _id: (course._id as string).toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            },
        };

        const html = await ejs.renderFile(path.join(__dirname, '../mails/order-confirmation.ejs'), { order: mailData });

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
        await user?.save();

        await NotificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order for ${course.name}`,
        });

       course.purchased ? course.purchased += 1 : course.purchased; 
        await course.save();

        newOrder(data, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


//get all orders -- only admin

export const getAllOrders = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
      getAllOrdersService(res)
    }  catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
