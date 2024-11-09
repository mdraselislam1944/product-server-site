/* eslint-disable prettier/prettier */

import { Response } from 'express';

type TMeta = {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
};

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: TMeta;
    data?: T;
    errors?: { field?: string; message: string }[];
};

export const sendResponse = <T>(
    res: Response,
    {
        statusCode,
        success,
        message,
        data,
        meta,
        errors,
    }: TResponse<T>
) => {
    return res.status(statusCode).json({
        statusCode,
        success,
        message,
        meta,
        data,
        errors,
    });
};