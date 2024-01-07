import {Link, NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useBoundStore from "../stores";
import {Dropdown, Button, Container, Nav, Navbar} from "react-bootstrap";
import {
    Bell, Box,
    ChevronDown,
    ChevronRight,
    Circle,
    File,
    Grid, Hash,
    Shield,
    Terminal,
    Tool,
    User,
    X
} from "react-feather";
import {getHomeRouteForLoggedInUser} from "../libs/util";

function LayoutAuth() {
    const [showSidebar, setShowSidebar] = useState(true);
    const authStore = useBoundStore(state => state.auth)
    const username = useBoundStore((state) => state.auth.user?.username);
    const appStore = useBoundStore((state) => state.app);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect( () => {

        if(!authStore.sliceInit){
            authStore.init();
        }

        if(authStore.sliceInit && authStore.user == null){
            window.location.href = '/login'
        }

        if(authStore.sliceInit && authStore.user != null) {
            const homePath = getHomeRouteForLoggedInUser(authStore.user.roles);
            if (location.pathname == '/') {
                navigate(homePath)
            }
        }
    }, [authStore, location])
    return (<>

        <div className={`d-flex auth-layout ${showSidebar ? '' : 'collapse'}`}>
            <div className={`flex-shrink-0 p-3 bg-white side-menu `}>
                <div className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                    <svg className="bi me-2" width="30" height="24">
                    </svg>
                    <span className="fs-2 text-primary" style={{fontWeight: 500}}>{appStore.appInfo?.appName ?? 'HypeSDK'} </span>
                    <Button onClick={() => {
                        setShowSidebar(!showSidebar);
                    }} className={'ms-auto'} size={'sm'} variant={'link'}>
                        {
                            showSidebar ?
                                <X/>
                                :
                                <ChevronRight/>
                        }
                    </Button>
                </div>
                <ul className="list-unstyled ps-0">
                    <li className="mb-1 d-none">
                        <NavLink to="/hype-apps/main" className="link-dark rounded">
                            {({isActive}) => (
                                <button className={`p-2 text-start w-100 btn rounded ${isActive ? 'btn-primary' : ''}`}>
                                    <Grid></Grid> Dashboard
                                </button>
                            )}
                        </NavLink>
                    </li>
                    <li className="mb-1 d-none">
                        <NavLink to="/hype-apps/noti" className="link-dark rounded">
                            {({isActive}) => (
                                <button className={`p-2 text-start w-100 btn rounded ${isActive ? 'btn-primary' : ''}`}>
                                    <Bell></Bell> Notification
                                </button>
                            )}
                        </NavLink>
                    </li>
                    {/*<hr/>*/}

                    <li className=" mt-4">
                        <div className="p-2 text-start w-100 rounded ">
                            <h5><Terminal></Terminal> Admin Consoles</h5>
                        </div>
                    </li>
                    <li className="mb-1">
                        <NavLink to="/console/forms" className="link-dark rounded">
                            {({isActive}) => (
                                <button className={`p-2 text-start w-100 btn rounded ${isActive ? 'btn-primary' : ''}`}>
                                    <File strokeWidth={2.5} size={20}></File> Form Management
                                </button>
                            )}
                        </NavLink>
                    </li>
                    <li className="mb-1">
                        <NavLink to="/console/scripts" className="link-dark rounded">
                            {({isActive}) => (
                                <button className={`p-2 text-start w-100 btn rounded ${isActive ? 'btn-primary' : ''}`}>
                                    <Hash strokeWidth={2.5} size={20}></Hash> Script Management
                                </button>
                            )}
                        </NavLink>
                    </li>
                    <li className="mb-1">
                        <div
                             className="fw-light position-relative text-start w-100 p-2 rounded ">
                            <Shield strokeWidth={2} size={20}></Shield> Role & Permission <ChevronDown
                            className={'position-absolute'} style={{right: 10}} size={20}/>
                        </div>
                    </li>
                    <li className="mb-1">
                        <NavLink to="/console/roles" className="link-dark rounded">
                            {({isActive}) => (
                                <button
                                    className={`text-start w-100 btn rounded ps-4 ${isActive ? 'btn-primary' : ''}`}>
                                    <Circle strokeWidth={2.5} size={14} className={'me-1'}></Circle>
                                    Roles
                                </button>
                            )}
                        </NavLink>
                    </li>
                    <li className="mb-1">
                        <NavLink to="/console/permissions" className="link-dark rounded">
                            {({isActive}) => (
                                <button
                                    className={`text-start w-100 btn rounded ps-4 ${isActive ? 'btn-primary' : ''}`}>
                                    <Circle strokeWidth={2.5} size={14}  className={'me-1'}></Circle>
                                    Permissions
                                </button>
                            )}
                        </NavLink>
                    </li>

                    <li className="mb-1">
                        <NavLink to="/console/users" className="link-dark rounded">
                            {({isActive}) => (
                                <button className={`p-2 text-start w-100 btn rounded ${isActive ? 'btn-primary' : ''}`}>
                                    <User></User> Manage Users
                                </button>
                            )}
                        </NavLink>
                    </li>
                    {/*<li className="mb-1">*/}
                    {/*    <NavLink to="/console/project-setting" className="link-dark rounded">*/}
                    {/*        {({isActive}) => (*/}
                    {/*            <button className={`p-2 text-start w-100 btn rounded ${isActive ? 'btn-primary' : ''}`}>*/}
                    {/*                <Tool strokeWidth={2} size={20}></Tool> Project Setting*/}
                    {/*            </button>*/}
                    {/*        )}*/}
                    {/*    </NavLink>*/}
                    {/*</li>*/}

                    <li className="border-top my-3"></li>

                </ul>
            </div>
            <div className={'w-100 page-body'}>
                <Navbar bg="white" variant={'light'} expand="lg">
                    <Container fluid>
                        <div className={'me-auto d-flex align-items-center'}>
                            <Button onClick={() => {
                                setShowSidebar(!showSidebar);
                            }}  size={'sm'} variant={'link'}>
                                {
                                    showSidebar ?
                                        <></>
                                        :
                                        <ChevronRight size={28}/>
                                }
                            </Button>

                            {
                                !showSidebar ?
                                    <div className={'text-primary'}>
                                        {appStore.appInfo?.appName}
                                    </div>
                                    : null
                            }

                        </div>


                        {/*<Navbar.Collapse id="basic-navbar-nav">*/}
                            <div className="d-flex align-items-center">
                                <Bell/>
                                <Dropdown className={'ms-2'}>
                                    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                                        {username}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.ItemText >
                                            <Link to={'/account'}>
                                                Account
                                            </Link>
                                        </Dropdown.ItemText>
                                        <Dropdown.Item onClick={() => {
                                            authStore.logout().then(() => {
                                                navigate('login', {replace: true});
                                            });
                                        }}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        {/*</Navbar.Collapse>*/}
                    </Container>
                </Navbar>
                <Outlet/>
            </div>

        </div>
    </>)
        ;
}

export default LayoutAuth;
