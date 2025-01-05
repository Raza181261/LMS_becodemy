import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/ErrorHandler'

export const ErrorMiddleware = (err:any, req:Request, res:Response, next:NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error ";

    // wrong mongoDB id
    if(err.name === 'CastError'){
        const message = `Responce not found.Invalid: ${err.path}`;
    }

    //Duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400)
    }

    //wrong jwt error
    if(err.name === 'JsonWebTokenError'){
        const message = `json web token is invalid, try again`;
        err  = new ErrorHandler(message, 400)
    }

    //jwt expired error
    if(err.name === 'TokenExpiredError'){
        const message = `Json web token is expired, try again later`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}