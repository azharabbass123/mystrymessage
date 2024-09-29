import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text",
                placeholder: "jsmith"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<any>{
                await dbConnect()
                if (!credentials) {
                    throw new Error("Credentials are undefined");
                }
                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.email}, { username: credentials.email}],
                      });
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,
                        user.password)
                    if(isPasswordCorrect){
                        return user
                    } else {
                        throw new Error('Password is incorrect')
                    }
                } catch (err: unknown) {
                    if (err instanceof Error) {
                      throw new Error(err.message); // Handle errors more explicitly
                    } else {
                      throw new Error("An unknown error occurred");
                    }
                }
            }
        })
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({
            session, token
        }){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        }
    },
    pages:{
        signIn: '/sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret:"process.env.NEXTAUTH_SECRET",
}