'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Loader, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

interface Question {
  question: string;
}

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [newMessageValue, setNewMessageValue] = useState<string>('');
  let [fetchMsgCount, setFetchMsgCount] = useState(0);
  const cleanText = useRef<string[]>([]);
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
 
  useEffect(() =>{
    const fetchMessages = async () => {
    try {
    setIsFetching(true);
    var response = await axios.post('/api/suggest-messages')
    // Assuming data is an array of question objects
 
   cleanText.current = response.data
    .replace(/0:"/g, '')   // Remove the leading '0:"'
    .replace(/"/g, '')
    .replace(/\\/g, '')    // Remove the trailing '"'
    .split('||')           // Split based on the '||' delimiter
     .map((item: string) => item.trim()) // Trim whitespace from each segment
     .filter((item: string) => item.length > 0); // Remove any empty strings

   //setQ1(cleanText);
    // const fullResponse = response.data.join('');
    // const responseParts = fullResponse.split(' ||');
    // setQ1(responseParts[0].trim());
    // setQ2(responseParts[1].trim());
    // setQ3(responseParts[2].trim());
    
    } catch (error){
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError.response?.data.message ??
        "Error fetching messages"
      )
    } finally {
    setIsFetching(false);
    }
    }
    fetchMessages()
  },[fetchMsgCount])
  
  const fetchAgain = () =>{
    setFetchMsgCount(fetchMsgCount++);
  }
  const setMessageValue = (e: React.MouseEvent<HTMLParagraphElement>) =>{
    const target = e.currentTarget;
    const msg = target.innerText;
    setNewMessageValue(msg);
    console.log(msg);
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
        <Button disabled={isFetching} onClick={fetchAgain}> {
          isFetching ? (
            <>
              <Loader2 className='mr-2 h-2 w-4 animate-spin'>Fetching...</Loader2>
              </>
          ) : (
            'Suggest Messages'
          ) }</Button>
        <p className='space-y-3 mt-2'>Click on any message below to send it</p>
        <div className='border-slate-300 px-1 mt-4 space-y-4 bg-grey'>
        <h2 className='space-y-3 text-2xl font-bold'>Messages</h2>
        <div className='flex justify-center align-center flex-col'>
          {cleanText.current.map((question: string, index: number) => (
            <p key={index} onClick={(e) => setMessageValue(e)} className='font-bold mx-4 text-center 
            p-4 border-black curser-pointer'>{question.trim()}</p> // Add '?' back for display
          ))}
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Page