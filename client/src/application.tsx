import { Route, Routes } from 'react-router-dom';
import routes from "./config/routes";

export interface IApplicationsProps {}

const Application: React.FunctionComponent<IApplicationsProps> = props => {
    return (
        <Routes>
            {routes.map((route, index) => {
                return (
                    <Route 
                        key={index}
                        path={route.path}
                        element={<route.component />}
                    />
                )
            })}
        </Routes>
    )
}

export default Application;
