'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BASE_URL } from '@/utils'
import useSurveyStore from '@/store/surveyStore'
import { Survey } from '@/type'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { message, Button, Spin, Space, Table, Tag, ConfigProvider } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { LoadingOutlined } from '@ant-design/icons'
import CreateTarget from '@/component/CreateTarget'
import ImgCrop from 'antd-img-crop'
import { CloseOutlined } from '@ant-design/icons'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { client } from '@/utils/client'
import { v4 } from 'uuid'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />;

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)
  const { survey, updateSurvey } = useSurveyStore()
  const [item, setItem] = useState<Survey>()
  interface DataType {
    key: React.Key;
    name: string;
    phone: string;
    email: string;
    date: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
  ];

  const data: DataType[] = [];
  // for (let i = 0; i < 46; i++) {
  //   data.push({
  //     key: i,
  //     name: `Edward King ${i}`,
  //     phone: `12323333${3}`,
  //     email: `London, Park Lane no. ${i}`,
  //     date: '2021-09-09'
  //   });
  // }
  const [result, setResult] = useState<any[]>()
  const [resultList, setResultList] = useState<any[]>()
  useEffect(() => {
    // find the survey by slug from survey
    const result = survey.find((item: Survey) => item._id === params.slug)
    console.log(result)
    setItem(result)
    setLoading(false)
    // fetch result list
    const getSurveyResult = async () => {
      const { data } = await axios.get(`${BASE_URL}/api/survey-result?surveyId=${params.slug}`)
      console.log(data.data)
      setResult(data.data)
    }
    getSurveyResult()
  }, [params.slug, survey])
  useEffect(() => {
    console.log(result)
    if (result) {
      const data = result.map((item: any) => ({
        key: v4(),
        name: item.username,
        phone: item.phone,
        email: item.email,
        date: item.createdAt.slice(0, 10)
      }))
      console.log(data)
      setResultList(data)
    }
  }, [result])
  const generateQRCode = async () => {
    setButtonLoading(true)
    const { data } = await axios.post(`${BASE_URL}/api/qrcode`, { surveyId: params.slug, imageUrl: item?.image.asset.url })
    // update the survey with qrcode in survey store
    const result = survey.map((item: Survey) => {
      if (item._id === params.slug) {
        return {
          ...item, qrCode: data.data.png
        }
      }
      return item
    })
    updateSurvey(result)
    setButtonLoading(false)
    // update the survey with qrcode in database
    const update = await axios.post(`${BASE_URL}/api/qrcode/update`, { surveyId: params.slug, qrCodeUrl: data.data.png })
    if (update) {
      message.success('Generate QR Code successfully')
    }
  }

  return (
    <ConfigProvider
    theme={
      {
        components: {
          Table: {
            colorBgContainer: 'rgba(0, 0, 0, 0.04)',
            colorText: 'white',
          }
        }
      }
    }
    >
      {
        item && !loading ? <div className='text-black w-screen h-screen bg-cover px-5 py-10' style={{ backgroundImage: `url(${item.image.asset.url})` }}>
          <div className='text-white bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5 relative max-w-[800px] mx-auto overflow-y-auto'>
            <BiLeftArrowAlt className="absolute top-5 sm:top-4 left-5 text-2xl sm:text-3xl cursor-pointer hover:text-blue-400 transition-all ease-in-out duration-150" onClick={() => router.push('/')} />
            <h1 className='text-center font-bold'>{item.title} <span className='text-gray-300 font-normal'>{item.createdAt.slice(0, 10)}</span></h1>
            <div className='flex flex-col gap-5 w-full justify-center items-center my-10'>
              {item.qrCode && <img src={item.qrCode} alt="" className='w-[200px]' />}
              <Button onClick={() => generateQRCode()} className='text-white w-[153px] flex justify-center items-center' disabled={buttonLoading}>{buttonLoading ? <Spin indicator={antIcon} /> : 'Generate QR Code'}</Button>
            </div>
            {/* display the result */}
            <Table columns={columns} dataSource={resultList} />
          </div>
        </div> : 'loading...'
      }
    </ConfigProvider>
  )
}