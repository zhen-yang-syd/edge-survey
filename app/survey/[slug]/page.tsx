'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BASE_URL } from '@/utils'
import useSurveyStore from '@/store/surveyStore'
import { Survey } from '@/type'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { Button, Spin, Form, Input, Upload, Typography, Card, Space, Radio, Checkbox, ConfigProvider } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import CreateTarget from '@/component/CreateTarget'
import ImgCrop from 'antd-img-crop'
import { CloseOutlined } from '@ant-design/icons'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { client } from '@/utils/client'

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
  }, [params.slug, survey])
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
    console.log(update)
  }
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
  };
  const onFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }
  const [target, setTarget] = useState<string>('')
  const [targetName, setTargetName] = useState<string>('')
  const [fileImageList, setFileImageList] = useState<UploadFile[]>([]);
  const [fileLogoImageList, setFileLogoImageList] = useState<UploadFile[]>([]);
  const [uploadImage, setUploadImage] = useState<any>(null);
  const [uploadLogoImage, setUploadLogoImage] = useState<any>(null);
  useEffect(() => {
    if (uploadImage) {
      form.setFieldsValue({ backgroundImage: uploadImage._id })
    }
  }
    , [uploadImage])
  useEffect(() => {
    if (uploadLogoImage) {
      form.setFieldsValue({ logo: uploadLogoImage._id })
    }
  }
    , [uploadLogoImage])
  const onChange: UploadProps['onChange'] = async (data) => {
    const { fileList: newFileList, file } = data
    setFileImageList(newFileList);
    const uploadedImage = await client.assets.upload('image', file.originFileObj as RcFile);
    setUploadImage(uploadedImage)
  };
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    };
    const image = new Image()
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const onLogoChange: UploadProps['onChange'] = async (data) => {
    const { fileList: newFileList, file } = data
    setFileLogoImageList(newFileList);
    const uploadedImage = await client.assets.upload('image', file.originFileObj as RcFile);
    setUploadLogoImage(uploadedImage)
  };
  const onLogoPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    };
    const image = new Image()
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const dummyLogoRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const [type, setType] = useState<string>()
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
              borderRadiusSM: 14,
            },
            Input: {
              colorBgContainer: 'rgba(0, 0, 0, 0.04)',
              colorText: 'black',
              colorPrimaryHover: '#FAD403',
            },
            Select: {
              colorBgContainer: 'rgba(0, 0, 0, 0.04)',
              colorTextDescription: 'white',
              colorTextPlaceholder: 'white',
              colorText: 'white',
              colorPrimaryHover: '#FAD403',
            },
          }
        }
      }>
      {
        item && !loading ? <div className='text-black w-screen h-screen bg-cover px-5 py-10' style={{ backgroundImage: `url(${item.image.asset.url})` }}>
          <div className='text-white bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5 relative max-w-[800px] mx-auto overflow-y-auto'>
            <BiLeftArrowAlt className="absolute top-5 sm:top-4 left-5 text-2xl sm:text-3xl cursor-pointer hover:text-blue-400 transition-all ease-in-out duration-150" onClick={() => router.push('/')} />
            <h1 className='text-center font-bold'>{item.title} <span className='text-gray-300 font-normal'>{item.createdAt.slice(0, 10)}</span></h1>
            <div className='flex flex-col gap-5 w-full justify-center items-center mt-10'>
              {item.qrCode && <img src={item.qrCode} alt="" className='w-[200px]' />}
              <Button onClick={() => generateQRCode()} className='text-white w-[153px] flex justify-center items-center' disabled={buttonLoading}>{buttonLoading ? <Spin indicator={antIcon} /> : 'Generate QR Code'}</Button>
            </div>
            {/* question section map and enable to delete and edit */}
            <Form
              form={form}
              name="dynamic_form_complex"
              autoComplete="off"
              onFinish={onFinish}
              onFinishFailed={onFailed}
            >
              <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                <Input className='text-white' />
              </Form.Item>
              <Form.Item label="Target" name="target" rules={[{ required: true }]}>
                <CreateTarget setTarget={setTarget} setTargetName={setTargetName} />
              </Form.Item>
              <Form.Item label="Background Image" name='backgroundImage' rules={[{ required: true }]}>
                <ImgCrop>
                  <Upload
                    listType="picture-card"
                    fileList={fileImageList}
                    onChange={onChange}
                    onPreview={onPreview}
                    maxCount={1}
                    className="w-full h-full"
                    customRequest={dummyRequest}
                  >
                    {fileImageList.length < 1 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Form.Item>
              <Form.Item label="Logo" name='logo' rules={[{ required: true }]}>
                <ImgCrop>
                  <Upload
                    listType="picture-card"
                    fileList={fileLogoImageList}
                    onChange={onLogoChange}
                    onPreview={onLogoPreview}
                    maxCount={1}
                    className="w-full h-full"
                    customRequest={dummyLogoRequest}
                  >
                    {fileLogoImageList.length < 1 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Form.Item>
              <Form.List name="questions" initialValue={
                item.questions.map((question) => {
                  return {
                    question: question.title,
                    required: question.required,
                    type: question.type,
                    option: question.options
                  }
                })
              }>
                {(fields, { add, remove }) => (
                  <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                    {fields.map((field) => (
                      <Card
                        size="small"
                        title={`Question ${field.name + 1}`}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        }
                      >
                        <Form.Item label="Question" name={[field.name, 'question']}>
                          <Input className='text-black' />
                        </Form.Item>
                        <Form.Item label="Required" name={[field.name, 'required']} valuePropName="checked">
                          <Checkbox>Mandatory Question</Checkbox>
                        </Form.Item>
                        <Form.Item label="Answer Type" name={[field.name, 'type']}>
                          <Radio.Group onChange={(e) => setType(e.target.value)}>
                            <Radio value="text">Text</Radio>
                            <Radio value="multipleChoice">Multiple Choice</Radio>
                            <Radio value="singleChoice">Single Choice</Radio>
                          </Radio.Group>
                        </Form.Item>
                        {type !== 'text' ?
                          <Form.Item label="Options">
                            <Form.List name={[field.name, 'option']}>
                              {(subFields, subOpt) => (
                                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                  {subFields.map((subField) => (
                                    <Space key={subField.key}>
                                      <Form.Item noStyle name={[subField.name]}>
                                        <Input placeholder="option" className='text-black' />
                                      </Form.Item>
                                      {/* <Checkbox onChange={() => form.setFieldValue("a", "b")} /> */}
                                      <CloseOutlined
                                        onClick={() => {
                                          subOpt.remove(subField.name);
                                        }}
                                      />
                                    </Space>
                                  ))}
                                  <Button type="dashed" onClick={() => subOpt.add()} block>
                                    + Add Sub Item
                                  </Button>
                                </div>
                              )}
                            </Form.List>
                          </Form.Item>
                          : null
                        }
                      </Card>
                    ))}

                    <Button type="dashed" onClick={() => add()} block>
                      + Add Item
                    </Button>
                  </div>
                )}
              </Form.List>
              <div className='h-10 block w-full text-[#000000000]'>1</div>
              <div className='w-full flex flex-row justify-center gap-5'>
                <Button htmlType="submit" disabled={loading} style={{ width: '80px' }}>
                  {loading ? <Spin indicator={antIcon} /> : 'Submit'}
                </Button>
              </div>
              <Form.Item noStyle shouldUpdate>
                {() => (
                  <Typography>
                    <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                  </Typography>
                )}
              </Form.Item>
            </Form>
          </div>
        </div> : 'loading...'
      }
    </ConfigProvider>
  )
}