import Image from 'next/image'
import { EditableProTable } from '@ant-design/pro-components';
import axios from 'axios'
import { BASE_URL } from '@/utils';
import { Button, Empty, ConfigProvider } from 'antd';
import { Bg } from '@/public'
import { useState } from 'react';
import CreateSurvey from '@/component/CreateSurvey';
async function getData() {
  const res = await axios.get(`${BASE_URL}/api/survey`)
  return res.data
}
// create a survey with background image and questions
export default async function Home() {
  const data = await getData()
  console.log('data', data.data)
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
        <div className='bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5'>
          <div className='text-center text-white sm:text-3xl text-lg'>Questionnair Creator</div>
          {data.data.length > 0 ? <div>
            yes
          </div> : <div className='w-full h-[calc(100%-28px)] flex justify-center flex-col items-center'>
            <CreateSurvey />
          </div>}
        </div>
      </main>
    </ConfigProvider>
  )
}
