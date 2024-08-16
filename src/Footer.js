import { Container, Row, Col } from 'react-bootstrap';
function Footer(){

    return(
        <Container>
            <Row className='justify-content-center'>
                <p>{new Date().getFullYear()} - GWOrg</p>
            </Row>
        </Container>
    );
}

export default Footer;