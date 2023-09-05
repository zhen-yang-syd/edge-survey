'use client'
import { useEffect, useState } from 'react'
import { Modal, Button, Card, Form, Input, Space, Typography, ConfigProvider, Upload } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { client } from '@/utils/client';
import CreateTarget from './CreateTarget';

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
    };
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
    return (
        <>
            <Button onClick={showModal} className='text-white'>Create a New One</Button>
            <Modal title="" closable={false} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    form={form}
                    name="dynamic_form_complex"
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Form.Item label="Title" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Target" name="target">
                        <CreateTarget setTarget={setTarget} />
                    </Form.Item>
                    <Form.Item label="Background Image" name='backgroundImage'>
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
                    <Form.List name="questions">
                        {(fields, { add, remove }) => (
                            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                                {fields.map((field) => (
                                    <Card
                                        size="small"
                                        title={`Item ${field.name + 1}`}
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
                                        {/* Nest Form.List */}
                                        <Form.Item label="Options">
                                            <Form.List name={[field.name, 'option']}>
                                                {(subFields, subOpt) => (
                                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                        {subFields.map((subField) => (
                                                            <Space key={subField.key}>
                                                                <Form.Item noStyle name={[subField.name]}>
                                                                    <Input placeholder="option" />
                                                                </Form.Item>
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
                                    </Card>
                                ))}

                                <Button type="dashed" onClick={() => add()} block>
                                    + Add Item
                                </Button>
                            </div>
                        )}
                    </Form.List>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button>
                        Cancel
                    </Button>
                    <Form.Item noStyle shouldUpdate>
                        {() => (
                            <Typography>
                                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                            </Typography>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CreateSurvey