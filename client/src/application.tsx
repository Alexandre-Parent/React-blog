import { Route, Routes } from 'react-router-dom';
import routes from "./config/routes";
import { useEffect, useReducer, useState } from 'react';
import { initialUserState, userReducer, UserContextProvider } from './contextes/user';
import LoadingComponent from './components/LoadingComponent';
import AuthRoute from './components/AuthRoute';
import { Validate } from './modules/auth';
import logging from './config/logging';

export interface IApplicationsProps {}

const Application: React.FunctionComponent<IApplicationsProps> = () => {
    const [userState, userDispatch] = useReducer(userReducer, initialUserState);
    const [loading, setLoading] = useState<boolean>(true);

    /* Debug */
    const [authStage, setAuthStage] = useState<string>('Checking localstorage ...');

    useEffect(() => {
        setTimeout(() => {
            CheckLocalStorageForDatas();
        }, 1000);
    }, []);

    /* Check if there is a token */
    const CheckLocalStorageForDatas = () => {
        setAuthStage('Checking credentials ...');

        const fire_token = localStorage.getItem('firetoken');
        if (fire_token === null) {
            userDispatch({ type: 'logout', payload: initialUserState });
            setAuthStage('No credentials found');
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } else {
            return Validate(fire_token, (error, user)=>{
                if(error){
                    logging.error(error)
                    setAuthStage("User not valid ")
                    userDispatch({ type: 'logout', payload: initialUserState })
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                }
                else if (user){
                    setAuthStage("User connected ")
                    userDispatch({ type: 'login', payload: {user, fire_token} })
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                }
            })
        }
    };

    const userContextValues = {
        userState,
        userDispatch,
    };

    if (loading) {
        return <LoadingComponent>{authStage}</LoadingComponent>;
    }

    return (
        <UserContextProvider value={userContextValues}>
            <Routes>
                {routes.map((route, index) => {
                    if (route.auth) {
                        return (
                            <Route
                                path={route.path}
                                key={index}
                                element={
                                    <AuthRoute>
                                        <route.component />
                                    </AuthRoute>
                                }
                            />
                        );
                    }

                    return (
                        <Route
                            path={route.path}
                            key={index}
                            element={<route.component />}
                        />
                    );
                })}
            </Routes>
        </UserContextProvider>
    );
};

export default Application;
