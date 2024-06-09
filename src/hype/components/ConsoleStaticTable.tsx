import BTable from "react-bootstrap/Table";
import {Button, ButtonGroup, Card, Form} from "react-bootstrap";
import {ReactElement, useCallback, useMemo, useState} from "react";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search} from "react-feather";

import {
    PaginationState,
    useReactTable,
    getCoreRowModel,
    flexRender, getPaginationRowModel
} from '@tanstack/react-table'


const ConsoleStaticTable = (props: {
    disableCreateButton? : boolean,
    hideCreateButton? : boolean,
    hideSearch? : boolean,
    createButtonLabel?: ReactElement | string,
    onCreateClick?: () => void,
    onSearchClick?: (s: string) => void,
    columns: any,
    customStaticState?: useStaticTableType,
    data: any,
}) => {

    const total = useMemo(() => {
        return props.data.length
    },[props.data])

    function getStaticState(): useStaticTableType {
        let tempStaticTableState = props.customStaticState
        if(tempStaticTableState == null) {
            tempStaticTableState = useStaticTable(props.data)
        }
        return tempStaticTableState
    }
    const staticTableState = getStaticState()

    const [search, setSearch] = useState<string>('')

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const gotoPage = (n: number)=> {
        setPagination({
            ...pagination,
            pageIndex: n
        })
    }

    const setPageSize = (size: number) => {
        setPagination({
            ...pagination,
            pageSize: size
        })
    }

    const previousPage = () => {
        gotoPage(pagination.pageIndex - 1)
    };

    const nextPage = () => {
        gotoPage(pagination.pageIndex + 1)
    };


    const canPreviousPage = useMemo(() => {
        return  pagination.pageIndex > 1
    }, [pagination.pageIndex] )

    const canNextPage = useMemo(() => {
        return pagination.pageIndex < total / pagination.pageSize
    }, [pagination.pageIndex, total , pagination.pageSize] )

    const pageCount = useMemo(() => {
        return Math.ceil(total / pagination.pageSize)
    }, [total, pagination.pageSize])


    const table = useReactTable({
        data: staticTableState.displayData,
        columns: props.columns,
        rowCount: staticTableState.displayData, // new in v8.13.0 - alternatively, just pass in `pageCount` directly
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            pagination,
        },
        // getSortedRowModel: getSortedRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
        debugTable: true,
    })

    const handleCreateButton = useCallback(() => {
        if (props.onCreateClick != null && props.disableCreateButton != true) {
            props.onCreateClick()
        }
    }, [props.onCreateClick])
    // Render the UI for your table
    return (
        <>
            {
                props.hideCreateButton != true ?        <Button variant={'success'}
                                                                disabled={props.disableCreateButton}
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
                        value={pagination.pageSize}
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
                            Page <span className={'fw-bold'}>{pagination.pageIndex + 1}</span> of {pageCount}
                        </div>
                        Showing {pagination.pageIndex + 1}-{(pagination.pageIndex+1) * pagination.pageSize} of {props.data.length} items.
                    </div>
                </div>
                <div className={`ms-auto d-flex align-items-center ${props.hideSearch ? 'd-none': ''}`}>
                    <Form.Control style={{height: 30}} placeholder={'Search'}
                                  onChange={(e) => {
                                      setSearch(e.target.value)
                                  }}
                    ></Form.Control>
                    <Button style={{width: 40, height: 35}} className={'p-0 ms-1'} variant={'outline-primary'}
                            onClick={(e) => {
                                if(props.onSearchClick != null) {
                                    props.onSearchClick(search)
                                }
                                staticTableState.onSearchClick(search)
                            }}
                    >
                        <Search size={20}/>
                    </Button>
                </div>
            </div>


            <Card style={{overflowX: 'scroll'}}>
                <div className={'console-table-wrapper'}>
                    <BTable
                        className={'console-table '}
                        striped hover size="sm">
                        <thead>
                        {table.getHeaderGroups().map((headerGroup, index) => (
                            <tr key={'tr_' +index}>
                                <th className={'text-center'}>
                                    <div className={'console-table-th'}>
                                        #
                                    </div>
                                </th>
                                {headerGroup.headers.map((header, index2) => (
                                    <th  key={'th_'+ header.id}>
                                        <div className={'console-table-th'}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody>
                        {table.getPaginationRowModel().rows.map( (row, i) => (
                            <tr key={row.id}>
                                <td
                                    className={'text-center'}
                                    style={{
                                        verticalAlign: 'middle',
                                        display: 'table-cell'
                                    }}>
                                    {(pagination.pageIndex * pagination.pageSize) + i + 1}
                                </td>

                                {row.getVisibleCells().map(cell => (
                                    <td
                                        style={{
                                            verticalAlign: 'middle',
                                            display: 'table-cell'
                                        }}
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </BTable>
                </div>
                <div className="pagination p-2  flex-column flex-sm-row">

                    <div>
                        <div className={'d-inline-block'} style={{fontSize: 12, color: '#6C757D'}}>
                            <div>
                                Page <span className={'fw-bold'}>{pagination.pageIndex + 1}</span> of {pageCount}
                            </div>
                            Showing {pagination.pageIndex + 1}-{(pagination.pageIndex+1) * pagination.pageSize} of {total} items.
                        </div>
                    </div>


                    <div className={'ms-auto'}>
                        <div className={'me-1 me-lg-2 d-inline-block'}>
                            <span>Go to page</span>
                            <Form.Control
                                size={'sm'}
                                className={'ms-1 d-inline-block'}
                                type="number"
                                defaultValue={pagination.pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    gotoPage(page)
                                }}
                                style={{width: '80px'}}
                            />
                            <Button className={'ms-1'} size={'sm'}>GO</Button>
                        </div>
                        <ButtonGroup size={'sm'} className={'ms-1 mt-1'}>
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


export type useStaticTableType = {
    search: string,
    setSearch: (s: string) => void,
    displayData: any,
    onSearchClick: (s: string) => void
}
export const useStaticTable = (data: any): useStaticTableType => {
    const [search, setSearch] = useState<string>('')
    const onSearchClick = (s: string) => {
        setSearch(s)
    }

    const displayData = useMemo(() => {
        if(data != null) {
            return  data.filter((v: any) => {
                const searchKey = Object.keys(v).map((k: string) => {
                    return v[k]?.toString().toLowerCase()
                })
                return searchKey.join(' ').includes(search.toLowerCase())
            })
        }
        return [];
    }, [search, data])

    return {
        search,
        setSearch,
        displayData,
        onSearchClick
    }
}

export default ConsoleStaticTable;