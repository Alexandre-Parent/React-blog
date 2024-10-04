import { AuthProvider, UserCredential, signInWithPopup } from 'firebase/auth'
import { auth } from '../config/firebase'
import IUser from '../interfaces/userInterface'
import logging from '../config/logging'
import config from '../config/config'
import axios from 'axios'

const NAMESPACE = 'Auth'

/**
 * Type pour la fonction de rappel lors de l'authentification.
 */
type AuthCallback = (error: string | null, user: IUser | null) => void

/**
 * Connexion avec un fournisseur de médias sociaux via Firebase
 * @param provider - Le fournisseur d'authentification (Google, Facebook, etc.)
 */
export const SignInSocialMedia = async (provider: AuthProvider): Promise<UserCredential> => {
    try {
        const result = await signInWithPopup(auth, provider)
        return result
    } catch (error) {
        logging.error('Error during sign-in with social media.', NAMESPACE)
        throw error // Propager l'erreur pour une gestion en amont
    }
}

/**
 * Authentification d'un utilisateur auprès du backend avec Firebase UID et nom.
 * @param uid - UID de Firebase
 * @param name - Nom de l'utilisateur
 * @param fire_token - Jeton Firebase
 * @param callback - Fonction de rappel pour gérer la réponse
 */
export const Authenticate = async (uid: string, name: string, fire_token: string, callback: AuthCallback) => {
    try {
        let response = await axios.post<AuthResponse>(
            `${config.server.url}/users/login`,
            { uid, name },
            { headers: { Authorization: `Bearer ${fire_token}` } }
        )

        const successStatus = [200, 201, 304]
        if (successStatus.includes(response.status)) {
            logging.info('Successfully authenticated.', NAMESPACE)
            callback(null, response.data.user)
        } else {
            logging.warn('Unable to authenticate.', NAMESPACE)
            callback('Unable to authenticate.', null)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            logging.error(`Axios error: ${error.response?.status} - ${error.response?.statusText}`, NAMESPACE)
        } else {
            logging.error('Unknown error occurred during authentication.', NAMESPACE)
        }
        callback('Unable to authenticate.', null)
    }
}

/**
 * Validation du jeton Firebase auprès du backend.
 * @param fire_token - Jeton Firebase
 * @param callback - Fonction de rappel pour gérer la réponse
 */
export const Validate = async (fire_token: string, callback: AuthCallback) => {
    try {
        let response = await axios.get<AuthResponse>(
            `${config.server.url}/users/validate`,
            { headers: { Authorization: `Bearer ${fire_token}` } }
        )

        const successStatus = [200, 304]
        if (successStatus.includes(response.status)) {
            logging.info('Successfully validated.', NAMESPACE)
            callback(null, response.data.user)
        } else if (response.status === 401) {
            logging.warn('Token expired or unauthorized.', NAMESPACE)
            callback('Token expired.', null)
        } else {
            logging.warn('Unable to validate token.', NAMESPACE)
            callback('Unable to validate.', null)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            logging.error(`Axios error: ${error.response?.status} - ${error.response?.statusText}`, NAMESPACE)
        } else {
            logging.error('Unknown error occurred during token validation.', NAMESPACE)
        }
        callback('Unable to validate.', null)
    }
}

/**
 * Interface pour la réponse d'authentification et de validation.
 */
interface AuthResponse {
    user: IUser
}
