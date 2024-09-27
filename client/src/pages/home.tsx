import { Container } from "reactstrap";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import IpageProps from "../interfaces/pages";

const HomePage: React.FunctionComponent<IpageProps> = props => {
    return(
        <Container fluid className="p-0">
            <Navigation/>
            <Header
                headline="Un blog en react"
                title="Je test des trucs"
            />
            <Container className="mt-5">
                Du contenu
            </Container>
        </Container>
    )
}
export default HomePage