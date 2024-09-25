'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'
import { ArrowUp, Loader2 } from 'lucide-react'
import React, { ChangeEvent, useState } from 'react'

const Page = () => {
    const [chatQuery, setChatQuery] = useState("");
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
        let chatCopy = chatQuery
        console.log(chatCopy)
        var response = await axios.post('/api/open-chat', {
          prompt: chatCopy
        })
      const cleanText = response.data
      // .replace(/0:"/g, '')  // Remove '0:"'
      // .replace(/"/g, '')     // Remove trailing '"'
      // .replace(/\\n/g, '\n') // Convert escaped \n to actual newlines
      // .split('\n')           // Split by actual newlines
      // .filter((item: string) => item)  // Remove any empty items
      // .map((item: string) => item.trim()) // Trim whitespace from each item
      // .join('\n');           // Join them back into a string with newlines
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
            <div className="m-8 px-8 py-5 bg-white
            rounded-lg shadow-md"><p className='text-center'>{chatResponse}</p></div>
          )}
        
        <div className='mt-2 w-[60%] ml-[20%] bg-slate-200 rounded-lg bg- border-rounded px-5 py-2 fixed bottom-2 flex align-center justify-center space-x-3'>
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