import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem, 
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import message from "@/messages"
const Home = () => {
  return (
    <main className='flex-grow flex flex-col items-center
    justify-center px-4 md:px-24 py-12'>
        <section>
            <h1 className='text-3xl md:text-5xl font-bold'>Dive
                 into World of Anynomus Conversation</h1>
            <p className='mt-3 md:mt-3 text-base text-center
                md:text-lg'>Explore Mystry Message - Where your identtiy 
                ramains a secre.
            </p>
        </section>
    </main>
  )
}

export default Home