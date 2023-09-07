'use client'
import React from 'react'
import ConfettiAnimation from '@/component/ConfettiAnimation'

const Success = () => {
    return (
        <div className='text-black font-bold flex justify-center items-center h-screen shadow-text text-2xl'>
            <span>Submit Successfully!</span>
            <ConfettiAnimation />
        </div>
    )
}

export default Success