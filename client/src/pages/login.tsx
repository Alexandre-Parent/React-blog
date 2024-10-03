import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader } from 'reactstrap'
import ErrorText from '../components/ErrorText'
import { GoogleAuthProvider } from 'firebase/auth'
import logging from '../config/logging'
import { Authenticate, SignInSocialMedia as SocialMediaPopup } from '../modules/auth'
import CenterPiece from '../components/CenterPiece'
import LoadingComponent from '../components/LoadingComponent'
import UserContext from '../contextes/user'

const LoginPage: React.FC = () => {
    const [authenticating, setAuthenticating] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const userContext = useContext(UserContext)
    const navigate = useNavigate() // Use useNavigate instead of useHistory
    const isLogin = window.location.pathname.includes('login')

    // Gestion des erreurs centralisée
    const handleError = (message: string) => {
        setError(message)
        setAuthenticating(false)
    }

    // Fonction pour gérer la connexion via Google
    const SignInSocialMedia = async (provider: GoogleAuthProvider) => {
        if (error) setError('')

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
                        
                        // Utiliser une fonction async ici pour gérer l'authentification
                        await handleAuthentication(uid, name, fire_token)
                    } catch (error) {
                        handleError('Invalid Token')
                        logging.error(error)
                    }
                } else {
                    handleError('Missing name')
                }
            } else {
                handleError('The social media provider does not have enough information. Please try a different provider.')
            }
        } catch (error: any) {
            handleError(error.message)
        }
    }

    // Fonction séparée pour gérer l'authentification
    const handleAuthentication = async (uid: string, name: string, fire_token: string) => {
        try {
            Authenticate(uid, name, fire_token, (error, _user) => {
                if (error) {
                    handleError(error)
                } else if (_user) {
                    userContext.userDispatch({ type: 'login', payload: { user: _user, fire_token } })
                    navigate('/')  // Utilisation de navigate à la place de history.push
                }
            })
        } catch (error) {
            handleError('Unable to authenticate')
            logging.error(error)
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
                        {authenticating ? (
                            <>
                                <LoadingComponent card={false} />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                <i className="fab fa-google mr-2"></i> Sign {isLogin ? 'in' : 'up'} with Google
                            </>
                        )}
                    </Button>
                </CardBody>
            </Card>
        </CenterPiece>
    )
}

export default LoginPage
