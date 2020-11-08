import React, { useState, useEffect } from 'react'

import axios from 'axios';

//React router
import { Link } from "react-router-dom";

//Ant Components
import Card from "antd/es/card";
import Typography from "antd/es/typography";
import Modal from "antd/es/modal/Modal";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";
import message from "antd/es/message";

//Ant icons
import { CommentOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

//Components
import PostControls from "./PostControls";

// Lazy images
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import moment from 'moment';

import DATABASE from "../../Utils";

import '../../Styles/Post.css';

function Post ({ post, user, src, alt, removeFromList }) {
    let [form] = Form.useForm();

    const [previewComments, setPreviewComments] = useState([]);

    const { confirm } = Modal;

    function showAreYouSure () {
        confirm({
            title: "Are you sure? ",
            icon: <ExclamationCircleOutlined/>,
            content: "You will delete this post forever.",
            onOk () {
                deletePost()
            },
            okText: "Delete",
            cancelText: "Cancel",
        });
    }

    useEffect(() => {
        axios.get(`${DATABASE}/${post._id}/comments/few`, )
            .then(res => {
                if (res.data === 400) {
                    // Error
                } else {
                    setPreviewComments(res.data);
                }
            });
    }, []);

    const deletePost = () => {
        axios.put(`${ DATABASE }/post/delete/${ post._id }`).then(res => {
            if (res.data === 200) {
                removeFromList(post._id);
                /*Callback if the post is removed!*/
            } else {
                /*Callback if error happened*/
                message.error('Something went wrong!');
            }
        });
    }

    const comment = value => {
        axios.post(`${ DATABASE }/post-comment`, {
            postId: post._id,
            comment: value.comment
        }).then(res => {
            if (res.data === 500) {
                // Server error
                message.error('Server messed something up!');
            } else if (res.data === 401) {
                // Error while updating documents
                message.error('Error while commenting!');
            } else {
                message.success('Successfully commented!');
                form.resetFields();
            }
        });
    }

    return <Card className='post'
                 title={ <Link to={ `/Profile/${ post.postedBy }` }>@{ post.postedBy }</Link> }
                 extra={
                     user === post.postedBy
                         ?
                         <DeleteOutlined
                             className='delete-icon icon-hover'
                             onClick={ showAreYouSure }
                         />
                         :
                         null
                 }
                 cover={
                     <LazyLoadImage
                         style={{ marginBottom: '-1.6em'}}
                         alt={ alt }
                         src={ src }
                         effect='blur'
                     />
                 }
    >
        <PostControls likes={ post.likedBy.length } liked={ post.likedBy.includes(user) } _id={ post._id }/>
        <Typography.Paragraph>
            <Typography.Text>
                { post.description }
            </Typography.Text>

            <br/>

            <Typography.Text strong>
                { moment(post.dateCreated).format('DD.MM.YYYY HH:mm') }
            </Typography.Text>
        </Typography.Paragraph>

        <div style={{ textAlign: 'left'}}>
            {
                previewComments.map(comment => <Typography.Paragraph>
                    <Typography.Text strong> {comment.commentedBy} </Typography.Text>: {comment.comment} <br/>
                </Typography.Paragraph>)
            }
        </div>

        <Form
            style={{marginBottom: '4em'}}
            form={ form }
            onFinish={ value => comment(value) }
        >
            <Form.Item
                name='comment'
                rules={ [
                    {
                        required: true,
                        message: "Can't post an empty comment!",
                    }]
                }
            >
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button
                    type='primary'
                    htmlType='submit'
                    icon={ <CommentOutlined/> }
                >
                    Comment
                </Button>
            </Form.Item>
        </Form>
    </Card>
}

export default Post;
