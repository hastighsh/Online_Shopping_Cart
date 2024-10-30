import React from 'react'
import { Fugaz_One } from "next/font/google";

const fugaz = Fugaz_One({subsets:["latin"], weight:['400']});

export default function Button(props) {
    const {text, dark, full} = props
  return (
    <button className={' rounded-full overflow-hidden border-2 duration-200 hover:opacity-60 border border-solid border-[#F67280] ' + 
    (dark ? ' text-white bg-[#F8B195] border-[#F67280] ' : ' text-[#F67280] ')
    +(full ? ' grid place-items-center w-full ' : ' ')}>
        <p className={' px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 ' + fugaz.className}>{text}</p>
    </button>
  )
}
