"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
exports.isAuthenticated = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return next(new ErrorHandler_1.default("[No_Token] Please login to access this resources", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler_1.default("access token is not valid", 400));
    }
    const user = await redis_1.redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.default("[No User] Please login to access this resources", 400));
    }
    // console.log(user);
    req.user = JSON.parse(user);
    next();
});
//validate user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler_1.default(`Role:${req.user?.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
