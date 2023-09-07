'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BASE_URL, sendVerificationCode } from '@/utils'
import useSurveyStore from '@/store/surveyStore'
import { Survey } from '@/type'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { Form, Input, Button, Spin, message, ConfigProvider, Checkbox, Radio } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />;
const antIcon1 = <LoadingOutlined style={{ fontSize: 12 }} spin rev={undefined} />;

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { survey, updateSurvey } = useSurveyStore()
  const [item, setItem] = useState<Survey>()
  useEffect(() => {
    // find the survey by slug from survey
    const result = survey.find((item: Survey) => item._id === params.slug)
    setItem(result)
  }, [params.slug])
  const onFinish = (values: any) => {
    console.log(values)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo)
  }
  const [form] = Form.useForm();
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState('');
  const [usernameFormat, setUsernameFormat] = useState<boolean | null>(null)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const [sendLoading, setSendLoading] = useState<boolean>(false)
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(60)
  const [verificationCode, setVerificationCode] = useState<string>('')
  const handleSendVerficationCode = async () => {
    setSendLoading(true)
    setButtonLoading(true)
    const data = await sendVerificationCode(setVerificationCode, username, 'phone')
    if (data.data.send) {
      message.success(data.message)
      setSendLoading(false)
      // loading, disabled the button for 60s
      let c = count;
      const interval = setInterval(() => {
        c--;
        setCount(c)
        if (c === 0) {
          clearInterval(interval);
          setButtonLoading(false)
          setCount(60)
        }
      }
        , 1000);
    }
  }
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
      }>
      {
        item && !loading ? <div className='w-screen h-screen bg-cover px-5 py-10' style={{ backgroundImage: `url(${item.image.asset.url})` }}>
          <div className='text-white bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg w-full h-full overflow-auto p-5 relative max-w-[800px] mx-auto'>
            <BiLeftArrowAlt className="absolute top-5 sm:top-4 left-5 text-2xl sm:text-3xl cursor-pointer hover:text-blue-400 transition-all ease-in-out duration-150" onClick={() => router.push('/')} />
            <h1 className='text-center font-bold'>{item.title} {item.createdAt.slice(0, 10)} <span className='text-gray-300 font-normal'>{` `} Preview</span></h1>
            <Form
              name="landing_signup"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              form={form}
              className="text-white"
            >
              {/* logo section */}
              <div className='mb-5 w-full'>
                <img src={item.logo.asset.url} alt="" className='sm:h-[100px] h-[40px] z-10 drop-shadow-xl mx-auto' />
              </div>
              {/* Full name */}
              <div className='ml-2'>
                <div className='flex flex-col gap-2 mb-2'>
                  <div className='shadow-text'>
                    <span>Full Name</span>
                  </div>
                  <Form.Item name="name" className='my-0' rules={[{ required: true, message: 'Please input name!' }]}>
                    <Input
                      size='middle'
                      onChange={
                        (e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value) }
                      }
                      value={name}
                    />
                  </Form.Item>
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                  <div className='shadow-text'>
                    <span>Email</span>
                  </div>
                  <Form.Item
                    name="email"
                    required
                    rules={[
                      { required: true, message: 'Please input email!' },
                      {
                        validator(rule, value, callback) {
                          if (value) {
                            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                            if (emailRegex.test(value)) {
                              callback();
                              // setEmailFormat(true);
                            }
                            else {
                              // setEmailFormat(false)
                              callback('Please input a valid email format!');
                            }
                          } else {
                            // setEmailFormat(null)
                            callback();
                          }
                        }
                      }
                    ]}
                    className='my-0'
                  >
                    <Input
                      size='middle'
                      // onChange={
                      //   (e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }
                      // }
                      value={username}
                    />
                  </Form.Item>
                </div>
              </div>
              {/* Phone */}
              <div className='ml-2 flex flex-col gap-2'>
                <div className='shadow-text'>
                  <span>Phone</span>
                </div>
                <div className='relative mb-4'>
                  <Form.Item
                    name="username"
                    required
                    rules={[
                      { required: true, message: 'Please input phone!' },
                      {
                        validator(rule, value, callback) {
                          if (value) {
                            const phoneRegex = /^[0-9]{9,10}$/;
                            if (phoneRegex.test(value)) {
                              callback();
                              setUsernameFormat(true);
                            }
                            else {
                              setUsernameFormat(false)
                              callback('Please input a valid phone format!');
                            }
                          } else {
                            setUsernameFormat(null)
                            callback();
                          }
                        }
                      }
                    ]}
                    className='my-0'
                  >
                    <Input
                      size='middle'
                      onChange={
                        (e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value) }
                      }
                      value={username}
                    />
                  </Form.Item>
                  {username && isUsernameAvailable !== null && isUsernameAvailable === false && <div className='absolute top-[35px] text-red-500'>Phone has been registered</div>}
                  {username && isUsernameAvailable !== null && isUsernameAvailable === true && <div className='absolute top-[35px] text-green-500'>Phone is available</div>}
                </div>
              </div>
              {/* verification code */}
              <div className='ml-2 flex flex-col gap-2'>
                <div className='shadow-text'>Verification Code</div>
                <Form.Item
                  name="verificationCode"
                  rules={[{ required: true, message: 'Please input verfication code!' }]}
                  className=""
                >
                  <Input
                    addonAfter={
                      <button
                        disabled={buttonLoading}
                        className='w-[100px]'
                        onClick={isUsernameAvailable === true ?
                          (e) => { e.preventDefault(); handleSendVerficationCode() }
                          :
                          (e) => { e.preventDefault(); message.warning('Please provide an available phone!') }}
                      >
                        {sendLoading ? <Spin indicator={antIcon1} /> :
                          (buttonLoading ? `${count} s` : 'CODE')}
                      </button>
                    }
                    size='middle'
                  // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputVerificationCode(e.target.value)}
                  />
                </Form.Item>
              </div>
              {/* map all the questions */}
              <>
                {
                  item.questions.map((question, index) => {
                    return (
                      <div className='ml-2' key={index}>
                        <div className='shadow-text uppercase'>
                          <span>{question.title}</span>
                        </div>
                        <Form.Item name={`${question.title}`} rules={[{ required: question.required === true ? true : false, message: question.type === 'text' ? 'Please input!' : 'Please select!' }]}>
                          {
                            question.type === 'text' ? <Input /> : 
                            question.type === 'multipleChoice' ? <Radio.Group>
                              {question?.options?.map((option, index) => (
                                <Radio key={index} value={option} className='text-white'>
                                  {option}
                                  <>{option === 'other' ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}</>
                                </Radio>
                              ))}
                            </Radio.Group> :
                            <Checkbox.Group>
                              {question?.options?.map((option, index) => (
                                <Checkbox key={index} value={option} className='text-white'>
                                  {option}
                                  <>{option === 'other' ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}</>
                                </Checkbox>
                              ))}
                            </Checkbox.Group>
                          }
                          {/* <Radio.Group onChange={onChangeMajor} value={selectedMajor}>
                            {major.map((item, index) => (
                              <Radio key={index} value={item.value} className='text-white'>
                                {item.title}
                                <>{selectedMajor === 'other' && item.value === 'other' ? <Input style={{ width: 100, marginLeft: 10 }} onChange={(e) => setInputMajor(e.target.value)} /> : null}</>
                              </Radio>
                            ))}
                          </Radio.Group> */}
                        </Form.Item>
                      </div>
                    )
                  })
                }
              </>
              {/* <div className='ml-2'>
              <div className='shadow-text'>
                <span>Major:</span>
              </div>
              <Form.Item name='major' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                <Radio.Group onChange={onChangeMajor} value={selectedMajor}>
                  {major.map((item, index) => (
                    <Radio key={index} value={item.value} className='text-white'>
                      {item.title}
                      <>{selectedMajor === 'other' && item.value === 'other' ? <Input style={{ width: 100, marginLeft: 10 }} onChange={(e) => setInputMajor(e.target.value)} /> : null}</>
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </div>
            <div className='ml-2'>
              <div className='shadow-text'>
                <span>Do you have investment experience?</span>
              </div>
              <Form.Item name='experience' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                <Radio.Group onChange={onChangeHaveExperience} value={haveExperience}>
                  <Radio value={true} className='text-white'>
                    Yes
                  </Radio>
                  <Radio value={false} className='text-white'>
                    No
                  </Radio>
                  {haveExperience ? (
                    <Form.Item name='experienceDetail' required className='' rules={[{ required: true, message: 'Please input!' }]}>
                      <Radio.Group onChange={onChangeExperience} value={selectedExperience}>
                        {experience.map((item, index) => (
                          <Radio key={index} value={item.value} className='text-white'>
                            {item.title}<>{selectedExperience === 'other' && item.value === 'other' ? <Input style={{ width: 100, marginLeft: 10 }} onChange={(e) => setInputExperience(e.target.value)} /> : null}</>
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  ) : null}
                </Radio.Group>
              </Form.Item>
            </div>
            <div className='ml-2'>
              <div className='shadow-text'>
                <span>Which types of offline activities would you like to participate in?</span>
              </div>
              <Form.Item name='activities' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                <Checkbox.Group options={preferActivities} onChange={onChangeActivities} className='text-white' />
              </Form.Item>
            </div> */}
              <Form.Item className='flex justify-center'>
                <Button
                  htmlType="submit"
                  disabled={loading}
                  className=' text-white w-[200px] h-[40px] rounded-[20px] hover:text-[#FFB800] hover:bg-[#00000000]'
                >
                  {!loading ? 'Submit' : <Spin indicator={antIcon} />}
                </Button>
              </Form.Item>

            </Form>
          </div>
        </div> : 'loading...'
      }
    </ConfigProvider>
  )
}