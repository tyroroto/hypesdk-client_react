import {useCallback, useState} from "react";
import axiosInstance, {applyRolePermission, createRole} from "../../../libs/axios";
import {useParams} from "react-router-dom";
import ConsoleStaticTable from "../../../hype/components/ConsoleStaticTable";
import {Button, Container, Form, Offcanvas} from "react-bootstrap";
import {Trash2} from "react-feather";
import {useQuery, useQueryClient} from "react-query";
import {useForm, Controller} from "react-hook-form";
import Select from "react-select";


const PageRolePermissions = () => {
    const {id} = useParams();

    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()
    const {register, control, handleSubmit} = useForm<{ permission: number }>();
    const onSubmit = async (data: any) => {
        if (id != null) {
            await applyRolePermission(parseInt(id), [{id: data.permission.value, val: true}])
            await queryClient.invalidateQueries([`rolePermissions/${id}`])
        }
    };

    const removePermission = useCallback(async (pid: number) => {
        if (id != null) {
            await applyRolePermission(parseInt(id), [{id: pid, val: false}])
            await queryClient.invalidateQueries([`rolePermissions/${id}`])
        }

    }, [id, applyRolePermission])

    const permissionQuery = useQuery({
        queryKey: ['selectPermissions'],
        queryFn: async () => {
            const response = await axiosInstance.get(`/admin/permissions`)
            return response.data.data.map((p: any) => (
                {
                    label: `${p.name} (${p.slug})`,
                    value: p.id
                }
            ))
        },
    });

    const query = useQuery({
        queryKey: [`rolePermissions/${id}`],
        queryFn: async () => {
            const response = await axiosInstance.get(`/admin/roles/${id}`)
            return response.data;
        },
    });


    const columns = useCallback(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Permission Name',
                accessorKey: 'name',
                cell: (cell: any) => (
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
                header: 'Type',
                accessorKey: 'permissionType',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        {cell.row.original.permissionType}
                    </div>
                )
            },
            {
                header: 'Create At',
                accessorKey: 'createdAt',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        {new Date(cell.row.original.createdAt).toLocaleString()}
                    </div>
                )
            },
            {
                header: 'Action',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        <Button
                            onClick={() => {
                                removePermission(cell.row.original.id).catch(e => console.error(e))
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
                <Offcanvas.Title>Assign permission</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>
                            Select Permission
                        </Form.Label>
                        <Controller
                            control={control}
                            name="permission"
                            render={
                                ({field}) =>
                                    <Select
                                        {...field}
                                        options={permissionQuery.data ?? []}
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
                <h4 className={'mb-4'}>Role&apos;s permissions</h4>
                <ConsoleStaticTable data={query.data?.permissions ?? []}
                              onCreateClick={() => setShowCreateCanvas(true)}
                              columns={columns()}/>
            </div>
        </Container>
    </>

}

export default PageRolePermissions;