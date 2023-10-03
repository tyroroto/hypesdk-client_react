import {useQuery} from "react-query";
import {fetchFormRecords} from "../libs/axios";
import {Button, Card, Container} from "react-bootstrap";
import React from "react";
import {Link} from "react-router-dom";


/**
 * Example Page for starter
 */
export const PageNote = () => {
    const recordDataQuery = useQuery<any, any>([`/forms/16/records`],
        () => {
            return fetchFormRecords(16, {})
        }
    );
    const urlParams = new URLSearchParams({redirect: '/notes'});

    return <>
        <Container className={'pt-3'}>
            {
                recordDataQuery.status == 'success' &&
                recordDataQuery.data.data?.map((record: any) => {
                    return <Card key={record.id} className={'mb-2'}>
                        <Card.Body>
                            <h5>{record.id} - {record?.title}</h5>
                            <div>
                                {record?.story}
                            </div>
                        </Card.Body>
                    </Card>
                })
            }

            <Link to={`/hype-forms/note/records?${urlParams.toString()}`}>
            <Button variant={'primary'}>Add</Button>
            </Link>
        </Container>

    </>
}