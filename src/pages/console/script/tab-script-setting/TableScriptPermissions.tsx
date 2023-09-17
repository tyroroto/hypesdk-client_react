import {useCallback, useState} from "react";
import {Button, Form, Offcanvas} from "react-bootstrap";
import {Trash2} from "react-feather";
import {useQuery, useQueryClient} from "react-query";
import {useForm, Controller} from "react-hook-form";
import Select from "react-select";
import axiosInstance, {applyFormPermission, applyScriptPermission, fetchScript} from "../../../../libs/axios";
import ConsoleTable from "../../../../hype/components/ConsoleTable";


const TableScriptPermissions = (props: { scriptId: number }) => {
    const {scriptId} = props;
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()
    const {control, handleSubmit} = useForm<{
        permission: number,
    }>();
    const onSubmit = async (data: {
        permission: { value: number },
        val: boolean,
    } | any) => {
        if (scriptId != null) {
            await applyScriptPermission(scriptId, [{id: data.permission.value, val: true}])
            await queryClient.invalidateQueries([`scripts/${scriptId}`])
        }
    };

    const removePermission = useCallback(async (pid: number) => {
        if (scriptId != null) {
            console.log('pid', pid)
            await applyScriptPermission(scriptId, [{id: pid, val: false}])
            await queryClient.invalidateQueries([`scripts/${scriptId}` ])
        }
    }, [scriptId, applyScriptPermission])

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
        queryKey: [`scripts/${scriptId}`],
        queryFn: async () => {
            if (scriptId == null) throw new Error('scriptQuery need id')
            return fetchScript(scriptId)
        },
    });

    const columns = useCallback(
        () => [
            {
                Header: 'Permission Name',
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
                Header: 'Type',
                accessor: 'permissionType',
                Cell: (cell: any) => (
                    <div className={'text-center'}>
                        {cell.row.values.permissionType}
                    </div>
                )
            },
            {
                Header: 'Grant',
                accessor: 'grant',
                Cell: (cell: any) => (
                    <div className={'text-center'}>
                        {cell.row.values.grant}
                    </div>
                )
            },
            {
                Header: 'Create At',
                accessor: 'createdAt',
                Cell: (cell: any) => (
                    <div className={'text-center'}>
                        {new Date(cell.row.values.createdAt).toLocaleString()}
                    </div>
                )
            },
            {
                Header: 'Action',
                Cell: (cell: any) => (
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
        <div>
            <h5 className={'mb-2'}>Script&apos;s permissions</h5>
        </div>
        <ConsoleTable data={query.data?.permissions ?? []}
                      createButtonLabel={'Assign'}
                      onCreateClick={() => setShowCreateCanvas(true)}
                      columns={columns()}/>
    </>

}

export default TableScriptPermissions;