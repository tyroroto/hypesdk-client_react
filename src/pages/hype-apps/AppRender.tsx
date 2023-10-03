import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Alert, Container, Spinner} from "react-bootstrap";
import {getAppDataActive} from "../../libs/api-service";
import AppView from "../../hype/components/AppView";
import {IAppData} from "../../hype/classes/layout.interface";
import {AppModeType} from "../../libs/util";


const AppRender = () => {
    const [isReady, setIsReady] = useState(false)
    const [isHasError, setIsHasError] = useState('')
    const [appData, setAppData] = useState<IAppData>()
    const {slug} = useParams();
    useEffect(() => {
        if (slug != null && slug != '') {
            setIsReady(false);
            getAppDataActive(slug).then(result => {
                setAppData(result);
                setIsReady(true);
            }).catch(e => {
                setIsHasError(e.message);
                setIsReady(true);
            });
        }
    }, [slug])

    return (
        <>
            {
                isReady ?
                    <>
                        <div className='hype-application-wrapper'>
                            {
                                isHasError !== '' ? <Alert color='danger'>
                                    <div className='alert-body'>
                                        {/*<AlertCircle size={15}/>{' '}*/}
                                        <span className='ms-1'>
            we has some problem to get data [{isHasError}]
          </span>
                                    </div>
                                </Alert> : null
                            }

                            {
                                appData != null ? <div className='content-body'>
                                        <AppView onAction={() => {
                                        }} mode={AppModeType.NORMAL} initAppData={appData}/>
                                    </div>
                                    : null
                            }

                        </div>
                    </>
                    :
                    <Container>
                        <div className={'mt-5 text-center'}>
                            <h2>Loading Application</h2>
                            <Spinner className={'mt-3 '} animation="grow" variant="dark"/>
                        </div>
                    </Container>

            }
        </>
    )
}

export default AppRender
