import {Container, Form} from "react-bootstrap";
import {Button, Col, Row} from "reactstrap";
import {PageCard} from "../../hype/components/PageCard";
import {useQuery} from "react-query";
import {fetchProfile} from "../../libs/axios";

const PageAccount = () => {
    const {data} = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile
    })
    return (
        <>
            <Container>
                <Row>
                    <Col xs={12} md={2}>
                    </Col>
                    <Col xs={12} md={8}>
                        <PageCard>
                            <h4>Account</h4>
                            <Form className={'mb-4'}>
                                {data != null ?
                                    <>
                                        <Form.Group className={'mb-2'} controlId="accountUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control defaultValue={data.data.username} readOnly={true}
                                                          type={'text'}></Form.Control>
                                        </Form.Group>
                                        <Form.Group className={'mb-2'} controlId="accountEmail">
                                            <Form.Label className={'me-2'}>Email</Form.Label>
                                            <Form.Control
                                                defaultValue={data.data.email}
                                                readOnly={true} className={'me-2'} disabled
                                                          type={'email'}></Form.Control>
                                        </Form.Group>
                                        {/*<Button>Change</Button>*/}
                                    </>
                                    : null
                                }


                            </Form>

                            <h4>Password</h4>
                            <Form>
                                <Form.Group controlId="newPassword">
                                    <Form.Label>New password</Form.Label>
                                    <Form.Control type={'password'}></Form.Control>
                                </Form.Group>
                                <Form.Group className={'mb-2'} controlId="newPasswordConfirm">
                                    <Form.Label>Confirm new password</Form.Label>
                                    <Form.Control type={'password'}></Form.Control>
                                </Form.Group>
                                <div>
                                    <Button color={'primary'}>Change password</Button>
                                </div>
                            </Form>
                        </PageCard>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default PageAccount;
