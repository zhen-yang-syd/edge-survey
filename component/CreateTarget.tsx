'use client'
import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button, message, Skeleton } from 'antd';
import type { InputRef } from 'antd';
import axios from 'axios';
import { BASE_URL } from '@/utils';

let index = 0;
interface Props {
    setTarget: (value: string) => void,
    setTargetName: (value: string) => void
}

const CreateTarget: React.FC<Props> = ({ setTarget, setTargetName }) => {
    const [items, setItems] = useState<any>([]);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);
    const [diabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState<boolean>(false)

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    // useEffect(() => {
    //     setTarget(name)
    //     console.log('name', name)
    // }, [name])

    const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setLoading(true)
        setName('');
        // create a new item
        const data = await axios.post(`${BASE_URL}/api/target`, { name })
        if (data) {
            message.success('Create target successfully')
            setItems([...items, { value: data.data.data._id, label: data.data.data.name }]);
            setTarget(data.data.data._id)
            setTargetName(data.data.data.name)
            setLoading(false)
        }
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    useEffect(() => {
        const getData = async () => {
            const res = await axios.get(`${BASE_URL}/api/target`)
            console.log('res', res.data.data)
            const data = res.data.data.map((item: any) => ({ value: item._id, label: item.name }))
            setItems(data)
        }
        getData()
    }, [])
    useEffect(() => {
        if (name) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [name])

    return (
        <Select
            placeholder="Select target"
            dropdownRender={(menu) => (
                <>
                    {loading && items ? <Skeleton loading className='p-3' active/> : <>{menu}</>}
                    <Divider style={{ margin: '8px 0' }} />
                    {loading && items ? <Skeleton loading className='p-3' active/> : (
                        <Space style={{ padding: '0 8px 4px' }}>
                            <Input
                                placeholder="Please enter item"
                                ref={inputRef}
                                value={name}
                                onChange={onNameChange}
                                className='text-black'
                            />
                            <Button type="text" icon={<PlusOutlined />} onClick={addItem} disabled={diabled}>
                                Add target
                            </Button>
                        </Space>
                    )}
                </>
            )}
            options={items.map((item: any) => ({ label: item.label, value: item.value }))}
            // onChange={(option,value) => {
            //     console.log('option', option)
            //     setTarget(option.value);
            //     setTargetName(option.label)
            // }}
            onSelect={(value, option) => {
                // console.log('option', option.value)
                setTarget(option.value || value);
                setTargetName(option.label || value)
            }}
        />
    );
};

export default CreateTarget; 