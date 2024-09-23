'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {toast} = useToast();
  const params = useParams<{username: string}>()
  let username = params.username;
  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues:{
      content: "",
    }
  })
  const onSubmit = async (data: z.infer<typeof MessageSchema>) =>{
    setIsSubmitting(true);
    try{
      const paylaod = {
        username: username,
        content : data.content,
      }
      const response = await axios.post<ApiResponse>('/api/send-message', paylaod)
      if(response.data.success){
        toast({
            title: 'Success',
            description: response.data.message
          })
          
      }else{
        toast({
            title: 'Error',
            description: response.data.message
          })
      }
      setIsSubmitting(false)
    } catch (error){
      console.error("Error in sending message", error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Message sending failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }
  return (
    <>
    <div className="flex justify-center items-center
    min-h-screen bg-gray-100">
      <div className="w-full mx-8 p-8 bg-white
      rounded-lg shadow-md">
        <div className="text-center">
          <h1 className='text-4xl font-extrabold
          tracking-tight lg:text-5xl mb-6'>Public Profile Link</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='content' 
              render={({field}) => <FormItem>
                <FormLabel className='w-full'>Send Anynomus Message to @{username}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder='Write anynomus message here...' {...field} className='min-w-full' />
                </FormControl>
                <FormMessage />
              </FormItem>}
              />
              <Button type='submit' disabled={isSubmitting}>
                {
                  isSubmitting ? (
                    <>
                    <Loader className='mr-2 h-2 w-4 animate-spin'>Please wait</Loader>
                    </>
                  ) : (
                    'Send It'
                  )
                }
              </Button>
          </form>
        </Form>
      </div>
    </div>
    </>
  )
}

export default Page