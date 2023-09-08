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
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd';
import Cookie from 'js-cookie';

async function getData() {
  const res = await axios.get(`${BASE_URL}/api/survey`)
  return res.data
}
const antIcon = <LoadingOutlined style={{ fontSize: 70 }} spin rev={undefined} />;
// create a survey with background image and questions
export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const { survey, updateSurvey } = useSurveyStore()
  useEffect(() => {
    const result = Cookie.get('getSurvey')
    console.log('result', result)
    if (!result) {
      getData().then((res) => {
        console.log('res', res.data)
        // expires 10 mins
        Cookie.set('getSurvey', 'true', { expires: 1 })
        updateSurvey(res.data)
        setLoading(false)
      })
    }
    else {
      setLoading(false)
    }
  }, [])
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
              colorText: 'white',
              colorPrimaryHover: '#FAD403',
            },
          }
        }
      }
    >
      <main className='w-screen h-screen px-5 py-10 bg-cover' style={{ backgroundImage: `url(${Bg.src})` }}>
        <div className='bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5 relative'>
          <div className='text-center text-white sm:text-3xl text-lg mb-20'>Questionnair Creator</div>
          <div className='absolute sm:top-5 sm:right-5 top-[70px] right-[100px]'><CreateSurvey /></div>
          <div className='w-full flex justify-center'>
            {
              loading ? <Spin indicator={antIcon} /> :
                <>
                  {survey && survey.length > 0 ?
                    <div className='w-full h-full flex flex-col gap-8 items-center'>
                      {
                        survey.map((item: Survey, index: number) =>
                        (<div className='shadow-lg rounded-lg px-2 sm:px-5 py-3 flex flex-col sm:flex-row bg-black text-white bg-opacity-30 gap-2 sm:gap-10 cursor-pointer hover:shadow-2xl sm:hover:scale-[120%] transition-all duration-150 ease-in-out' key={index} >

                          {item.qrCode ? <picture>
                            <img src={item.qrCode || undefined} alt="" className='sm:w-[50px] sm:h-[50px] min-w-[40px] min-h-[40px]' />
                          </picture> :
                            <picture>
                              <img src={item.logo?.asset.url || item.image.asset.url} alt="" className='sm:w-[50px] sm:h-[50px] min-w-[40px] min-h-[40px]' />
                            </picture>}
                          <div className='flex flex-col justify-start sm:justify-between text-center'>
                            <div className='font-semibold text-xs sm:text-base'>Title</div>
                            <div className='text-gray-300 text-xs sm:text-sm'>{item.title}</div>
                          </div>
                          <div className='flex flex-col justify-start sm:justify-between text-center'>
                            <div className='font-semibold text-xs sm:text-base'>Target</div>
                            <div className='text-gray-300 text-xs sm:text-sm'>{item.target.name}</div>
                          </div>
                          <div className='flex flex-col justify-start sm:justify-between text-center'>
                            <div className='font-semibold text-xs sm:text-base'>Questions</div>
                            <div className='text-gray-300 text-xs sm:text-sm'>{item.questions.length}</div>
                          </div>
                          <div className='flex flex-col justify-start sm:justify-between text-center'>
                            <div className='font-semibold text-xs sm:text-base'>Created</div>
                            <div className='text-gray-300 text-xs sm:text-sm'>{item.createdAt.slice(0, 10)}</div>
                          </div>
                          <div className='flex flex-row gap-10 sm:gap-5 items-center justify-center'>
                            <Button className="text-white flex justify-center items-center text-sm hover:text-blue-300 transition-all duration-150 ease-in-out" onClick={() => router.push(`/detail/${item._id}`)}>Preview</Button>
                            <Button className="text-white flex justify-center items-center text-sm hover:text-blue-300 transition-all duration-150 ease-in-out" onClick={() => router.push(`/survey/${item._id}`)}>Edit</Button>
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
