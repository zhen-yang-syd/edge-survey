'use client'
import axios from 'axios'
import { BASE_URL } from '@/utils';
import { Button, Empty, ConfigProvider } from 'antd';
import { Bg } from '@/public'
import { useEffect, useState } from 'react';
import CreateSurvey from '@/component/CreateSurvey';
import useSurveyStore from '@/store/surveyStore';
import { useRouter } from 'next/navigation';
import { Survey } from '@/type';
async function getData() {
  const res = await axios.get(`${BASE_URL}/api/survey`)
  return res.data
}
// create a survey with background image and questions
export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<any>([])
  const { survey, updateSurvey } = useSurveyStore()
  useEffect(() => {
    getData().then((res) => {
      console.log('res', res.data)
      setData(res.data)
      setLoading(false)
    })
  }, [])
  useEffect(() => {
    if (data) {
      updateSurvey(data)
    }
  }, [data])
  console.log(survey)

  return (
    <ConfigProvider
      theme={
        {
          components: {
            Radio: {
              colorPrimary: '#FAD403',
              colorText: 'black',
              lineHeight: 2.3,
            },
            Checkbox: {
              colorPrimary: '#FAD403',
              colorText: 'black',
              lineHeight: 2.3,
              borderRadiusSM: 14
            },
            Input: {
              colorBgContainer: 'rgba(0, 0, 0, 0.04)',
              // colorText: 'white',
              // colorPrimaryHover: '#FAD403',
            },
            Button: {
              // colorBgTextHover: '#FAD403',
              // colorBgTextActive: '#FAD403',
              // colorErrorBorderHover: '#FAD403',
              // colorPrimaryBorder: '#FAD403',
              // colorPrimaryHover: '#FAD403',
            },
          }
        }
      }
    >
      <main className='w-screen h-screen px-5 py-10' style={{ backgroundImage: `url(${Bg.src})` }}>
        <div className='bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5 relative'>
          <div className='text-center text-white sm:text-3xl text-lg mb-20'>Questionnair Creator</div>
          <div className='absolute sm:top-5 sm:right-5 top-[70px] right-[100px]'><CreateSurvey /></div>
          <div className='w-full flex justify-center'>
            {
              loading ? 'loading...' :
                <>
                  {survey && survey.length > 0 ?
                    <div className='w-full h-full flex flex-col gap-8 items-center'>
                      {
                        survey.map((item: Survey, index: number) =>
                        (<div className='shadow-lg rounded-lg px-5 py-3 flex flex-row bg-black text-white bg-opacity-30 gap-10' key={index}>
                          <picture>
                            <img src={item.image.asset.url} alt="" className='w-[50px] h-[50px]' />
                          </picture>
                          {item.qrCode && <picture>
                            <img src={item.qrCode?.asset.url || undefined} alt="" className='w-[50px] h-[50px]' />
                          </picture>}
                          <div className='flex flex-col justify-between text-center'>
                            <div>Title</div>
                            <div>{item.title}</div>
                          </div>
                          <div className='flex flex-col justify-between text-center'>
                            <div>Target</div>
                            <div>{item.target.name}</div>
                          </div>
                          <div className='flex flex-col justify-between text-center'>
                            <div>Questions</div>
                            <div>{item.questions.length}</div>
                          </div>
                          <div className='flex flex-col justify-between text-center'>
                            <div>Created At</div>
                            <div>{item.createdAt.slice(0, 10)}</div>
                          </div>
                          <div className='flex flex-row gap-5 items-center'>
                            <button onClick={() => router.push(`/survey/${item._id}`)}>Detail</button>
                            <button disabled className='cursor-not-allowed'>Edit</button>
                          </div>
                        </div>)
                        )
                      }
                    </div> :
                    <Empty description='' />
                  }
                </>
            }
          </div>
        </div>
      </main>
    </ConfigProvider>
  )
}
