
import {useEffect, useState} from "react";
import axiosInstance from "../../../libs/axios";
import {Container} from "react-bootstrap";
import {useParams} from "react-router-dom";

interface UserInterface {
    username: string,
    fullname: string
    id: number;
}

const PageUserDetail = () => {
    const [userData, setUserData] = useState<UserInterface | null>(null);
    const {uid} = useParams();

    useEffect(() => {
        axiosInstance.get('/admin/users/' + uid).then((response) => {
            if (response.status == 200) {
                setUserData(response.data);
            }
        })
    }, [uid])


    return <>
        <Container fluid={true}>
            <div className={'page-card'}>
                {
                    userData != null ?
                        <>
                            <h1>User Information</h1>
                            <h1>
                                ID: {userData.id}
                            </h1>
                            <h2>
                                Username: {userData.username}
                            </h2>
                            <h2>
                                fullname: {userData.fullname}
                            </h2>
                            <h1>Profile</h1>
                        </>
                        : null
                }
            </div>
        </Container>
    </>

}

export default PageUserDetail;