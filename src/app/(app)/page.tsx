'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem, 
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"
const Home = () => {
  return (
    <>
    <main className='flex-grow flex flex-col items-center
    justify-center px-4 md:px-24 py-12'>
        <section className="text-center mb-8 md:mb-12">
            <h1 className='text-3xl md:text-5xl font-bold'>Dive
                 into World of Anynomus Conversation</h1>
            <p className='mt-3 md:mt-3 text-base text-center
                md:text-lg'>Explore Mystry Message - Where your identity 
                ramains a secre.
            </p>
        </section>
        <Carousel
          plugins={[Autoplay({delay: 2000})]}
          className="w-full max-w-xs">
          <CarouselContent>
            {
              messages.map((message, index) =>(
                <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-2">
                      <span className="text-lg font-semibold">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6">
    &copy; 2023 Mystry Message. All rights reserved.
    </footer>
    </>
  )
}

export default Home