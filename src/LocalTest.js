import {useState} from "react";
import { Button, Modal, Checkbox, Form, Input } from 'antd';

function MyButton({param, setParam, fun}) {
    let addPerson = {
        name: "page init",
        age: 999,
        sex: 1,
        introduce: "page init"
    }
    return (
        <button onClick={() => {
            setParam({ ...param, sex: 999 });
            console.log("name:" + param.name + " sex:" + param.sex);
            fun()
            console.log(addPerson.name)
        }}>
            I'm a button
        </button>
    );
}

export default function MyApp() {
    const [param, setParam] = useState({name:"", sex:0});
    const fun = () => {
        console.log("function in myapp")
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <h1>Welcome to my app</h1>
            <MyButton setParam={setParam} param={param} fun={fun}/>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={(values) => {
                    console.log('Success:', JSON.stringify(values));
                }}
                onFinishFailed={(errorInfo) => {
                    console.log('Failed:', JSON.stringify(errorInfo));
                }}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}