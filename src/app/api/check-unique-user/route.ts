import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function POST(request: Request) {
    await dbConnect()
    try{
        const {userInput} = await request.json()
        const queryParam = {
            username: userInput
        }
        //validation with zod
        const result = UsernameQuerySchema.safeParse
        (queryParam)
        if(!result.success){
            const usernameErrors = result.error.format().
            username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?. length > 0
                ? usernameErrors.join(',')
                : 'Invalid query parameters',
            }, {status: 400}
        )
        }

        const {username} = result.data

        const existingVerfiedUser = await UserModel.findOne
        ({username, isVerified: true})

        if(existingVerfiedUser){
            return Response.json({
                success: false,
                message: "username is alredy taken",
            }, {status: 400})
        } else{
            return Response.json({
                success: true,
                message: 'Username is available',
            }, {status: 200})
        }
    }
    catch (error){
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}
        )
    }
}
