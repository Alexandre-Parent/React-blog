import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardImg } from 'reactstrap'

export interface IBlogPreviewProps {
    _id: string
    title: string
    headline: string
    author: string
    createdAt: string
    updatedAt: string
    image?: string 
    children?: React.ReactNode
}

const BlogPreview: React.FunctionComponent<IBlogPreviewProps> = ({ 
    _id, 
    author, 
    createdAt, 
    updatedAt, 
    headline, 
    title, 
    image, 
    children 
}) => {

    const formattedCreatedAt = new Date(createdAt).toLocaleString()
    const formattedUpdatedAt = new Date(updatedAt).toLocaleString()

    const timeInfo = createdAt !== updatedAt 
        ? `Updated by ${author} on ${formattedUpdatedAt}` 
        : `Posted by ${author} on ${formattedCreatedAt}`

    const defaultImage = 'https://via.placeholder.com/1200x450?text=No+Image+Available'

    return (
        <Card className="blog-preview border-0 mb-4">
            <CardImg top width="100%" src={image || defaultImage} alt={title || 'Blog image'} />
            
            <CardBody className="p-0">
                <Link 
                    to={`/blogs/${_id}`} 
                    style={{ textDecoration: 'none' }}
                    className="blog-preview__link text-primary"
                >
                    <h2 className="blog-preview__title font-weight-bold">{title}</h2>
                    <h4 className="blog-preview__headline text-muted">{headline}</h4>
                </Link>
                <p className="blog-preview__meta text-secondary">
                    {timeInfo}
                </p>
                {children && (
                    <div className="blog-preview__content mt-3">
                        {children}
                    </div>
                )}
            </CardBody>
        </Card>
    )
}

export default BlogPreview
