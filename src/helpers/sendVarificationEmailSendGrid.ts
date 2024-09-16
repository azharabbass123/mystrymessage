import { ApiResponse } from "@/types/apiResponse"

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendVarificationEmailSendGrid(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    const msg = {
        to: email, // Change to your recipient
        from: 'azhar.diligent@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: username,
        html: `<strong>${verifyCode}</strong>`,
       }
    try{
        const response = await sgMail.send(msg)
        if(response[0].statusCode === 202){
            return {success: true, message: 'Verification email send successfully'}
        } else {
            return {success: false, message: response.message}
        }
    } catch (error){
        console.log("Error sending email", error)
        return {success: false, message: 'Error sending email'}
    }

}


