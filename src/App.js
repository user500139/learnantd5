import React, {useState, useEffect} from 'react';
import {Button, Form, Input, Table, Space, message, Modal} from 'antd';
import axios from 'axios';

/**
 * todo list
 * 1.性别映射为Tag
 * 2.删除按钮style 已经二次确认
 * 3.接口调用失败提示
 * 4.性别编辑改为下拉选择器
 * 5.编辑框增加必选功能
 * 6.解决一个动作后 页面不刷新的问题
 */

function SearchBar({param, setParam, setPersons, addOrUpdate}) {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const search = () => {
        axios.post("http://localhost:8080/person/query", param).then(response => {
            setPersons(JSON.parse(response.data.data))
        })
    };
    const [addPerson, setAddPerson] = useState({
        name: null,
        age: null,
        sex: null,
        introduce: ""
    });

    useEffect(() => {
        // 组件挂载后执行的操作
        console.log('Component mounted');
        search();

        // 如果有需要清理的操作，可以在返回的函数中进行清理
        return () => {
            console.log('Component unmounted');
        };
    }, []);

    return (
        <Form form={form} layout={'inline'} style={{
            maxWidth: 'none',
        }}>
            <Form.Item label="name">
                <Input
                    type="text"
                    value={param.name} placeholder="search with name"
                    onChange={(e) => setParam({ ...param, name: e.target.value })}
                />
            </Form.Item>
            <Form.Item label="sex">
                <Input
                    type="text"
                    value={param.sex} placeholder="search with sex"
                    onChange={(e) => setParam({ ...param, sex: e.target.value })}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={() => search(param.name, param.sex)}>
                    Search
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Add
                </Button>
            </Form.Item>
            <Modal title="添加人员" open={isModalOpen} onOk={() => {
                addOrUpdate(addPerson);
                setIsModalOpen(false);
            }} onCancel={() => setIsModalOpen(false)}>
                <Form.Item label="姓名" >
                    <Input type="text"
                           value={addPerson.name} placeholder="edit name"
                           onChange={(e) => setAddPerson({ ...addPerson, name: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="年龄" >
                    <Input type="text"
                           value={addPerson.age} placeholder="edit age"
                           onChange={(e) => setAddPerson({ ...addPerson, age: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="性别" >
                    <Input type="text"
                           value={addPerson.sex} placeholder="edit sex"
                           onChange={(e) => setAddPerson({ ...addPerson, sex: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="简介" >
                    <Input type="text"
                           value={addPerson.introduce} placeholder="edit introduce"
                           onChange={(e) => setAddPerson({ ...addPerson, introduce: e.target.value })}
                    />
                </Form.Item>
            </Modal>
        </Form>
    );
}

function PersonTable({persons, success, error, contextHolder, addOrUpdate}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editPerson, setEditPerson] = useState({
        id:null,
        name: null,
        age: null,
        sex: null,
        introduce: ""
    });
    const remove = (id) => {
        const param = {
            id: id
        }
        axios.post("http://localhost:8080/person/delete", param).then(response => {
            success(response.data.msg)
        })
    };

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
        },
        {
            title: '介绍',
            dataIndex: 'introduce',
            key: 'introduce',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {contextHolder}
                    <Button onClick={() => {
                        setEditPerson(record)
                        setIsModalOpen(true);
                    }}>编辑 {record.name}</Button>
                    <Modal title="编辑人员" open={isModalOpen} onOk={() => {
                        addOrUpdate(editPerson);
                        setIsModalOpen(false);
                    }} onCancel={() => setIsModalOpen(false)}>
                        <Form.Item label="姓名" >
                            <Input type="text"
                                   value={editPerson.name} placeholder="edit name"
                                   onChange={(e) => setEditPerson({ ...editPerson, name: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="年龄" >
                            <Input type="text"
                                   value={editPerson.age} placeholder="edit age"
                                   onChange={(e) => setEditPerson({ ...editPerson, age: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="性别" >
                            <Input type="text"
                                   value={editPerson.sex} placeholder="edit sex"
                                   onChange={(e) => setEditPerson({ ...editPerson, sex: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="简介" >
                            <Input type="text"
                                   value={editPerson.introduce} placeholder="edit introduce"
                                   onChange={(e) => setEditPerson({ ...editPerson, introduce: e.target.value })}
                            />
                        </Form.Item>
                    </Modal>
                    <Button onClick={() => {remove(record.id)}}>删除</Button>
                </Space>
            ),
        },
    ];
    return(
        <Table columns={columns} dataSource={persons} rowKey="id" />
    );
}

export default function App() {
    const [persons, setPersons] = useState([]);
    const [param, setParam] = useState({name:"", sex:null});
    const addOrUpdate = (record) => {
        axios.post("http://localhost:8080/person/insertOrUpdate", record).then(response => {
            success(response.data.msg)
        });
    };
    const [messageApi, contextHolder] = message.useMessage();
    const success = (msg) => {
        messageApi.open({
            type: 'success',
            content: msg,
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'This is an error message',
        });
    };

    return (
        <div>
            <SearchBar
                param={param}
                setParam={setParam}
                setPersons={setPersons}
                addOrUpdate={addOrUpdate}/>
            <PersonTable
                persons={persons}
                success={success}
                error={error}
                contextHolder={contextHolder}
                addOrUpdate={addOrUpdate}/>
        </div>
    );
}