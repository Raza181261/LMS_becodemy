"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateProfilePicture = exports.updatePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registrationUser = void 0;
require("dotenv").config();
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const user_service_1 = require("../services/user.service");
const cloudinary_1 = __importDefault(require("cloudinary"));
// first controller to register user
exports.registrationUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email is already exist", 400));
        }
        const user = {
            name,
            email,
            password,
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), data);
        try {
            await (0, sendMail_1.default)({
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
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        user,
        activationCode,
    }, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalide activation code", 400));
        }
        const { name, email, password } = newUser.user;
        const existUser = await user_model_1.default.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler_1.default("email already exist", 400));
        }
        const user = user_model_1.default.create({
            name,
            email,
            password,
        });
        res.status(201).json({
            success: true,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please enter email and password", 400));
        }
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
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
exports.logoutUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Clear cookies
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        // Get user ID and ensure it's valid
        const userId = req.user?._id;
        if (typeof userId === "string" && userId.trim() !== "") {
            await redis_1.redis.del(userId); // Use await to ensure it resolves properly
        }
        else {
            console.error("Invalid user ID for logout:", userId);
        }
        // Send success response
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//update access token
exports.updateAccessToken = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        const message = "Could not refresh token";
        if (!decoded) {
            return next(new ErrorHandler_1.default(message, 400));
        }
        const session = await redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler_1.default(message, 400));
        }
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({
            id: user._id,
        }, process.env.ACCESS_TOKEN, {
            expiresIn: "5h",
        });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: user._id,
        }, process.env.REFRESH_TOKEN, {
            expiresIn: "30d",
        });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800);
        next();
        // res.status(200).json({
        //   status: "success",
        //   refreshToken,
        //   accessToken,
        // })
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// export const updateAccessToken = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const refresh_token = req.cookies.refresh_Token as string;
//       const decoded = jwt.verify(
//         refresh_token,
//         process.env.REFRESH_TOKEN as string
//       ) as JwtPayload;
//       if (!decoded) {
//         return next(new ErrorHandler("Could not refresh token", 400));
//       }
//       const session = await redis.get(decoded.id as string);
//       if (!session) {
//         return next(new ErrorHandler("Please login to access this resource", 400));
//       }
//       const user = JSON.parse(session);
//       const accessToken = jwt.sign(
//         { id: user._id },
//         process.env.ACCESS_TOKEN as string,
//         { expiresIn: "5m" }
//       );
//       const refreshToken = jwt.sign(
//         { id: user._id },
//         process.env.REFRESH_TOKEN as string,
//         { expiresIn: "3d" }
//       );
//       req.user = user;
//       res.cookie("access_Token", accessToken, accessTokenOptions);
//       res.cookie("refresh_Token", refreshToken, refreshTokenOptions);
//       await redis.set(user._id, JSON.stringify(user), "EX", 604800);
//       return res.status(200).json({
//         success: true,
//         accessToken,
//         refreshToken,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );
//get user info
// export const getUserInfo = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?._id;
//     getUserById(userId, res)
//   }catch (error: any) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// })
exports.getUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (typeof userId !== "string") {
            throw new Error("Invalid user ID");
        }
        await (0, user_service_1.getUserById)(userId, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// socialAuth
exports.socialAuth = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = await user_model_1.default.create({ email, name, avatar });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
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
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = String(req.user?._id); // Ensure userId is a string
        const user = await user_model_1.default.findById(userId);
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
            await redis_1.redis.set(userId, JSON.stringify(user)); // Safely set in Redis
        }
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updatePassword = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler_1.default("Please enter old password and new password", 400));
        }
        const userId = String(req.user?._id);
        const user = await user_model_1.default.findById(userId).select("+password");
        if (user?.password === undefined) {
            return next(new ErrorHandler_1.default("Invalid user", 400));
        }
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid old password", 400));
        }
        user.password = newPassword;
        await user.save();
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateProfilePicture = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = String(req.user?._id);
        const user = await user_model_1.default.findById(userId);
        if (avatar && user) {
            // if user have already picture
            if (user?.avatar?.public_id) {
                //first delete image
                await cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
                //second update picture
                const myCloud = cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    // public_id:myCloud.public_id,
                    // url:myCloud.secure_url
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url,
                };
            }
            else {
                //create new profile picture
                const myCloud = cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    // public_id:myCloud.public_id,
                    // url:myCloud.secure_url
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url,
                };
            }
        }
        await user?.save();
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//get all user -- only admin
exports.getAllUsers = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, user_service_1.getAllUserService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//update user role -- only for admin
exports.updateUserRole = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id, role } = req.body;
        (0, user_service_1.updateUserRoleService)(res, id, role);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// // update user role -- admin
// export const updateUserRole = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, role } = req.body;
//       const user = await userModel.findOne({email});
//       if (user) {
//         const id = user._id
//         updateUserRoleService(id, role, res, next);
//       } else {
//         return next(new ErrorHandler("User not found", 400));
//       }
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );
//delete user ---only for admin
exports.deleteUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        await user.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(201).json({
            success: true,
            message: "User deleted successfully ",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
