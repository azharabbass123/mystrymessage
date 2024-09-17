'use client'
import React, { useState } from 'react'
import { useParams, useRouter} from 'next/navigation'
//import { useRouter } from 'next/router';
import { toast, useToast } from '@/hooks/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { useForm } from 'react-hook-form'
import Link from "next/link";
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Router } from "lucide-react";
import { Input } from "@/components/ui/input";
import { signIn } from 'next-auth/react'


const SignIn = () => {
  const router = useRouter()
  const {toast} = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
        identifier: '',
        password: ''
    }
  })
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if(result?.error){
      if(result.error == "CredentialsSignin"){
        toast({
          title: "Login failed",
          description: "Incorrect username or password",
          variant: "destructive"
        })
      } else{
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive"
        })
      }
      
    }
    
    if(result?.url){
      toast({
        title: "Login success",
        description: "You are successfully logged in",
      })
      router.replace('/dashboard')
    }
    setIsSubmitting(false)
  }
  return (
    <div className="flex justify-center items-center
    min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white
      rounded-lg shadow-md">
        <div className='text-center'>
            <h1 className='text-4xl font-extrabold 
            tracking-tight lg:text-5xl mb-6'>Join Mystry Message</h1>
            <p className='mb-4'>Enter your data to sign in</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField 
            control={form.control}
            name = "identifier"
            render={({field}) => <FormItem>
              <FormLabel>Enter username or email</FormLabel>
              <FormControl>
                <Input placeholder="user@abc.com" {...field} 
                
                />
              </FormControl>
              <FormMessage />
            </FormItem>}
            />
            <FormField 
            control={form.control}
            name = "password"
            render={({field}) => <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-2 w-4 animate-spin" /> Please wait
                  </>
                ) : ('Signup')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Did not have account?{''}
            <Link href='/sign-up' className="text-blue-600
            hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  
  )

}
export default SignIn