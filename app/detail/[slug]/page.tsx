'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BASE_URL } from '@/utils'
import useSurveyStore from '@/store/surveyStore'
import { Survey } from '@/type'
import { BiLeftArrowAlt } from 'react-icons/bi'

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { survey, updateSurvey } = useSurveyStore()
  const [item, setItem] = useState<Survey>()
  useEffect(() => {
    // find the survey by slug from survey
    const result = survey.find((item: Survey) => item._id === params.slug)
    setItem(result)
  }, [params.slug])
  // return <div>Edit Page : {params.slug}</div>
  return (
    <>
      {
        item && !loading ? <div className='w-screen h-screen bg-cover px-5 py-10' style={{ backgroundImage: `url(${item.image.asset.url})` }}>
          <div className='text-white bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5 relative max-w-[800px] mx-auto'>
            <BiLeftArrowAlt className="absolute top-5 sm:top-4 left-5 text-2xl sm:text-3xl cursor-pointer hover:text-blue-400 transition-all ease-in-out duration-150" onClick={()=>router.push('/')}/>
            <h1 className='text-center font-bold'>{item.title} {item.createdAt.slice(0, 10)} <span className='text-gray-300 font-normal'>{` `} Preview</span></h1>
          </div>
        </div> : 'loading...'
      }
    </>
  )
}