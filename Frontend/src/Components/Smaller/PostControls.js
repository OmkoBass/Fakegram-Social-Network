import React, { useContext, useState } from 'react'

import axios from 'axios';

import { useHistory } from 'react-router-dom';

import { motion } from "framer-motion";

import { Typography } from "antd";
//ant icons
import { HeartFilled, MessageFilled } from '@ant-design/icons';

import { AuthContext } from "../Auth";

import DATABASE from "../../Utils";
import message from "antd/es/message";

function PostControls ({ likes, liked, _id }) {
    const history = useHistory();

    const [likeNumber, setLikeNumber] = useState(likes);
    const [like, setLike] = useState(liked);

    const { currentUser } = useContext(AuthContext);

    const likePost = () => {
        axios.put(`${ DATABASE }/post/like/${ _id }`, {}, {
            headers: {
                token: currentUser
            }
        }).then(res => {
            if (res.data === 200) {
                setLike(true);
                setLikeNumber(likeNumber + 1);
            } else {
                /*Error*/
                message.error('Error liking the post!');
            }
        });
    }

    const unlikePost = () => {
        axios.put(`${ DATABASE }/post/unlike/${ _id }`, {}, {
            headers: {
                token: currentUser
            }
        }).then(res => {
            if (res.data !== 401) {
                setLike(false);
                setLikeNumber(likeNumber - 1);
            } else {
                /*Error*/
                message.error('Error disliking the post!');
            }
        });
    }

    return <div>
        <div className='post-controls'>
            <motion.div
                whileHover={ { scale: 1.1 } }
                whileTap={ { scale: 0.9 } }
            >
                <HeartFilled
                    className='like-icon icon-hover'
                    style={ like ? { color: 'red' } : { color: '#1DA57A' } }
                    onClick={ like ? unlikePost : likePost }
                />
            </motion.div>

            <motion.div
                whileHover={ { scale: 1.1 } }
            >
                <MessageFilled
                    style={{ color: '#1DA57A'}}
                    onClick={ () => history.push(`/profile/${ _id }/commentedBy`) }
                    className='icon-hover'
                />
            </motion.div>

        </div>
        <Typography.Text
            style={ { cursor: 'pointer' } }
            onClick={ () => history.push(`/profile/${ _id }/likedBy`) }
            strong
        >{ likeNumber } likes</Typography.Text>
    </div>
}

export default PostControls;
