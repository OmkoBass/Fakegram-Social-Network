import React, { useState, useEffect } from 'react'

// Axios
import axios from 'axios';

// React Router
import { Link } from "react-router-dom";

// Ant Components
import { Typography, Avatar } from "antd";
import DATABASE from "../../Utils";

function Notification({who, action, what}) {
    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`${DATABASE}/post/${what}`)
            .then(res => {
                if(res.data !== 400) {
                    setPost(res.data);
                } else {
                    // Error
                }
            })
    }, []);

    return <div>
        <Typography.Text strong>
            <Link to={`Profile/${ who }`}>{ who }</Link>
        </Typography.Text>
        <Typography.Text> { action } </Typography.Text>
        {
            post
            ?
            <Avatar
                src={`${post.image}`}
                alt={null}
            />
            :
            null
        }
    </div>
}

export default Notification;
