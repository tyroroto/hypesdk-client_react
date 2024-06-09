
import React, {useCallback, useEffect, useState} from "react";
import axiosInstance, {fetchProfile} from "../../../libs/axios";
import {Container, Form} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {Button, Col, Row} from "reactstrap";
import {PageCard} from "../../../hype/components/PageCard";
import {ExternalLink} from "react-feather";
import InputGroup from 'react-bootstrap/InputGroup';
import toast from "react-hot-toast";
import {useQuery, useQueryClient} from "react-query";
import {isAxiosError} from "axios";

interface UserInterface {
    username: string,
    email: string,
    id: number;
}
interface UserResponse {
    apiKeys: Array<any>
    user: UserInterface
}


const PageUserDetail = () => {
    const {uid} = useParams();
    const queryClient = useQueryClient()

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const generateApiKey = useCallback( () => {
        axiosInstance.post('/admin/users/' + uid + '/api-key').then((response) => {
            if (response.status == 201) {
                toast.success(`API Key created`)
                 queryClient.invalidateQueries(['users', uid])
            }
        })
    },[axiosInstance, uid] )

    const deleteApiKey = useCallback( (apiKey: string) => {
        axiosInstance.delete('/admin/users/' + uid + '/api-key/' + apiKey).then((response) => {
            if (response.status == 204) {
                toast.success(`API Key deleted`)
                 queryClient.invalidateQueries(['users', uid])
            }
        })
    },[axiosInstance, uid] )

    const userQuery = useQuery<UserResponse | null>({
        queryKey: ['users', uid],
        queryFn: async () => {
           const response = await axiosInstance.get('/admin/users/' + uid)
            if (response.status == 200) {
                return response.data;
            }
            return null
        },
    });

    const changePassword = useCallback( async () => {
        try {
            await axiosInstance.post('/admin/users/' + uid + '/password', {
                password: password,
            })
            toast.success(`Password changed`)
        }catch (e) {
            if(
                isAxiosError(e) && e.response?.data.message != null
            ){
                toast.error(e.response?.data.message);
            }
            if( e instanceof Error) {
                toast.error(e.message);
            }
        }
    }, [axiosInstance, uid, password]);

    return <>
        <Container>
            <Row>
                <Col xs={12} md={2}>
                </Col>
                <Col xs={12} md={8}>
                    <PageCard>
                        <h4>Account   <Button outline={true} color={'primary'}>Profile <ExternalLink/></Button> </h4>
                        <Form className={'mb-4'}>
                            {userQuery.data != null ?
                                <>
                                    <Form.Group className={'mb-2'} controlId="accountID">
                                        <Form.Label>ID</Form.Label>
                                        <Form.Control defaultValue={userQuery.data.user.id} readOnly={true}
                                                      type={'text'}></Form.Control>
                                    </Form.Group>
                                    <Form.Group className={'mb-2'} controlId="accountUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control defaultValue={userQuery.data.user.username} readOnly={true}
                                                      type={'text'}></Form.Control>
                                    </Form.Group>


                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            defaultValue={userQuery.data.user.email}
                                            type={'email'}></Form.Control>
                                        <Button color={'primary'} >
                                            Save
                                        </Button>
                                    </InputGroup>
                                </>
                                : null
                            }


                        </Form>

                        <h4>Password</h4>
                        <Form>
                            <Form.Group controlId="newPassword">
                                <Form.Label>New password</Form.Label>
                                <Form.Control
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                    name={'main-password'} type={'password'}></Form.Control>
                            </Form.Group>
                            <Form.Group className={'mb-2'} controlId="newPasswordConfirm">
                                <Form.Label>Confirm new password</Form.Label>
                                <Form.Control
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                    }}
                                    type={'password'}></Form.Control>
                            </Form.Group>
                            <div>
                                <Button
                                    type={'button'}
                                    disabled={
                                    password.length < 8 || password != confirmPassword
                                } color={'primary'}
                                        onClick={(e) => {
                                            changePassword().catch()
                                        }}
                                >Change password</Button>
                            </div>
                        </Form>
                    </PageCard>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={2}>
                </Col>
                <Col xs={12} md={8}>
                    <PageCard>
                        <h3>API Keys</h3>
                        <Button onClick={() => {generateApiKey()}} color={'primary'}>Generate</Button>
                        <ul className={'mt-2'}>

                            {
                                userQuery.data?.apiKeys.map((apiKey: any) => {
                                    return <li>
                                        <div className={'d-flex justify-content-between'}>
                                            <div>
                                                <h5>{apiKey.id}</h5>
                                                <p>{new Date(apiKey.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <Button onClick={() => {
                                                    deleteApiKey(apiKey.id)
                                                }}  color={'danger'}>Delete</Button>
                                            </div>
                                        </div>
                                        <hr/>
                                    </li>
                                })
                            }
                        </ul>
                    </PageCard>
                </Col>
            </Row>
        </Container>
    </>

}

export default PageUserDetail;