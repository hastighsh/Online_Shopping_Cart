import React from 'react'
import { Fugaz_One} from "next/font/google";
import Button from './Button';
import Link from 'next/link'


const fugaz = Fugaz_One({subsets:["latin"], weight:['400']});


export default function Hero() {
  return (
    <div className='py-4 md:py-10 flex flex-col gap-4 sm:gap-8'>
        <h1 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}><span className='textGradient'>REA</span> lets you buy <span className='textGradient'>handmade</span> clothes!</h1>
        <p className='text-lg sm:text md:text-2xl text-center 
        w-full mx-auto max-w-[600]'>Login now or proceed as a guest to view our catalogue!</p>
        <div className='grid grid-cols-3 gap-2 w-fit mx-auto'>
            <Link href="/signup"> <Button text='Sign up' dark/> </Link>
            <Link href="/login"><Button text='Login' dark/> </Link>
            <Link href="/catalog"><Button text='Guest'/> </Link>
        </div>
    </div>
  )
}
