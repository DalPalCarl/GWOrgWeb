import { Button, Col, Row, Container } from "react-bootstrap";

function Header(){

    return(
        <Container>
            <Row className="justify-content-center">
                <Col ><h1>GWOrg</h1></Col>
                <Col>
                    <Button>Add</Button>
                    <Button>Import</Button>
                    <Button>Delete</Button>
                </Col>
            </Row>
            
        </Container>
    );
}

export default Header;