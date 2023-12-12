import React, {useState, useEffect} from 'react';
import {Button, Form, Input, Table, Space, message, Modal, Tag, Radio, Select, notification} from 'antd';
import axios from 'axios';
import {
    ExclamationCircleOutlined,
    RadiusBottomleftOutlined,
    RadiusBottomrightOutlined,
    RadiusUpleftOutlined,
    RadiusUprightOutlined,
} from '@ant-design/icons';

function SearchBar({param, setParam, search, addOrUpdate, notificationContextHolder}) {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log("form.getFieldsValue" + JSON.stringify(form.getFieldsValue()))
    }, [isModalOpen])

    return (
        <Form layout={'inline'} style={{
            maxWidth: 'none',
        }}>
            <Form.Item label="name" >
                <Input
                    type="text"
                    value={param.name} placeholder="search with name"
                    onChange={(e) => {
                        setParam({...param, name: e.target.value})
                    }}
                />
            </Form.Item>
            <Form.Item label="sex" style={{width: '120px'}}>
                <Select onChange={(e) => setParam({...param, sex: e})}>
                    <Select.Option value={1}>男</Select.Option>
                    <Select.Option value={2}>女</Select.Option>
                    <Select.Option value={0}>不筛选</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={() => {
                    search(param.name, param.sex)
                    setParam({...param, sex: 0, name: ""})
                }}>
                    Search
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={() => {
                    setIsModalOpen(true)
                    form.setFieldsValue({
                        name:"",
                        age:null,
                        sex:null,
                        introduce:""
                    })
                }}>
                    Add
                </Button>
            </Form.Item>
            {notificationContextHolder}
            <Modal title="添加人员" open={isModalOpen} footer={null}
                   onCancel={() => setIsModalOpen(false)}>
                <Form form = {form} onFinish={() => {
                    addOrUpdate(form.getFieldsValue());
                    setIsModalOpen(false);
                }} onFinishFailed={(errorInfo) => {
                    console.log('Form validation failed:', errorInfo);
                }}>
                    <Form.Item label="姓名" name = "name" rules={[
                        {
                            required: true,
                            message: '一个人必须有名字',
                        },
                    ]}>
                        <Input type="text"
                               placeholder="edit name"
                               onChange={(e) => form.setFieldsValue({name: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item label="年龄" name = "age">
                        <Input type="text"
                               placeholder="edit age"
                               onChange={(e) => form.setFieldsValue({age: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item label="性别" name = "sex" rules={[
                        {
                            required: true,
                            message: '一个人必须有性别',
                        },
                    ]}>
                        <Radio.Group onChange={(e) => form.setFieldsValue({sex: e.target.value})}>
                            <Radio value={1}> 男 </Radio>
                            <Radio value={2}> 女 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="简介" name = "introduce">
                        <Input type="text"
                               placeholder="edit introduce"
                               onChange={(e) => form.setFieldsValue({introduce: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 17,
                            span: 16,
                        }}>
                        <Button type="primary" htmlType="submit">
                            确认
                        </Button>
                        <Button onClick={() => setIsModalOpen(false)}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Form>
    );
}

function PersonTable({search, persons, success, error, contextHolder, addOrUpdate, notificationContextHolder}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const deleteConfirm = (record) => {
        Modal.confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined/>,
            content: `确定要删除 ${record.name} 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                remove(record.id)
            },
        });
    };

    useEffect(() => {
        console.log("form.getFieldsValue:")
    }, [])

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
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
            render: (_, record) => (
                <>
                    <Tag color={record.sex === 1 ? 'geekblue' : 'green'}>{record.sex === 1 ? '男' : '女'}</Tag>
                </>
            ),
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
                    <Button onClick={() => {
                        form.setFieldsValue(record)
                        setIsModalOpen(true);
                    }}>编辑 {record.name}</Button>
                    {notificationContextHolder}
                    <Modal title="编辑人员" open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
                        <Form form = {form} name="basic"
                              onFinish={(values) => {
                                  addOrUpdate(form.getFieldsValue());
                                  setIsModalOpen(false);
                                  console.log('Success:', JSON.stringify(values));
                              }}
                              onFinishFailed={(errorInfo) => {
                                  console.log('Failed:', errorInfo);
                              }}
                              autoComplete="off">
                            <Form.Item label="id" name="id">
                                <Input type="text"
                                       disabled={true}
                                />
                            </Form.Item>
                            <Form.Item label="姓名" name="name" rules={[
                                {
                                    required: true,
                                    message: '一个人必须有名字',
                                },
                            ]}>
                                <Input type="text"
                                       placeholder="edit name"
                                       onChange={(e) => form.setFieldsValue({name: e.target.value})}
                                />
                            </Form.Item>
                            <Form.Item label="年龄" name="age">
                                <Input type="text"
                                       placeholder="edit age"
                                       onChange={(e) => form.setFieldsValue({age: e.target.value})}
                                />
                            </Form.Item>
                            <Form.Item label="性别" name="sex">
                                <Radio.Group disabled={true}>
                                    <Radio value={1}> 男 </Radio>
                                    <Radio value={2}> 女 </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="简介" name = "introduce">
                                <Input type="text"
                                       placeholder="edit introduce"
                                       onChange={(e) => form.setFieldsValue({introduce: e.target.value})}
                                />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 17,
                                    span: 16,
                                }}>
                                <Button type="primary" htmlType="submit">
                                    确认
                                </Button>
                                <Button onClick={() => setIsModalOpen(false)}>
                                    取消
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    {contextHolder}
                    <Button danger onClick={() => {
                        deleteConfirm(record)
                    }}>删除</Button>
                </Space>
            ),
        },
    ];

    const remove = (id) => {
        const removeParam = {
            id: id
        }
        axios.post("http://localhost:8080/person/delete", removeParam)
            .then(response => {
                if (response.data.code === 0) {
                    success(response.data.msg)
                } else {
                    error(response.data.msg)
                }
            });
        search();
    };
    return (
        <Table columns={columns} dataSource={persons} pagination={false} rowKey="id"/>
    );
}

export default function App() {
    const [persons, setPersons] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [api, notificationContextHolder] = notification.useNotification();
    const [param, setParam] = useState({
        name: "",
        sex: 0,
        pageSize: 3,
        pageNum: 0
    });
    const [hasNextPage, setHasNextPage] = useState(true)
    const [hasPrePage, setHasPrePage] = useState(false)

    useEffect(() => {
        // 组件挂载后执行的操作
        console.log('Component mounted');
        search();

        // 如果有需要清理的操作，可以在返回的函数中进行清理
        return () => {
            console.log('Component unmounted');
        };
    }, []);

    const openNotification = (message, description, placement) => {
        api.info({
            message: message,
            description: description,
            placement,
        });
    };

    const search = () => {
        axios.post("http://localhost:8080/person/query", param
            // , {headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded'
            // }}
        ).then(response => {
            setPersons(JSON.parse(response.data.data).personList);
            setHasNextPage(JSON.parse(response.data.data).hasNextPage)
        })
    };

    useEffect(() => {
        console.log("param: " + JSON.stringify(param))
        setHasPrePage(param.pageNum !== 0)
        search()
    }, [param.pageNum])

    useEffect(() => {
        console.log("button state param: " + JSON.stringify(param))
        if (!param.name || !param.sex) {
            setHasNextPage(false)
            setHasPrePage(false)
        }
    }, [param.name, param.sex])

    const addOrUpdate = (record) => {
        axios.post("http://localhost:8080/person/insertOrUpdate", record).then(response => {
            if (response.data.code === 0) {
                success(response.data.msg)
            } else if (response.data.code === 100) {
                openNotification("编辑校验错误", response.data.msg, "topRight")
            } else {
                openNotification("系统错误", response.data.msg, "topRight")
            }
        });
        search();
    };
    const success = (msg) => {
        messageApi.open({
            type: 'success',
            content: msg,
        });
    };
    const error = (msg) => {
        messageApi.open({
            type: 'error',
            content: msg,
        });
    };

    return (
        <div>
            <SearchBar
                param={param}
                search={search}
                setParam={setParam}
                notificationContextHolder={notificationContextHolder}
                addOrUpdate={addOrUpdate}/>
            <PersonTable
                persons={persons}
                search={search}
                success={success}
                error={error}
                notificationContextHolder={notificationContextHolder}
                contextHolder={contextHolder}
                addOrUpdate={addOrUpdate}/>
            <div style={{textAlign: 'right'}}>
                <Button type="primary" disabled={!hasPrePage}
                        onClick={() => {
                            const temp = param.pageNum - 1
                            setParam({...param, pageNum: temp})
                        }}>
                    上一页
                </Button>
                <Button type="primary" disabled={!hasNextPage}
                        onClick={() => {
                            const temp = param.pageNum + 1
                            setParam({...param, pageNum: temp})
                        }}
                        style={{backgroundColor: 'cyan', color: 'black'}}>
                    下一页
                </Button>
            </div>
        </div>
    );
}