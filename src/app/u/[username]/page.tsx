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
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
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
  const suggestMsg = () =>{
    useEffect(() =>{
      const fetchMessages = async () => {
      try {
      var response = await axios.post('/api/suggest-messages')
      const fullResponse = response.data.join('');
      const responseParts = fullResponse.split(' ||');
      q1 = responseParts[0].trim();
      q2 = responseParts[1].trim();
      q3 = responseParts[2].trim();

      } catch (error){
        const axiosError = error as AxiosError<ApiResponse>;
        console.log(axiosError.response?.data.message ??
          "Error checking username"
        )
      } finally {
        
      }
      }
      fetchMessages()
    })
  }
 
  return (
    <>
    <div className="flex justify-center items-center
     bg-gray-100">
      <div className="w-full mx-8 px-8 py-5 bg-white
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
    <div className="flex justify-center items-center bg-gray-100">
      <div className="w-full mx-8 px-8 py-2 bg-white
      rounded-lg shadow-md">
        <Button onClick={suggestMsg}>Suggest Messages</Button>
        <p className='space-y-3 mt-2'>Click on any message below to ass it</p>
        <div className='border-slate-300 p-3'>
        <h2 className='space-y-2 text-2xl font-bold'>Messages</h2>
        <div id="response-part1">{q1}</div>
        <div id="response-part2">{q2}</div>
        <div id="response-part3">{q3}</div>

        </div>
        </div>
        </div>
    </>
  )
}

export default Page