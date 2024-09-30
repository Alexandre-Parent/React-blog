import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader } from 'reactstrap'
import ErrorText from '../components/ErrorText'
import { GoogleAuthProvider } from 'firebase/auth' // Correct Firebase import
import logging from '../config/logging'
import { SignInSocialMedia as SocialMediaPopup } from '../modules/auth'
import CenterPiece from '../components/CenterPiece'
import LoadingComponent from '../components/LoadingComponent'
import UserContext from '../contextes/user'

const LoginPage: React.FC = () => {
    const [authenticating, setAuthenticating] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const userContext = useContext(UserContext)
    const navigate = useNavigate() // Use useNavigate instead of useHistory
    const isLogin = window.location.pathname.includes('login')

    const SignInSocialMedia = async (provider: GoogleAuthProvider) => {
        if (error !== '') setError('')

        setAuthenticating(true)

        try {
            const result = await SocialMediaPopup(provider)
            logging.info(result)

            const user = result.user

            if (user) {
                const uid = user.uid
                const name = user.displayName

                if (name) {
                    try {
                        const fire_token = await user.getIdToken()

                        /* Validate with backend or perform any action needed with the token */
                    } catch (error) {
                        setError('Invalid Token')
                        logging.error(error)
                        setAuthenticating(false)
                    }
                } else {
                    setError('Missing name')
                    setAuthenticating(false)
                }
            } else {
                setError('The social media provider does not have enough information. Please try a different provider.')
                setAuthenticating(false)
            }
        } catch (error: any) {
            setError(error.message)
            setAuthenticating(false)
        }
    }

    return (
        <CenterPiece>
            <Card>
                <CardHeader>
                    {isLogin ? 'Login' : 'Sign Up'}
                </CardHeader>
                <CardBody>
                    <ErrorText error={error} />
                    <Button
                        block
                        disabled={authenticating}
                        onClick={() => SignInSocialMedia(new GoogleAuthProvider())}
                        style={{ backgroundColor: '#ea4335', borderColor: '#ea4335' }}
                    >
                        <i className="fab fa-google mr-2"></i> Sign {isLogin ? 'in' : 'up'} with Google
                    </Button>
                    {authenticating && <LoadingComponent card={false} />}
                </CardBody>
            </Card>
        </CenterPiece>
    )
}

export default LoginPage
