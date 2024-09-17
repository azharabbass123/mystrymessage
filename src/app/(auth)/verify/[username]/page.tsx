'use client'
import React, { useState } from 'react'
import { useParams, useRouter} from 'next/navigation'
//import { useRouter } from 'next/router';
import { toast, useToast } from '@/hooks/use-toast'
import { verfiySchema } from '@/schemas/verifySchema'
import { useForm } from 'react-hook-form'
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const VerfiyUser = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast} = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false);

  //zod implementation
  const form = useForm<z.infer<typeof verfiySchema>>({
    resolver: zodResolver(verfiySchema),
  })

  const onSubmit = async (data: z.infer<typeof verfiySchema>) => {
    setIsSubmitting(true)
    try{
        const response = await axios.post('/api/verify-code', {
            username: params.username,
            code: data.code
        })
        if(response.data.success){
        toast({
            title: "Success",
            description: response.data.message
        })
        handleRedirect();
        } 
        else{
            toast({
                title: "Error",
                description: response.data.message
            })
        }
      setIsSubmitting(false)
    } catch (error){
        console.error("Error in code verification", error)
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message
        toast({
          title: "Code verification failed",
          description: errorMessage,
          variant: "destructive"
        })
      setIsSubmitting(false)
    }
  }

  const handleRedirect = () => {
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split('/').filter(Boolean);

    if (pathSegments.length >= 2) {
      pathSegments.pop(); 

    }
    const newPath = `/sign-in`;
    router.replace(newPath);
  };

  return (
    <div className="flex justify-center items-center
    min-h-screen bg-gray-100">
        <div  className="w-full max-w-md p-8 space-y-8 bg-white
      rounded-lg shadow-md">
        <div className='text-center'>
            <h1 className='text-4xl font-extrabold 
            tracking-tight lg:text-5xl mb-6'>Verify Your Account</h1>
            <p className='mb-4'>Enter your verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField 
            control={form.control}
            name = "code"
            render={({field}) => <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} 
                
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
                ) : ('verify')
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerfiyUser