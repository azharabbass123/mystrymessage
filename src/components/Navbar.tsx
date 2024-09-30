"use client"

import React from 'react'
import Link from 'next/link'
import {useSession, signOut} from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {

  const {data: session} = useSession()
  const user = session?.user as User
  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-col
      md:flex-row justify-between items-center'>
        <a className='text-xl font-bold mb-4 mb:mb-0' href="/">Mystry Message</a>
        {session ? (
          <>
          <h2 className='mr-4 font-bold'>{user?.username || user?.email}</h2>
          <div>
          <Link href='/chatWithAI' className='m-2 p-2 border-2 border-slate-300 rounded-lg
           hover:bg-black hover:text-white transition-colors duration-300'>Chat With AI</Link>
          <Link href='/dashboard' className='mx-2 p-2 border-2 border-slate-300 rounded-lg
           hover:bg-black hover:text-white transition-colors duration-300'>Go To Dashboard</Link>
          <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
          </div>
          </>
        ) : (
          <Link href="/sign-in">
            <Link href='/chatWithAI' className='m-2 p-2 border-2 border-slate-300 rounded-lg
           hover:bg-black hover:text-white transition-colors duration-300'>Chat With AI</Link>
            <Button className='w-full md:w-auto'>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar