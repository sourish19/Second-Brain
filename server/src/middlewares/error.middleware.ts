import { Request, Response,NextFunction } from "../types/express";



const customErrorResponse = (err:unknown, req:Request, res:Response, next:NextFunction) => {
    if(err instanceof Error){
        return res.status(err.status).json({
            error: [],
            message: err.message || 'Internal Server Error',
            statusCode: 500,
            success: false,
          });
    }

  // For other errors
  res.status(500).json({
    error: [],
    message: err.message || 'Internal Server Error',
    statusCode: 500,
    success: false,
  });
};

export default customErrorResponse;