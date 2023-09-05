'use client'
import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button } from 'antd';
import type { InputRef } from 'antd';
import axios from 'axios';
import { BASE_URL } from '@/utils';

let index = 0;
interface Props {
    setTarget: (value: string) => void
}
async function getData() {
    const res = await axios.get(`${BASE_URL}/api/target`)
    return res.data
  }

const CreateTarget: React.FC<Props> = ({ setTarget }) => {
    const [items, setItems] = useState(['jack', 'lucy']);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    useEffect(() => {
        setTarget(name)
        console.log('name', name)
    }, [name])

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <Select
            style={{ width: 300 }}
            placeholder="custom dropdown render"
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                            placeholder="Please enter item"
                            ref={inputRef}
                            value={name}
                            onChange={onNameChange}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                            Add item
                        </Button>
                    </Space>
                </>
            )}
            options={items.map((item) => ({ label: item, value: item }))}
            onChange={(value) => {
                console.log(value);
                setTarget(value);
            }}
        />
    );
};

export default CreateTarget;