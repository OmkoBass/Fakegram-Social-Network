import React, { useState } from 'react'
//This shit is a ANT DESIGN ICON, import it like this
//or any other icon and put it below
import { UploadOutlined } from '@ant-design/icons';

import { Modal } from "antd";

function FileUpload (props) {
    const [file, setFile] = useState(null);
    const [bigPicture, setBigPicture] = useState(false);
    const [error, setError] = useState(false);

    const handleInput = event => {
        if (event.target.files[0].type === 'image/png' ||
            event.target.files[0].type === 'image/jpg' ||
            event.target.files[0].type === 'image/jpeg') {
            setError(false);
            setFile(URL.createObjectURL(event.target.files[0]));
        } else {
            setError(true);
        }

        // Callback to the parent component
        props.CallBack(event.target.files[0]);
    }

    return <div className='upload'>
        <label className='upload-button'>
            <input type='file'
                   accept={ props.accept }
                   multiple={ props.multiple }
                   onChange={ handleInput }
            >
            </input>
            <span>
                <UploadOutlined style={ { marginRight: '6px' } }/>
                Upload
            </span>
        </label>
        <span style={ { color: '#ff525a' } }>{ error ? 'Samo slike!' : null }</span>
        <img style={ { maxHeight: '150px' } }
             src={ file ? file : '' }
             alt=""
             onClick={ () => setBigPicture(true) }/>

        <Modal
            onCancel={ () => setBigPicture(false) }
            closable={ false }
            visible={ bigPicture }
            title=""
            footer={ false }>

            <img className="big-image" src={ file ? file : '' } alt=""/>

        </Modal>
    </div>
}

export default FileUpload;