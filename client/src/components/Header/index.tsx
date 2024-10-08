import { Col, Container, Row } from 'reactstrap'
import React from 'react' // Ajoute l'import pour React

export interface IHeaderProps {
    height?: string
    image?: string
    title: string
    headline: string
    children?: React.ReactNode // Permet d'accepter des éléments JSX, des chaînes de caractères, etc.
}

const Header: React.FunctionComponent<IHeaderProps> = ({
    children,
    height = '100%',
    image = 'https://picsum.photos/1200/450',
    headline,
    title
}) => {

    let headerStyle = {
        background: `linear-gradient(rgba(36, 20, 38, 0.5), rgba(36, 39, 38, 0.5)), url(${image}) no-repeat center center / cover`,
        width: '100%',
        height: height,
        padding:"50px"
    }

    return (
        <header style={headerStyle}>
            <Container>
                <Row className='align-items-center text-center'>
                    <Col>
                        <h1 className='display-4 text-white mt-5 mb-2'>{title}</h1>
                        <h3 className='mb-5 text-white'>{headline}</h3>
                        {children} {/* Permet d'afficher les enfants qui peuvent être des éléments JSX */}
                    </Col>
                </Row>
            </Container>
        </header>
    )
}

export default Header
