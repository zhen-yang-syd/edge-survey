'use client'
import { useEffect, useState } from 'react'
import { Modal, Button, Card, Form, Input, Space, Typography, ConfigProvider, Upload, Checkbox, Radio } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { client } from '@/utils/client';
import CreateTarget from './CreateTarget';
import axios from 'axios';
import { BASE_URL } from '@/utils';

const CreateSurvey = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setFileImageList([]);
    };
    const [form] = Form.useForm();
    const onFinish = (value: object) => {
        console.log(value);
        // create question and survey
        // {
        //     "title": "t1",
        //     "target": "t1",
        //     "backgroundImage": "https://cdn.sanity.io/images/er52rfe6/production/709f5e1ba4c2d3bc027d4af1eba4fae2e03f2a8d-1023x1023.png",
        //     "questions": [
        //       {
        //         "question": "q1",
        //         "required": true,
        //         "type": "text"
        //       },
        //       {
        //         "question": "q2",
        //         "type": "multipleChoice",
        //         "option": [
        //           "o1",
        //           "o2",
        //           "o3"
        //         ]
        //       },
        //       {
        //         "question": "q3",
        //         "required": true,
        //         "type": "singleChoice",
        //         "option": [
        //           "o1",
        //           "o2",
        //           "o3",
        //           "o4"
        //         ]
        //       }
        //     ]
        //   }
        // create each question, map the questions and create promise, then promise.all
        const { title, target, backgroundImage, questions }: any = value
        const createQuestion = async (question: any) => {
            const res = await axios.post(`${BASE_URL}/api/question`, question)
            return res.data
        }
        const createSurvey = async (survey: any) => {
            const res = await axios.post(`${BASE_URL}/api/survey`, survey)
            return res.data
        }
        const create = async () => {
            const questionPromises = questions.map((question: any) => createQuestion(question))
            const questionRes = await Promise.all(questionPromises)
            const questionIds = questionRes.map((res: any) => res.data._id)
            console.log('questionIds', questionIds)    
            const survey = {
                title,
                target,
                backgroundImage,
                questions: questionIds
            }
            // const surveyRes = await createSurvey(survey)
            // console.log('surveyRes', surveyRes)
        }
        create()
        // create survey with question id
    };
    const onFailed = (errorInfo: any) => {
        console.log(errorInfo);
    }
    const [fileImageList, setFileImageList] = useState<UploadFile[]>([]);
    const [uploadImage, setUploadImage] = useState<any>(null);
    useEffect(() => {
        if (uploadImage) {
            form.setFieldsValue({ backgroundImage: uploadImage.url })
        }
    }
        , [uploadImage])
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
    const [target, setTarget] = useState<string>('')
    useEffect(() => {
        if (target) {
            form.setFieldsValue({ target: target })
        }
    }
        , [target])
    const [type, setType] = useState<string>()
    return (
        <>
            <Button onClick={showModal} className='text-white'>Create a New One</Button>
            <Modal title="" closable={false} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
                <Form
                    form={form}
                    name="dynamic_form_complex"
                    autoComplete="off"
                    onFinish={onFinish}
                    onFinishFailed={onFailed}
                >
                    <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Target" name="target" rules={[{ required: true }]}>
                        <CreateTarget setTarget={setTarget} />
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
                    <Form.List name="questions" >
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
                                            <Input />
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
                                                                        <Input placeholder="option" />
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
                    <div className='h-10 block w-full text-white'>1</div>
                        <div className='w-full flex flex-row justify-center gap-5'>
                        <Button htmlType="submit">
                            Submit
                        </Button>
                        <div className='text-white w-20'>1</div>
                        <Button>
                            Cancel
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
            </Modal >
        </>
    )
}

export default CreateSurvey