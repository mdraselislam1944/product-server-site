/* eslint-disable prettier/prettier */


import { Request } from "express"
export interface IGetUserAuthInfoRequest extends Request {
    user: {
        userId: 1,
        role: "admin" | "user",
        iat: number,
        exp: number
    }
}