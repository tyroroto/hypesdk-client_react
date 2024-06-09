import React, {useCallback, useState} from "react";
import axiosInstance, {
    applyFormPermission,
    fetchForm
} from "../../../../../../libs/axios";
import ConsoleStaticTable from "../../../../../../hype/components/ConsoleStaticTable";
import {Button, Form, Offcanvas} from "react-bootstrap";
import {Trash2} from "react-feather";
import {useQuery, useQueryClient} from "react-query";
import {useForm, Controller} from "react-hook-form";
import {FormInterface} from "../../../../../../hype/classes/form.interface";
import {PermissionGrantType} from "../../../../../../hype/classes/constant";
import Select from "react-select";


const TableFormPermissions = (props: { formId: number }) => {
    const {formId} = props;
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const [publicAccess, setPublicAccess] = useState<boolean>(false);
    const [publicGrant, setPublicGrant] = useState<PermissionGrantType | undefined>();
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()
    const {
        watch,
        control, handleSubmit} = useForm<{
        permission: number,
        grant: { label: string, value: string }
    }>();

    const watchPermission = watch('permission');
    const watchGrant = watch('grant');

    const onSubmit = async (data: {
        permission: { value: number },
        val: boolean,
        grant: string
    } | any) => {
        if (formId != null) {
            await applyFormPermission(formId,
                [{id: data.permission.value, val: true, grant: data.grant.value}])
            await queryClient.invalidateQueries([`forms`, formId])
        }
    };

    const removePermission = useCallback(async (pid: number, grant: PermissionGrantType) => {
        if (formId != null) {
            await applyFormPermission(formId,
                [{id: pid, grant, val: false}])
            await queryClient.invalidateQueries([`forms`, formId])
        }
    }, [formId, applyFormPermission])

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

    const query = useQuery<FormInterface>(
        [`forms`, formId],
        () => {
            if (formId == null) {
                throw new Error('id params not exist')
            }
            return fetchForm(formId, {layout_state: 'DRAFT'})
        }
    );


    const columns = useCallback(
        () => [
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
                header: 'Grant',
                accessorKey: 'grant',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        {cell.row.original.grant}
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
                                removePermission(cell.row.original.id, cell.row.original.grant).catch(e => console.error(e))
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

                        <br/>
                        <Form.Label>
                            Grant
                        </Form.Label>
                        <Controller
                            control={control}
                            name="grant"
                            render={
                                ({field}) =>
                                    <Select
                                        {...field}
                                        options={
                                            [
                                                {label: 'Access only form', value: 'ACCESS_FORM'},
                                                {label: 'Access Create', value: 'CREATE'},
                                                {label: 'Access Create Update (self data)', value: 'READ_EDIT'},
                                                {label: 'Access Create Update Delete (self data)', value: 'READ_EDIT_DELETE'},
                                                {label: 'Access Read (all data)', value: 'READ_ONLY_ALL'},
                                                {label: 'Access Create Update (all data)', value: 'READ_EDIT_ALL'},
                                                {label: 'Access Create Update Delete (all data)', value: 'READ_EDIT_DELETE_ALL'},
                                                // {label: 'CUSTOM', value: 'CUSTOM'}
                                            ]}
                                        isClearable={true}
                                        className={'react-select'}
                                    />
                            }
                        />


                    </Form.Group>
                    <div className={'text-center'}>
                        <Button disabled={watchPermission == null || !watchGrant == null} className={'w-75'} size={'lg'} variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
        <div>
            <h5 className={'mb-2'}>Form and data Access permissions</h5>
        </div>

        <div className={'mb-4'}/>
        <ConsoleStaticTable data={query.data?.permissions ?? []}
                      createButtonLabel={'Assign'}
                      onCreateClick={() => setShowCreateCanvas(true)}
                      columns={columns()}/>
    </>

}

export default TableFormPermissions;