import React, { useState } from 'react'

import axios from 'axios';
//Context
//Ant components
import { Button, Form, Input, message, Modal, PageHeader } from 'antd';

import DATABASE from "../../Utils";

import FileUpload from "./FileUpload";

import '../../Styles/FileUpload.css';

const { TextArea } = Input;

function CreatePostModal ({ visible, callBack }) {
    const [image, setImage] = useState(null);

    let [form] = Form.useForm();

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const tailLayout = {
        wrapperCol: { offset: 6, span: 16 },
    };

    const messageSuccess = () => {
        message.success('Your new post is up!');
    }

    const messageFail = () => {
        message.error('Something went wrong!');
    }

    const messageNoImage = () => {
        message.error('Select a picture you want to upload!');
    }

    const handleOnFinish = value => {
        if (image) {
            let formData = new FormData();

            formData.append('image', image);
            formData.append('description', value.description);

            axios.post(`${ DATABASE }/create-post`, formData).then(res => {
                if (res.data !== 404 && res.data !== 401) {
                    messageSuccess();
                } else {
                    messageFail();
                }
            }).then(() => {
                callBack();
                form.resetFields();
                setImage(null);
            });
        } else {
            messageNoImage();
        }
    }

    return <Modal
        visible={ visible }
        footer={ false }
        onCancel={ callBack }
    >
        <PageHeader title='Upload a post'/>
        <Form onFinish={ handleOnFinish }
              form={ form }
        >
            <Form.Item { ...layout }
                       name='description'
                       label='Caption'
                       rules={ [
                           {
                               required: true,
                               message: 'Enter a description!'
                           }
                       ] }
            >
                <TextArea maxLength={ 32 }/>
            </Form.Item>

            <Form.Item { ...layout }
                       name='image'
                       label='Image'
            >
                <FileUpload
                    CallBack={ data => setImage(data) }
                    accept='image/*'
                    multiple={ false }
                />
            </Form.Item>

            <Form.Item { ...tailLayout }>
                <Button
                    type='primary'
                    htmlType='submit'
                >
                    Post
                </Button>
            </Form.Item>
        </Form>
    </Modal>
}

export default CreatePostModal;
