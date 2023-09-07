'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BASE_URL } from '@/utils'
import useSurveyStore from '@/store/surveyStore'
import { Survey } from '@/type'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { Button } from 'antd'

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { survey, updateSurvey } = useSurveyStore()
  const [item, setItem] = useState<Survey>()
  useEffect(() => {
    // find the survey by slug from survey
    const result = survey.find((item: Survey) => item._id === params.slug)
    console.log(result)
    setItem(result)
  }, [params.slug])
  const generateQRCode = async () => {
    // const { data } = await axios.post(`${BASE_URL}/api/qrcode`, { surveyId: params.slug, imageUrl: item?.image.asset.url })
    // console.log(data)
    const data1 ={
      "apikey": "V69JS1WY08vEXK5eUmir",
      "data": "https://www.edgecademy.org",
      "transparent": "off",
      "backcolor": "#033895",
      "frontcolor": "#ffffff",
      "marker_out_color": "#669df4",
      "marker_in_color": "#669df4",
      "pattern": "oriental",
      "marker": "flower",
      "marker_in": "circle",
      "optionlogo": "https://cdn.sanity.io/images/er52rfe6/production/2d919dd0e2bf59d69e48ec04e15657bad6fff3c3-1280x1706.jpg"
  }
    const data = await axios.post('https://api.qr.io/v1/create', JSON.stringify(data1))
    console.log(data)
  }
  return (
    <>
      {
        item && !loading ? <div className='w-screen h-screen bg-cover px-5 py-10' style={{ backgroundImage: `url(${item.image.asset.url})` }}>
          <div className='text-white bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5 relative max-w-[800px] mx-auto overflow-y-auto'>
            <BiLeftArrowAlt className="absolute top-5 sm:top-4 left-5 text-2xl sm:text-3xl cursor-pointer hover:text-blue-400 transition-all ease-in-out duration-150" onClick={() => router.push('/')} />
            <h1 className='text-center font-bold'>{item.title} <span className='text-gray-300 font-normal'>{item.createdAt.slice(0, 10)}</span></h1>
            <div className='flex flex-row gap-5 w-full'>
              <Button onClick={() => generateQRCode()} className='text-white'>Generate QR Code</Button>
            </div>
          </div>
        </div> : 'loading...'
      }
    </>
  )
}