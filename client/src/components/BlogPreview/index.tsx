import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'

export interface IBlogPreviewProps {
    _id: string
    title: string
    headline: string
    author: string
    createdAt: string
    updatedAt: string
    children?: React.ReactNode
}

const BlogPreview: React.FunctionComponent<IBlogPreviewProps> = ({ 
    _id, 
    author, 
    createdAt, 
    updatedAt, 
    headline, 
    title, 
    children 
}) => {

    // Formatage des dates
    const formattedCreatedAt = new Date(createdAt).toLocaleString()
    const formattedUpdatedAt = new Date(updatedAt).toLocaleString()

    // Texte pour l'auteur et les dates
    const timeInfo = createdAt !== updatedAt 
        ? `Updated by ${author} on ${formattedUpdatedAt}` 
        : `Posted by ${author} on ${formattedCreatedAt}`

    return (
        <Card className="blog-preview border-0 mb-4">
            <CardBody className="p-0">
                {/* Lien vers le blog avec styles CSS */}
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
                {/* Affichage des enfants si présents */}
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
