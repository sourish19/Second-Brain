import { z, ZodError } from 'zod';

import asyncHandler from '../utils/asyncHandler.util';

// const ValidateData = (schema: z.ZodObject<any> )=>{
//     return asyncHandler(async(req,res,next)=>{
//         try {
//             const result = schema.safeParse(req.body)
//             next()
//         } catch (error) {
//             if(error instanceof ZodError){
//                 const errors = error.
//             }
//         }
//     })
// }
