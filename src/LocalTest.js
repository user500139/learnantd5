import {useState} from "react";
import { Button, Modal } from 'antd';

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
        </div>
    );
}