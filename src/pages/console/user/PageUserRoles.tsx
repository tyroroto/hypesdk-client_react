import {useCallback, useEffect, useState} from "react";
import axiosInstance, {applyRolePermission, applyUserRoles, createRole} from "../../../libs/axios";
import {Link, useParams} from "react-router-dom";
import ConsoleTable from "../../../hype/components/ConsoleTable";
import {Button, Container, Form, Offcanvas} from "react-bootstrap";
import {ExternalLink, Trash2} from "react-feather";
import {useQuery, useQueryClient} from "react-query";
import {useForm, Controller} from "react-hook-form";
import Select from "react-select";
import {Cell} from "react-table";


const PageUserRoles = () => {
    const {userId} = useParams();

    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()
    const {register, control, handleSubmit} = useForm<{ role: number }>();
    const onSubmit = async (data: any) => {
        if (userId != null) {
            await applyUserRoles(parseInt(userId), [{id: data.role.value, val: true}])
            await queryClient.invalidateQueries([`userRoles/${userId}`])
        }
    };

    const removeAssignedRole = useCallback(async (pid: number) => {
        if (userId != null) {
            await applyUserRoles(parseInt(userId), [{id: pid, val: false}])
            await queryClient.invalidateQueries([`userRoles/${userId}`])
        }

    }, [userId, applyRolePermission])

    const roleQuery = useQuery({
        queryKey: ['selectRoles'],
        queryFn: async () => {
            const response = await axiosInstance.get(`/admin/roles`)
            return response.data.data.map((p: any) => (
                {
                    label: `${p.name} (${p.slug})`,
                    value: p.id
                }
            ))
        },
    });

    const query = useQuery({
        queryKey: [`userRoles/${userId}`],
        queryFn: async () => {
            const response = await axiosInstance.get(`/admin/users/${userId}`)
            return response.data.user.userRoles;
        },
    });


    const columns = useCallback(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Role Name',
                accessor: 'name',
                Cell: (cell: any) => (
                    <>
                        <span></span>
                        <div>
                            {cell.row.original.name}
                        </div>
                        <div className={'text-muted'}>
                            {cell.row.original.slug}
                        </div>
                    </>
                )
            },
            {
                Header: 'Create At',
                accessor: 'createdAt',
                Cell: (cell: Cell<any>) => (
                    <div className={'text-center'}>
                        {new Date(cell.row.original.UserRoles.createdAt).toLocaleString()}
                    </div>
                )
            },
            {
                Header: 'Action',
                Cell: (cell: any) => (
                    <div className={'text-center'}>
                        <Button
                            size={'sm'} className={'text-dark'} variant={'link'}>
                            <ExternalLink size={22}/>
                        </Button>
                        <Button
                            onClick={() => {
                                removeAssignedRole(cell.row.values.id).catch(e => console.error(e))
                            }}
                            size={'sm'} className={'text-dark'} variant={'link'}>
                            <Trash2 size={22}/>
                        </Button>
                    </div>
                )
            },
        ],
        []
    );

    return <>
        <Offcanvas backdrop="static" onHide={handleCreateCanvasClose} show={showCreateCanvas} scroll={true}
                   placement={"end"}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Assign roles</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>
                            Select Role
                        </Form.Label>
                        <Controller
                            control={control}
                            name="role"
                            render={
                                ({field}) =>
                                    <Select
                                        {...field}
                                        options={roleQuery.data ?? []}
                                        isClearable={true}
                                        className={'react-select'}
                                    />
                            }
                        />


                    </Form.Group>
                    <div className={'text-center'}>
                        <Button className={'w-75'} size={'lg'} variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
        <Container fluid={true}>
            <div className={'page-card'}>
                <h4 className={'mb-4'}>User&apos;s roles</h4>
                <ConsoleTable data={query.data ?? []}
                              onCreateClick={() => setShowCreateCanvas(true)}
                              columns={columns()}/>
            </div>
        </Container>
    </>

}

export default PageUserRoles;