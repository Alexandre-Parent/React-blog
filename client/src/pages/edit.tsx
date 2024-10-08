import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom' // Import des hooks nécessaires
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap'
import axios from 'axios'
import ErrorText from '../components/ErrorText'
import Header from '../components/Header'
import LoadingComponent from '../components/LoadingComponent'
import Navigation from '../components/Navigation'
import config from '../config/config'
import logging from '../config/logging'
import UserContext from '../contextes/user'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import SuccessText from '../components/SuccessText'

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const EditPage: React.FunctionComponent = () => {
    const { blogID } = useParams<{ blogID: string }>()
    const navigate = useNavigate() 

    const [_id, setId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [picture, setPicture] = useState<string>('')
    const [headline, setHeadline] = useState<string>('')
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty())

    const [saving, setSaving] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')

    const { user } = useContext(UserContext).userState

    useEffect(() => {
        if (blogID) {
            setId(blogID)
            fetchBlog(blogID)
        } else {
            setLoading(false)
        }
    }, [blogID])

    const fetchBlog = async (id: string) => {
        try {
            const response = await axios.get(`${config.server.url}/blogs/read/${id}`)

            if (response.status === 200) {
                if (user._id !== response.data.blog.author._id) {
                    logging.warn(`This blog is owned by someone else.`)
                    setError("You are not authorized to edit this blog.")
                    return
                }

                const blog = response.data.blog
                setTitle(blog.title)
                setPicture(blog.picture || '')
                setHeadline(blog.headline)

                const contentBlock = htmlToDraft(blog.content)
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                    setEditorState(EditorState.createWithContent(contentState))
                }
            } else {
                setError(`Unable to retrieve blog ${_id}`)
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!title || !headline || editorState.getCurrentContent().hasText() === false) {
            setError('Please fill out all fields.')
            setSuccess('')
            return
        }

        setError('')
        setSuccess('')
        setSaving(true)

        const contentAsHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()))

        try {
            const response = await axios({
                method: _id ? 'PATCH' : 'POST',
                url: _id ? `${config.server.url}/blogs/update/${_id}` : `${config.server.url}/blogs/create`,
                data: {
                    title,
                    picture,
                    headline,
                    content: contentAsHtml,
                    author: user._id,
                },
            })

            if (response.status === 201 || response.status === 200) {
                setSuccess(_id ? 'Blog updated successfully!' : 'Blog created successfully!')
                if (!_id) {
                    setId(response.data.blog._id)
                }
            } else {
                setError('Unable to save blog.')
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <LoadingComponent />

    return (
        <Container fluid className="p-0">
            <Navigation />
            <Header
                image="https://startbootstrap.github.io/startbootstrap-clean-blog/img/home-bg.jpg"
                headline=""
                title={_id !== '' ? 'Edit Your Blog' : 'Create a Blog'}
            />
            <Container className="mt-5 mb-5">
                <Form>
                    <ErrorText error={error} />
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input
                            type="text"
                            name="title"
                            value={title}
                            id="title"
                            placeholder="Enter a title"
                            disabled={saving}
                            onChange={event => setTitle(event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="picture">Picture URL</Label>
                        <Input
                            type="text"
                            name="picture"
                            value={picture}
                            id="picture"
                            placeholder="Picture URL"
                            disabled={saving}
                            onChange={event => setPicture(event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="headline">Headline</Label>
                        <Input
                            type="text"
                            name="headline"
                            value={headline}
                            id="headline"
                            placeholder="Enter a headline"
                            disabled={saving}
                            onChange={event => setHeadline(event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Content</Label>
                        <Editor
                            editorState={editorState}
                            wrapperClassName="card"
                            editorClassName="card-body"
                            onEditorStateChange={newState => setEditorState(newState)}
                            toolbar={{
                                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true },
                            }}
                        />
                    </FormGroup>
                    <SuccessText success={success} />
                    <FormGroup>
                        <Button
                            block
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <i className="fas fa-save mr-1"></i>
                            {_id ? "Update" : "Post"}
                        </Button>
                        {_id &&
                            <Button block color="success" tag={Link} to={`/blogs/${_id}`}>
                                Go to your blog post!
                            </Button>
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label>Preview</Label>
                        <div className="border ql-container p-2">
                            <div dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(editorState.getCurrentContent())) }} />
                        </div>
                    </FormGroup>
                </Form>
            </Container>
        </Container>
    )
}

export default EditPage
