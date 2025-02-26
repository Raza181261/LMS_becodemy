require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/Error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

//body parser
app.use(express.json({ limit: "50mb" }));

//cokie parser
app.use(cookieParser());

//cors
app.use(
  cors({
    // origin: process.env.ORIGIN,
       origin: ['http://localhost:3000'],
       credentials:true
  })
);

//routes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);

//TESTING API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "api is work",
  });
});

//unknow route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`route${req.originalUrl}not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
