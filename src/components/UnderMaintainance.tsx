import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../assets/transparent-logo.png'

const UnderMaintainance = () => {
  return (
    <div className='w-full h-screen p-[8rem] bg-[url("../assets/maintain-bg.png")] bg-center bg-cover flex flex-col items-center justify-between'>
        <div className='w-full text-left text-white'>
            <h1 className='text-5xl mb-5 leading-tight'>This app is under<br/>maintainance.</h1>
            <p className='text-xl font-light'>Join our <Link className='underline' href={'https://discord.com/invite/f34GS9uheN'}>Discord</Link> or follow us on <Link className='underline' href={'https://twitter.com/carapacefinance'}>Twitter</Link> for updates.</p>
        </div>
        <Image
          src={logo}
          alt=""
          height="120"
          width="500"
          unoptimized
        />
    </div>
  )
}

export default UnderMaintainance