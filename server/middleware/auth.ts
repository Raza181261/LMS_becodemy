import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const accessToken = req.cookies.access_token as string;

    if (!accessToken) {
      return next(
        new ErrorHandler("[No_Token] Please login to access this resources", 400)
      );
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("[No User] Please login to access this resources", 400));
    }
    // console.log(user);
    req.user = JSON.parse(user);

    next();
  }
);


//validate user roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res:Response, next:NextFunction) => {
    if(!roles.includes(req.user?.role || '')){
      return next(new ErrorHandler(`Role:${req.user?.role} is not allowed to access this resource`, 403))
    }
    next();
  }
}