import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { MessageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{username: string}>()
  let username = params.username;
  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues:{
      content: "",
    }
  })
  const handleSubmit = async (data: z.infer<typeof MessageSchema>) =>{
    setIsSubmitting(true);
  }
  return (
    <>
    <div className="flex justify-center items-center
    min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white
      rounded-lg shadow-md">
        <div className="text-center">
          <h1 className='text-4xl font-extrabold
          tracking-tight lg:text-5xl mb-6'>Public Profile Link</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='content' 
              render={({field}) => <FormItem>
                <FormLabel>Send Anynomus Message to @{username}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder='Write anynomus message here...' {...field}/>
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

export default page