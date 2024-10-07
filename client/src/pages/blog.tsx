import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, Container, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import ErrorText from '../components/ErrorText'
import Header from '../components/Header'
import LoadingComponent from '../components/LoadingComponent'
import Navigation from '../components/Navigation'
import config from '../config/config'
import UserContext from '../contextes/user'
import IBlog from '../interfaces/blogInterface'
import IUser from '../interfaces/userInterface'
import { Navigate } from 'react-router-dom'

const BlogPage: React.FunctionComponent = () => {
    const { blogID } = useParams<{ blogID: string }>()
    const navigate = useNavigate()

    const [blog, setBlog] = useState<IBlog | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [modal, setModal] = useState<boolean>(false)
    const [deleting, setDeleting] = useState<boolean>(false)

    const { user } = useContext(UserContext).userState

    useEffect(() => {
        if (blogID) {
            getBlog(blogID)
        } else {
            navigate('/')
        }
    }, [blogID, navigate])

    const getBlog = async (id: string) => {
        try {
            const response = await axios.get(`${config.server.url}/blogs/read/${id}`)

            if (response.status === 200) {
                setBlog(response.data.blog)
            } else {
                setError(`Unable to retrieve blog with ID: ${id}`)
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteBlog = async () => {
        setDeleting(true)

        try {
            const response = await axios.delete(`${config.server.url}/blogs/${blogID}`)

            if (response.status === 200) {
                navigate('/')
            } else {
                setError(`Unable to delete blog with ID: ${blogID}`)
                setDeleting(false)
            }
        } catch (error: any) {
            setError(error.message)
            setDeleting(false)
        }
    }

    if (loading) return <LoadingComponent>Loading Blog ...</LoadingComponent>

    if (blog) {
        return (
            <Container fluid className="p-0">
                <Navigation />
                <Modal isOpen={modal}>
                    <ModalHeader>Delete</ModalHeader>
                    <ModalBody>
                        {deleting ? (
                            <LoadingComponent>Deleting Blog...</LoadingComponent>
                        ) : (
                            "Are you sure you want to delete this blog?"
                        )}
                        <ErrorText error={error} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={deleteBlog}>Delete Permanently</Button>
                        <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Header
                    image={blog.picture || undefined}
                    headline={blog.headline}
                    title={blog.title}
                >
                </Header>
                <Container className="mt-5">
                    {user._id === (blog.author as IUser)._id && (
                        <Container fluid className="p-0">
                            <Button color="info" className="mr-2" tag={Link} to={`/edit/${blog._id}`}>
                                <i className="fas fa-edit mr-2"></i>Edit
                            </Button>
                            <Button color="danger" onClick={() => setModal(true)}>
                                <i className="far fa-trash-alt mr-2"></i>Delete
                            </Button>
                            <hr />
                        </Container>
                    )}
                    <ErrorText error={error} />
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </Container>
            </Container>
        )
    } else {
        return <Navigate to="/" />
    }
}

export default BlogPage
