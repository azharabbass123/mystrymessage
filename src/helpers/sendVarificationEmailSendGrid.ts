import { ApiResponse } from "@/types/apiResponse"

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'your-default-api-key');

export async function sendVarificationEmailSendGrid(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    const msg = {
        to: email, 
        from: 'azhar.diligent@gmail.com', 
        subject: 'Mystry Message | Account Verification',
        text: username,
        html: `<h1>Well come, ${username}</h1><p>Here is your code to verify
        your account: <strong>${verifyCode}</strong></p>`,
       }
    try{
        const response = await sgMail.send(msg)
        if(response[0].statusCode === 202){
            return {success: true, message: 'Verification email send successfully'}
        } else {
            return {success: false, message: 'Error sending email'}
        }
    } catch (error){
        console.log("Error sending email", error)
        return {success: false, message: 'Error sending email'}
    }

}


