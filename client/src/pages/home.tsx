import { Container } from "reactstrap"
import Navigation from "../components/Navigation"
import Header from "../components/Header"
import IpageProps from "../interfaces/pageInterface"
import IBlog from "../interfaces/blogInterface"
import IUser from "../interfaces/userInterface"
import { useEffect, useState } from "react"
import axios from "axios"
import config from '../config/config'
import LoadingComponent from "../components/LoadingComponent"
import BlogPreview from "../components/BlogPreview"

const HomePage: React.FunctionComponent<IpageProps> = props => {

    const [blogs, setBlog] = useState<IBlog[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() =>{
        getAllBlogs()
    }, [])

    const getAllBlogs = async () => {
        try 
        {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/blogs`, // Utilisation de config pour accéder à l'URL du serveur
            })

            if (response.status === (200 || 304))
            {
                let blogs = response.data.blogs as IBlog[]
                blogs.sort((x,y) => y.updatedAt.localeCompare(x.updatedAt))

                setBlog(blogs)
            }
            else
            {
                setError('Unable to retrieve blogs')
            }
        } 
        catch (error: any)
        {
            setError(error.message)
        }
        finally
        {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }

    if (loading){
        return <LoadingComponent>Loading articles</LoadingComponent>
    }
    return(
        <Container fluid className="p-0">
            <Navigation/>
            <Header
                headline="Un blog en react"
                title="Je test des trucs"
            />
            <Container className="mt-5">
                {blogs.map((blog,index) =>{
                    return(
                        <div key={index}>
                            <BlogPreview
                                _id={blog._id}
                                author={(blog.author as IUser).name}
                                headline={blog.headline}
                                title={blog.title}
                                createdAt={blog.createdAt}
                                updatedAt={blog.updatedAt}
                            />
                        </div>
                    )
                }
            )}
            </Container>
        </Container>
    )
}

export default HomePage
