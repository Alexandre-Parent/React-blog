import { createContext } from 'react';  // Correct the import from 'react'
import IUser, { DEFAULT_FIRE_TOKEN, DEFAULT_USER } from "../interfaces/userInterface"

// Define IUserState and IUserActions
export interface IUserState {
    user: IUser;
    fire_token: string;
}

export interface IUserActions {
    type: 'login' | 'logout'
    payload: IUserState
}

// Define the initial user state
export const initialUserState: IUserState = {
    user: DEFAULT_USER,
    fire_token: DEFAULT_FIRE_TOKEN
};

// Define the reducer for user state management
export const userReducer = (state: IUserState, action: IUserActions): IUserState => {
    let user = action.payload.user
    let fire_token = action.payload.fire_token

    switch (action.type) {
        case 'login':
            localStorage.setItem('firetoken', fire_token)
            return { user, fire_token }

        case 'logout':
            return initialUserState

        default:
            return state
    }
};

// Define IUserContextProps
export interface IUserContextProps {
    userState: IUserState
    userDispatch: React.Dispatch<IUserActions>
}

// Create the UserContext with initial state and a dummy dispatch function
const UserContext = createContext<IUserContextProps>({
    userState: initialUserState,
    userDispatch: () => {} // This is just a placeholder
});

// Export the Consumer and Provider from UserContext
export const UserContextConsumer = UserContext.Consumer
export const UserContextProvider = UserContext.Provider
export default UserContext