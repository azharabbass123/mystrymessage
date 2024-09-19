'use client'

import { useToast } from "@/hooks/use-toast"
import { Message, User } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessage"
import { ApiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { FlaskConical } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId: string) =>{
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () =>{
    setSwitchLoading(true)
    try{
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch(error){
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ||
        "Failed to fetch message settings",
        variant: "destructive"
      })
    } finally {
      setSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback( async(refresh: boolean = false) =>{
    setIsLoading(true)
    setSwitchLoading(false)
    try{
      const response = await axios.get<ApiResponse>('/api/get-message')
      setMessages(response.data.messages || [])
      if(refresh){
        toast({
          title: "Refreshed",
          description: "Showing latest messages"
        })
      }
    } catch (error){
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ||
        "Failed to fetch message settings",
        variant: "destructive"
      })
    } finally{
      setIsLoading(false)
      setSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() =>{
    if(!session || !session.user) return 
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])
  const handleSwitchChange = async () =>{
    try{
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessage', !acceptMessages)
      toast({
        title: response.data.message,
        variant: 'default'
      })

    } catch (error){
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ||
        "Failed to fetch message settings",
        variant: "destructive"
      })
    }
  }

  const {username} = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () =>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL copied to clipboard",
      description: "Profile url copied to clipborad"
    })
  }

  if(!session || !session.user){
    return <div>Please login</div>
  } 
  return (
    <div>dashboard</div>
  )
}

export default page