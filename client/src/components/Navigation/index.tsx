import { Navbar, NavbarBrand, Container, Nav } from "reactstrap";
import { Link } from "react-router-dom";

const Navigation: React.FunctionComponent = () => {
    return (
        <Navbar color="light" light sticky='top' expand="md">
            <Container>
                <NavbarBrand tag={Link} to="/">📜</NavbarBrand> {/* Utiliser Link au lieu de "link" */}
                <Nav className="mr-auto" navbar /> 
            </Container>
        </Navbar>
    )
}
export default Navigation;
