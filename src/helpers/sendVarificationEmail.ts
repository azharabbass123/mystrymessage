import { resend } from "@/lib/resend";
import {EmailTemplate} from "../../emails/EmailTemplate";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVarificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try{
        let result  = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry Message | Verification code',
            react: EmailTemplate({ firstName: username, otp: verifyCode }),
          });
        return {success: true, message: 'Verification email send successfully'}

    } catch (emailError){
      console.error("Error sending verification email",
        emailError
      )  
      return {success: false, message: 'Fialed to send verification email'}
    }
}