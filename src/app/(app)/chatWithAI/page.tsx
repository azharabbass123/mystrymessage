'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUp } from 'lucide-react'
import React from 'react'

const Page = () => {

    const handleClick = () =>{

    }

    const handleChange = () =>{

    }
  return (
    <div className='relative h-screen'>
        <div>Enter your quries to get instant response</div>
        <div className='sticky bottom-0 flex align-center space-x-3'>
            <Input
                onChange={handleChange}
                placeholder='Ask me anything...'
            /> 
            <Button onClick={handleClick}><ArrowUp /> </Button>
        </div>
    </div>
  )
}

export default Page