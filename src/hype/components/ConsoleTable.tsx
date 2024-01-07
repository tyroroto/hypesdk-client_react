import {TableInstance, usePagination, UsePaginationInstanceProps, UsePaginationState, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import {Button, ButtonGroup, Card, Form} from "react-bootstrap";
import {ReactElement, useCallback} from "react";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ZoomIn} from "react-feather";

type TableInstanceWithHooks<T extends object> = TableInstance<T> &
    UsePaginationInstanceProps<T> &
    {
        state: UsePaginationState<T>;
    };

const ConsoleTable = (props: {
    disableCreateButton? : boolean,
    createButtonLabel?: ReactElement | string,
    onCreateClick?: () => void,
    columns: any,
    data: any,
}) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,

        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize},
    } = useTable({
            columns: props.columns,
            data: props.data,
        },
        usePagination
    ) as TableInstanceWithHooks<any>

    const handleCreateButton = useCallback(() => {
        if (props.onCreateClick != null) {
            props.onCreateClick()
        }
    }, [props.onCreateClick])
    // Render the UI for your table
    return (
        <>
            {
                props.disableCreateButton != true ?        <Button variant={'success'}
                                                             className={'mb-3'}
                                                             onClick={() => {
                                                                 handleCreateButton()
                                                             }}>
                    {props.createButtonLabel ?? 'Create'}
                </Button> : null
            }


            <div className={'d-flex mb-2 flex-column flex-sm-row'}>
                <div className={'d-flex align-items-center'}>
                    <Form.Select
                        className={'d-inline-block me-1'}
                        style={{height: 30, width: 120, fontSize: 14}}
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </Form.Select>

                    <div className={'d-inline-block'} style={{fontSize: 12, color: '#6C757D'}}>
                        <div>
                            Page {pageIndex + 1} of {pageOptions.length}
                        </div>
                        Showing {pageIndex + 1}-{(pageIndex+1) * pageSize} of {props.data.length} items.
                    </div>
                </div>
                <div className={'ms-auto d-flex align-items-center d-none'}>
                    <Form.Control style={{height: 30}} placeholder={'Search'}></Form.Control>
                    <Button style={{width: 40, height: 35}} className={'p-0 ms-1'} variant={'outline-primary'}>
                        <Search size={20}/>
                    </Button>
                </div>
            </div>


            <Card style={{overflowX: 'scroll'}}>
                <div className={'console-table-wrapper'}>
                    <BTable
                        className={'console-table '}
                        striped hover size="sm" {...getTableProps()}>
                        <thead>
                        {headerGroups.map((headerGroup, index) => (
                            <tr  {...headerGroup.getHeaderGroupProps()} key={index}>
                                <th className={'text-center'}>
                                    <div className={'console-table-th'}>
                                        #
                                    </div>
                                </th>
                                {headerGroup.headers.map((column, index2) => (
                                    <th {...column.getHeaderProps()} key={index2}>
                                        <div className={'console-table-th'}>
                                            {column.render('Header')}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()} key={i}>
                                    <td
                                        className={'text-center'}
                                        style={{
                                            verticalAlign: 'middle',
                                            display: 'table-cell'
                                        }}>
                                        {(pageIndex * pageSize) + i + 1}
                                    </td>

                                    {row.cells.map((cell, index2) => {
                                        return <td
                                            style={{
                                                verticalAlign: 'middle',
                                                display: 'table-cell'
                                            }}
                                            {...cell.getCellProps()}
                                            key={index2}
                                        >{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </BTable>
                </div>
                <div className="pagination p-2  flex-column flex-sm-row">

                    <div>
                        <div className={'d-inline-block'} style={{fontSize: 12, color: '#6C757D'}}>
                            <div>
                                Page {pageIndex + 1} of {pageOptions.length}
                            </div>
                            Showing {pageIndex + 1}-{(pageIndex+1) * pageSize} of {props.data.length} items.
                        </div>
                    </div>


                    <div className={'ms-auto'}>
                        <div className={'me-5 d-inline-block'}>
                            <span>Go to page</span>
                            <Form.Control
                                size={'sm'}
                                className={'ms-1 d-inline-block'}
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    gotoPage(page)
                                }}
                                style={{width: '80px'}}
                            />
                            <Button className={'ms-1'} size={'sm'}>GO</Button>
                        </div>
                        <ButtonGroup size={'sm'} className={'ms-1'}>
                            <Button variant={'outline-primary'} onClick={() =>
                                gotoPage(0)} disabled={!canPreviousPage}>
                                <ChevronsLeft size={20}/>
                            </Button>
                            <Button variant={'outline-primary'} onClick={() => previousPage()}
                                    disabled={!canPreviousPage}>
                                <ChevronLeft size={20}/>
                            </Button>
                            <Button variant={'outline-primary'} onClick={() => nextPage()} disabled={!canNextPage}>
                                <ChevronRight size={20}/>
                            </Button>
                            <Button variant={'outline-primary'} onClick={() => gotoPage(pageCount - 1)}
                                    disabled={!canNextPage}>
                                <ChevronsRight size={20}/>
                            </Button>
                        </ButtonGroup>
                    </div>

                </div>
            </Card>


        </>

    )

}

export default ConsoleTable;