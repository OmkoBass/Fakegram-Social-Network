import React, { useEffect, useState } from 'react'
//React router
import { useHistory } from 'react-router-dom';

import axios from "axios";
//Ant components
import { Button, Form, Input, message, PageHeader, Radio, Spin } from "antd";

import DATABASE from "../Utils";

import '../Styles/ProfileEdit.css';

const { TextArea } = Input;

function ProfileEdit () {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    const history = useHistory();

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 }
    }

    const buttonLayout = {
        wrapperCol: { offset: 4 }
    }


    useEffect(() => {
        axios.get(`${ DATABASE }/profile`).then(res => {
            if (res.data !== 401) {
                setProfile(res.data);
            }
        }).then(() => setLoading(false));
    }, []);

    const handleOnFinish = value => {
        axios.put(`${ DATABASE }/user-update`, {
            bio: value.bio,
            sex: value.sex,
        }).then(res => {
            if (res.data === 404) {
                messageFail();
            } else {
                messageSuccess();
            }
        }).catch(messageFail);
    }

    const messageSuccess = () => {
        message.success('Profile updated!');
    }

    const messageFail = () => {
        message.error('Something went wrong!');
    }

    return <div className='profile-edit'>
        <PageHeader
            title='Edit profile:'
            onBack={ () => history.push('/profile') }
        />

        {
            loading
                ?
                <Spin
                    size='large'
                    tip='Loading...'
                    style={ {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    } }
                />
                :
                <Form
                    onFinish={ handleOnFinish }
                    initialValues={ profile }
                >
                    <Form.Item { ...layout }
                               name='bio'
                               label='bio'
                    >
                        <TextArea
                            rows={ 3 }
                            maxLength={ 128 }
                        />
                    </Form.Item>

                    <Form.Item { ...layout }
                               name='sex'
                               label='Gender'
                               rules={ [
                                   {
                                       required: true,
                                       message: 'Enter your gender!'
                                   }
                               ] }
                    >
                        <Radio.Group>
                            <Radio value={ true }>Male</Radio>
                            <Radio value={ false }>Female</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item { ...buttonLayout }>
                        <Button
                            htmlType='submit'
                            type='primary'
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
        }
    </div>
}

export default ProfileEdit;
