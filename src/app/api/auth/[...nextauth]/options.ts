import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "@/model/User";
import { Document } from "mongoose"; // Import Mongoose Document type
import { User as NextAuthUser } from "next-auth"; // Import the NextAuth User type
type MongooseUserDocument = Document<object, User> & User;
// Mapping MongoDB User to NextAuth User
const mapUserToNextAuthUser = (user: MongooseUserDocument): NextAuthUser => ({
    id: user._id, // Map MongoDB _id to NextAuth id
    email: user.email,
    name: user.username,
  });

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
            async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<NextAuthUser | null>{
               
                await dbConnect()
                if (!credentials) {
                    throw new Error("Credentials are undefined");
                }
                const { email, password } = credentials;
                try {
                    const user = await UserModel.findOne({
                      $or: [{ email }, { username: email }],
                    }) as MongooseUserDocument | null;
            
                    if (!user) {
                      throw new Error("No user found with this email");
                    }
            
                    if (!user.isVerified) {
                      throw new Error("Please verify your account before login");
                    }
            
                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
                    if (isPasswordCorrect) {
                      // Return the user mapped to the NextAuth user format
                      return mapUserToNextAuthUser(user);
                    } else {
                      throw new Error("Password is incorrect");
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