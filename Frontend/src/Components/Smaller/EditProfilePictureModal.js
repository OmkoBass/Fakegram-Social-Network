import React, { useEffect, useRef, useState } from 'react'

import axios from 'axios';

import { Button, Col, message, Modal, Row, Spin } from 'antd';
//Context
import DATABASE from "../../Utils";

function EditProfilePictureModal ({ visible, callBack, returnProfilePicture }) {
    const [uploading, setUploading] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

    let fileRef = useRef(null);

    const messageSuccess = () => {
        message.success('Profile picture updated!');
    }

    const messageProfilePictureDeleted = () => {
        message.success('Profile picture deleted!');
    }

    const messageFail = () => {
        message.error('Something went wrong!');
    }

    const updateProfilePicture = picture => {
        setUploading(true);
        let formData = new FormData();

        formData.append('profilePicture', picture);

        axios.put(`${ DATABASE }/user-update-profile-picture`, formData).then(res => {
            if (res.data !== 400 && res.data !== 401 && res.data !== 403 && res.data !== 404 && res.data !== 500) {
                setUploading(false);
                messageSuccess();
                returnProfilePicture(res.data);
                callBack();
            } else {
                setUploading(false);
                messageFail();
            }
        }).catch(() => {
            setUploading(false);
            messageFail()
        });
    }

    const uploadPicture = () => setProfilePicture(fileRef.current.files[0]);

    useEffect(() => {
        if (profilePicture !== null) {
            updateProfilePicture(profilePicture);
        }
    }, [profilePicture]);

    return <Modal
        visible={ visible }
        footer={ false }
        closable={ false }
    >
        <Spin
            spinning={uploading}
            tip='Uploading profile picture...'
        >
            <Row gutter={ 48 } style={ { textAlign: 'center' } }>
                <Col span={ 24 }>
                    <Button type='link' onClick={ () => fileRef.current.click() }>
                        Upload profile picture
                    </Button>
                </Col>
                <Col span={ 24 }>
                    <Button type='link'
                            danger
                            onClick={ () => {
                                axios.get(`${ DATABASE }/user/delete/profilePicture`)
                                    .then(res => {
                                        if (res.data === 200) {
                                            returnProfilePicture('');
                                            messageProfilePictureDeleted();
                                        } else {
                                            messageFail();
                                        }
                                    })
                                callBack();
                            } }
                    >
                        Delete profile picture
                    </Button>
                </Col>
                <Col span={ 24 }>
                    <Button type='text'
                            onClick={ () => callBack() }
                    >
                        Cancel
                    </Button>
                </Col>
                <input type='file' multiple={ false } ref={ fileRef } onChange={ uploadPicture } accept='image/*'
                       style={ { display: 'none' } }/>
            </Row>
        </Spin>
    </Modal>
}

export default EditProfilePictureModal;
