'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BASE_URL } from '@/utils'
import useSurveyStore from '@/store/surveyStore'
import { Survey } from '@/type'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { Button, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />;

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)
  const { survey, updateSurvey } = useSurveyStore()
  const [item, setItem] = useState<Survey>()
  useEffect(() => {
    // find the survey by slug from survey
    const result = survey.find((item: Survey) => item._id === params.slug)
    console.log(result)
    setItem(result)
    setLoading(false)
  }, [params.slug])
  const generateQRCode = async () => {
    setButtonLoading(true)
    const { data } = await axios.post(`${BASE_URL}/api/qrcode`, { surveyId: params.slug, imageUrl: item?.image.asset.url })
    // update the survey with qrcode in survey store
    const result = survey.map((item: Survey) => {
      if (item._id === params.slug) {
        return {
          ...item, qrCode: {
            asset: {
              url: data.data.png
            }
          }
        }
      }
      return item
    })
    updateSurvey(result)
    setButtonLoading(false)
    // update the survey with qrcode in database

  }
  return (
    <>
      {
        item && !loading ? <div className='w-screen h-screen bg-cover px-5 py-10' style={{ backgroundImage: `url(${item.image.asset.url})` }}>
          <div className='text-white bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5 relative max-w-[800px] mx-auto overflow-y-auto'>
            <BiLeftArrowAlt className="absolute top-5 sm:top-4 left-5 text-2xl sm:text-3xl cursor-pointer hover:text-blue-400 transition-all ease-in-out duration-150" onClick={() => router.push('/')} />
            <h1 className='text-center font-bold'>{item.title} <span className='text-gray-300 font-normal'>{item.createdAt.slice(0, 10)}</span></h1>
            <div className='flex flex-col gap-5 w-full justify-center items-center mt-10'>
              {item.qrCode && <img src={item.qrCode.asset.url} alt="" className='w-[200px]' />}
              <Button onClick={() => generateQRCode()} className='text-white w-[153px] flex justify-center items-center' disabled={buttonLoading}>{buttonLoading ? <Spin indicator={antIcon} /> : 'Generate QR Code'}</Button>
            </div>
          </div>
        </div> : 'loading...'
      }
    </>
  )
}