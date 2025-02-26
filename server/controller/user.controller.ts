require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUserService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary";

//register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// first controller to register user
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email is already exist", 400));
      }
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          tamplate: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalide activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("email already exist", 400));
      }

      const user = userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout user
// export const logoutUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       res.cookie("access_token", "", { maxAge: 1 });
//       res.cookie("refresh_token", "", { maxAge: 1 });
//       const userId = req.user?._id || "";
//       redis.del(userId)
//       res.status(200).json({
//         success: true,
//         message: "Logged out successfully",
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear cookies
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      // Get user ID and ensure it's valid
      const userId = req.user?._id;
      if (typeof userId === "string" && userId.trim() !== "") {
        await redis.del(userId); // Use await to ensure it resolves properly
      } else {
        console.error("Invalid user ID for logout:", userId);
      }

      // Send success response
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_Token as string;

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(new ErrorHandler("Please login to access this resources", 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.user = user;

      res.cookie("access_Token", accessToken, accessTokenOptions);
      res.cookie("refresh_Token", refreshToken, refreshTokenOptions);

      await redis.set(user._id,JSON.stringify(user),"EX", 604800) //604800 == 7 days

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get user info
// export const getUserInfo = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?._id;
//     getUserById(userId, res)
//   }catch (error: any) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// })

export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      if (typeof userId !== "string") {
        throw new Error("Invalid user ID");
      }

      await getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

// socialAuth
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;

      const user = await userModel.findOne({ email });

      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

// export const updateUserInfo = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, email } = req.body as IUpdateUserInfo;
//       const userId = req.user?._id;

//       const user = await userModel.findById(userId);

//       if (email && user) {
//         const isEmailExist = await userModel.findOne({ email });
//         if (isEmailExist) {
//           return next(new ErrorHandler("Email is already exist", 400));
//         }
//         user.email = email;
//       }

//       if (name && user) {
//         user.name = name;
//       }

//       await user?.save();
//       await redis.set(userId, JSON.stringify(user));
//       res.status(201).json({
//         success: true,
//         user,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as IUpdateUserInfo;
      const userId = String(req.user?._id); // Ensure userId is a string

      const user = await userModel.findById(userId);

      // if (email && user) {
      //   const isEmailExist = await userModel.findOne({ email });
      //   if (isEmailExist) {
      //     return next(new ErrorHandler("Email already exists", 400));
      //   }
      //   user.email = email;
      // }

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      if (userId) {
        await redis.set(userId, JSON.stringify(user)); // Safely set in Redis
      }

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//update user password
interface IUpdatePassword{
  oldPassword:string;
  newPassword:string;
}

export const updatePassword = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
  try {
    const {oldPassword, newPassword} = req.body as IUpdatePassword;

    if(!oldPassword || !newPassword){
      return next(new ErrorHandler("Please enter old password and new password", 400))
    }

    const userId = String(req.user?._id);

    const user = await userModel.findById(userId).select("+password");

    if(user?.password === undefined){
      return next(new ErrorHandler("Invalid user", 400))
    }

    const isPasswordMatch = await user?.comparePassword(oldPassword);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid old password", 400))
    }

    user.password = newPassword;

    await user.save();

    await redis.set(userId,JSON.stringify(user))

    res.status(201).json({
      success: true,
      user,
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
})


//update profile picture

interface IUpdateProfilePicture{
  avatar:string;
}

export const updateProfilePicture = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
  try {
    const {avatar} = req.body;
    const userId = String(req.user?._id);
    const user = await userModel.findById(userId);

    if(avatar && user){
      // if user have already picture 
      if(user?.avatar?.public_id){
        //first delete image
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
        
        //second update picture
        const myCloud = cloudinary.v2.uploader.upload(avatar, {
            folder:"avatars",
            width:150,
        })
        user.avatar = {
          // public_id:myCloud.public_id,
          // url:myCloud.secure_url
          public_id:(await myCloud).public_id,
          url:(await myCloud).secure_url
        };
      }else{
        //create new profile picture
        const myCloud = cloudinary.v2.uploader.upload(avatar, {
          folder:"avatars",
          width:150,
      })
      user.avatar = {
        // public_id:myCloud.public_id,
        // url:myCloud.secure_url
        public_id:(await myCloud).public_id,
        url:(await myCloud).secure_url
      };
      }
    }

    await user?.save();
    await redis.set(userId, JSON.stringify(user));

    res.status(201).json({
      success:true,
      user,
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
})


//get all user -- only admin

export const getAllUsers = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
  try {
    getAllUserService(res)
  }  catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
})

//update user role -- only for admin
export const updateUserRole = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
  try {
    const{id, role} = req.body;
    updateUserRoleService(res, id, role);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
})


//delete user ---only for admin
export const deleteUser = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
  try {
    const {id} = req.params;
    const user = await userModel.findById(id)

    if(!user){
      return next(new ErrorHandler("User not found", 404));
    }

    await user.deleteOne({id});
    await redis.del(id);

    res.status(201).json({
      success:true,
      message:"User deleted successfully "
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
})