// ** React Imports
import {useCallback, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Controller} from 'react-hook-form'
// ** Reactstrap Imports
import hypeLogo from '../../assets/hypelogo.png'

// ** Styles
// import '@styles/react/pages/page-authentication.scss'
import {useForm} from "react-hook-form";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Select from "react-select";
import {Database} from "react-feather";
import useBoundStore from "../../stores";
import {getHomeRouteForLoggedInUser} from "../../libs/util";


const defaultValues = {
    password: '',
    loginEmail: 'admin'
}

const Login = () => {
    // ** Hooks
    const navigate = useNavigate()
    const apiUrl = useBoundStore(state => state.app.apiUrl)
    const getAppInfo = useBoundStore(state => state.app.getAppInfo)
    const setApiUrl = useBoundStore(state => state.app.setApiUrl)
    const appInfo = useBoundStore(state => state.app.appInfo)
    const authStore = useBoundStore(state => state.auth)
    const [showRemoteSetting, setShowRemoteSetting] = useState(false);
    const {
        control,
        setError,
        handleSubmit,
    } = useForm({defaultValues})
    //     source = logo
    const [errorMessage, setErrorMessage] = useState('');
    const [remoteApiProtocol, setRemoteApiProtocol] = useState('https://');
    const [remoteApiUrl, setRemoteApiUrl] = useState('');

    useEffect(() => {
        if (apiUrl != null) {
            setShowRemoteSetting(false)
        } else {
            setShowRemoteSetting(true)
        }
    }, [apiUrl])

    useEffect(() => {
        console.log(authStore)
        if (authStore.user != null && Object.keys(authStore.user).length > 0) {
            console.log('authStore.userData', authStore.user)
            console.log('getHomeRouteForLoggedInUser(authStore.user.role)', getHomeRouteForLoggedInUser(authStore.user.roles[0].slug))
            navigate(getHomeRouteForLoggedInUser(authStore.user.roles[0].slug))
        }
    }, [authStore.user])


    const onSubmit = (data: any) => {
        if (Object.values(data).every((field: any) => field.length > 0)) {
            // console.log(data.loginEmail, data.password)
            authStore.login(data.loginEmail, data.password)
                .then( () => {
                    authStore.fetchProfile().catch( e => console.error(e))
                })
                .catch( e => console.error(e))
        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: 'manual'
                    })
                }
            }
        }
    }

    const protocolOptions = useCallback(() => [
        {
            label: 'http://',
            value: 'http://'
        },
        {
            label: 'https://',
            value: 'https://'
        }
    ], [])

    return (
        <div className='auth-wrapper auth-cover'>
            {!showRemoteSetting ?
                <>
                    <div className='d-flex m-0'>
                        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
                            {
                                // hypeStore && hypeStore.appInfo && hypeStore.appInfo.appIcon ? (
                                //     <img src={`${apiUrl}/form-data/viewfile/${hypeStore.appInfo.appIcon}`} height='28'
                                //          alt='logo'/>
                                // ) : (
                                <img height='62'
                                     src={hypeLogo} alt={'hype logo'}/>
                                // )
                            }

                        </Link>
                       <div className={'ms-auto me-3'}>
                           <Button size={'sm'} variant={'outline-primary'} className={'mt-3 me-3'}
                                   onClick={() => {
                                       setShowRemoteSetting(true);
                                   }
                                   }>
                               Change Remote URL
                               <Database className={'ms-1'} size={17}/>
                           </Button>
                       </div>
                    </div>
                    <Row className='page-login-body m-0'>
                        <Col className='d-none d-lg-flex align-items-center p-2' lg={8} sm={12}>
                            <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
                                <img className='img-fluid'
                                     src={appInfo && appInfo.loginImage ? `${apiUrl}/form-data/viewfile/${appInfo?.loginImage}` : hypeLogo}
                                     alt='Login Cover'/>
                            </div>
                        </Col>

                        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg={4} sm={12}>
                            <Row className={'w-100'}>
                                <Col className='px-xl-2 mx-auto' sm={12} md={12} lg={12}
                                     style={{width: '100%'}}
                                >
                                    <Card.Title className=' mb-1'>
                                        {appInfo && appInfo.loginTitle ? appInfo.loginTitle : 'Welcome to Hype Client!'}

                                    </Card.Title>
                                    <Card.Text>
                                        {appInfo && appInfo.loginSubTitle ? appInfo.loginSubTitle : 'Please sign-in to your account and start the adventure'}

                                    </Card.Text>
                                    <Form className='mt-2' onSubmit={handleSubmit(onSubmit)}>
                                        <div className='mb-1'>
                                            <Form.Label className='form-label' for='login-email'>
                                                Username
                                            </Form.Label>
                                            <Controller
                                                // id='loginEmail'
                                                name='loginEmail'
                                                control={control}
                                                render={({field}) => (
                                                    <Form.Control
                                                        autoFocus
                                                        type='text'
                                                        placeholder='john@example.com'
                                                        // invalid={errors.loginEmail && true}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className='mb-1'>
                                            <div className='d-flex justify-content-between'>
                                                <Form.Label className='form-label' for='login-password'>
                                                    Password
                                                </Form.Label>
                                                <Link to='/forgot-password'>
                                                    <small>Forgot Password?</small>
                                                </Link>
                                            </div>
                                            <Controller
                                                // id='password'
                                                name='password'
                                                control={control}
                                                render={({field}) => (
                                                    <Form.Control type={'password'} className='input-group-merge'
                                                        // invalid={errors.password && true}
                                                                  {...field} />
                                                )}
                                            />
                                        </div>
                                        {errorMessage ? <p className={'text-danger'}>{errorMessage}</p> : null}
                                        <Button type='submit' className={'mt-2 w-100'} color='primary'>
                                            Sign in
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
                :
                <Container>
                    <div className={'text-center mt-3'}>
                        <img className={'ms-auto'} width={'100%'} style={{maxWidth: '30em'}}
                             src={hypeLogo} alt={'hype logo'}/>
                    </div>
                    <hr/>
                    <h1 className={'mt-2'}>
                        Setup Remote
                    </h1>
                    <p>
                        for start using Hype Client
                        Please assign remote api url to active.
                    </p>
                    <a href={'https://hypesdk.com/docs'}>How to find remote url?</a>
                    <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                        <div className={'d-flex'}>
                            <div className='mb-1 d-inline-block'>
                                <Form.Label className='form-label' for='remote-protocol'>
                                    Protocol
                                </Form.Label>
                                <Select
                                    onChange={(e) => {
                                        setRemoteApiProtocol(e?.value ?? '');
                                    }}
                                    defaultValue={protocolOptions().find(p => p.value === 'https://')}
                                    name={'remote-protocol'}
                                    options={protocolOptions()}
                                />
                            </div>
                            <div className='ms-1 flex-grow-1 d-inline-block'>
                                <Form.Label className='form-label' for='remote-url'>
                                    Remote URL
                                </Form.Label>
                                <Form.Control
                                    onChange={(e) => {
                                        setRemoteApiUrl(e.target.value);
                                    }}
                                    name={'remote-url'}
                                    type='text'
                                />
                            </div>
                        </div>

                        <div className={'text-xxl-center'}>
                            <Button size={'lg'} className={'mt-4 w-50'} onClick={() => {
                                getAppInfo(remoteApiProtocol + remoteApiUrl).then((r: any) => {
                                    if (r.error != null) {
                                        alert('Remote URL ไม่ถูกต้อง')
                                    } else {
                                        setApiUrl(remoteApiProtocol + remoteApiUrl);
                                        window.location.reload();
                                    }
                                });
                            }} color='primary'>
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Container>
            }

        </div>
    )
}

export default Login
