'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'
import { ArrowUp, Loader2 } from 'lucide-react'
import React, { useState } from 'react'

const Page = () => {
    const [chatQuery, setChatQuery] = useState("");
    const [chatQuerySaved, setChatQuerySaved] = useState("");
    const [chatResponse, setChatResponse] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    const handleClick = async () =>{
      if(chatQuery.trim() == ""){
        toast({
          title: "Invalid input",
          description: "Please enter a valid query",
          variant: "destructive"
        })
      return
      }
      try{
        setIsFetching(true);
        const chatCopy = chatQuery 
        const response = await axios.post('/api/open-chat', {
          prompt: chatCopy
        })
        const cleanText = response.data
        .replace(/0:"/g, '')   // Remove the leading '0:"'
        .replace(/"/g, '') 
        .replace(/\\/g, '')  // Remove \ symbol
        .split(' n')           // Split based on the '||' delimiter
        .map((item: string) => item.trim()) // Trim whitespace from each segment
        .filter((item: string) => item.length > 0); // Remove any empty strings
        setChatResponse(cleanText);
      }catch(error){
        console.error(error);
      } finally {
        setChatQuerySaved(chatQuery);
        setChatQuery("");
        setIsFetching(false);
      }
    } 

  return (
    <div className='relative h-screen mt-8'>
      {chatResponse == "" ? (<div>
          <p className="text-center m-8 px-8 py-5 bg-white
            rounded-lg shadow-md">Enter your queries to get instant response</p>
          </div>) : (
            <div className="m-8 flex flex-col items-center justify-center">
              <p className='text-center my-2 px-8 py-5 rounded-lg shadow-md w-[50%] bg-white'>
                <b>You: </b> {chatQuerySaved}
                </p>
              <p className='text-center px-8 py-5 rounded-lg shadow-md w-[50%] bg-white'>
                <b>AI: </b>{chatResponse}
                </p>
              </div>
          )}
        
        <div className='mt-2 w-[60%] ml-[20%] bg-slate-100 rounded-lg bg- border-rounded px-5 py-2 fixed bottom-2 flex align-center justify-center space-x-3'>
            <Input className='gap-2 py-8 border-none no-scrollbar'
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder='Ask me anything...'
            /> 
            <Button onClick={handleClick} disabled={isFetching} className='m-3'>
              {isFetching ? (
                <>
              <Loader2 className='mr-2 h-2 w-4 animate-spin'/> Fetching...
              </>
            ) : (
              <>
            <ArrowUp />
            </>
            ) } </Button>
        </div>
    </div>
  )
}

export default Page