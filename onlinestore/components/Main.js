import React from 'react'

export default function Main(props) { //props meaning properties of component
    const {children} = props
    //this functional component Main will emulate the behaviour of the <main> tags so now I can use <Main> tags in page.js to apply changes to all pages.
    //can write the styling once
  return (
    <main className='flex-1 flex flex-col'>
        {children}
    </main>
  )
}
