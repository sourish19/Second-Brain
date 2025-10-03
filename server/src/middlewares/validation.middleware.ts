import { z, ZodError } from 'zod';

import asyncHandler from '../utils/asyncHandler.util';
import ApiError from '../utils/apiError.util';
import type { RequestHandler } from 'express';


// const getErrors:[] = (zodErr) => {
//   const flaten = z.flattenError(zodErr);
//   return flaten.fieldErrors;
// };
const ValidateData = (schema: z.ZodSchema):RequestHandler=>{
    return asyncHandler(async(req,res,next)=>{
        const result = schema.safeParse(req.body)
        if(result.success) next()
                if(result.error instanceof ZodError)
            console.log((result.error));
            
    //     throw new ApiError(422,'Validation Error',getErrors(result.error),[])
    // next()
    })
}

export default ValidateData