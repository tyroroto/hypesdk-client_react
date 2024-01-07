import {useMutation, useQuery, useQueryClient} from "react-query";
import axiosInstance, {createDevice, deleteForm, fetchFormRecords} from "../libs/axios";
import {Button, Card, Container} from "react-bootstrap";
import React, {useCallback, useMemo} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import Chart from 'react-apexcharts'

/**
 * Example Page for starter
 */
export const PageDashboard = () => {
    const mainFormId = 23;
    const dataPerDay = useQuery<any, any>([`/forms/${mainFormId}/records`],
        async () => {
            const response = await axiosInstance.post(`/scripts/exec-sql-script`, {
                slug: "data_request_perday"
            })
            return response.data

        }
    );

    const queryClient = useQueryClient()
    const sendCreateDevice = useMutation(() => {
        return createDevice({})
    }, {
        onMutate: variables => {
            const toastRef = toast.loading(`Creating ${variables}`, {id: 'create'})
            return {toastRef: toastRef}
        },
        onError: (error, variables, context) => {
            toast.error('Create failed')
        },
        onSuccess: async (data, variables, context) => {
            toast.success('Create success')
            await queryClient.invalidateQueries([`/forms/${mainFormId}/records`])
        },
        onSettled: (data, error, variables, context) => {
            toast.dismiss('create')
        },
    })

    const urlParams = new URLSearchParams({redirect: '/console/devices'});
    const navigate = useNavigate()

    const state = useMemo(() => {
        const arrayLast7Days = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date
        }).reverse();

        const chart: any = {
            options: {
                chart: {
                    id: 'apexchart-example'
                },
                xaxis: {
                    categories: []
                }
            },
            series: [{
                name: 'series-1',
                data: []
            }]
        }
        if (dataPerDay.status == "success") {
            chart.options.xaxis.categories = arrayLast7Days.map((date: Date) => date.toLocaleDateString())
            chart.series[0].data = arrayLast7Days.map((date: Date) => {
                // dataPerDay.data.data example [{date: '2024-01-06', count: 1}]
                // format date to 2024-01-06
                const formattedDate = date.toISOString().split('T')[0]
                console.log(formattedDate)
                const found = dataPerDay.data.data.find((p: any) => formattedDate == p.date)
                return found ? found.count : 0
            })
        }
        return chart
    }, [dataPerDay]);

    return <>
        <Container className={'pt-3'}>
            <h1 style={{fontSize:64}}>
                <b>
                    Data Collector Service
                </b>
            </h1>
            <Card style={{width: 220}}>
                <Card.Header>
                    Devices
                </Card.Header>
                <Card.Body className={'text-end'}>
                    <Card.Title style={{fontSize: 48}}>
                        <b>
                            32
                        </b>
                    </Card.Title>
                </Card.Body>
                <Card.Footer className={'text-end'}>
                    <Link to={'/console/devices'}>
                        <Button size={'sm'}>More info</Button>
                    </Link>
                </Card.Footer>
            </Card>
            <Card className={'mt-2'} style={{
                width: 540
            }}>
                <Card.Header>
                    Request Per Day
                </Card.Header>
                <Card.Body>
                    {
                        dataPerDay.status == 'success' ?
                            <Chart options={state.options} series={state.series} type="bar" width={500} height={320}/>
                            : <div>
                                Loading...
                            </div>
                    }
                </Card.Body>
                <Card.Footer className={'text-end'}>
                    <Link to={'/console/devices'}>
                        <Button size={'sm'}>More info</Button>
                    </Link>
                </Card.Footer>
            </Card>

        </Container>

    </>
}