import UserModel from "@/model/User";
import { Message } from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()
    try{
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {status: 404}
            )
        } else{
            if(!user.isAcceptingMessage){
                return Response.json(
                    {
                        success: false,
                        message: "User is not accepting messages"
                    }, {status: 403}
                )
            }
            if(!user.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User is not verified!"
                    }, {status: 403}
                )
            }
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        }
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            }, {status: 200}
        )
    } catch(error){
        console.log("Could not send message, unexpected error", error)
        return Response.json(
            {
                success: false,
                message: "Unexpected error on server side"
            }, {status: 500}
        )
    }
}