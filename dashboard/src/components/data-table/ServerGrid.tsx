import { FC, useState } from "react";
import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";

interface ServerGridProps {
    rows: any[];
    rowCount: number;
    columns: GridColDef[];
    pageSize: number;
    pageNo: number;
    selectionModel?: any[];
    handlePageNoChange: (page: number, details: any) => void;
    handlePageSizeChange: (page: number, details: any) => void;
    handleSelectionModelChange?: (selectionModel: any[]) => void;
    loading: boolean;
    classes: {
        root?: string;
        row?: string;
        columnHeaders?: string;
        columnSeparator?: string;
        footerContainer?: string;
    }
}

export const ServerGrid: FC<ServerGridProps> = ({
    rows,
    rowCount,
    columns,
    pageSize,
    pageNo,
    selectionModel,
    handlePageNoChange,
    handlePageSizeChange,
    handleSelectionModelChange,
    loading,
    classes
}) => {
    return (
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        pagination
        page={pageNo}
        pageSize={pageSize}
        paginationMode={'server'}
        rowsPerPageOptions={[5, 10, 15, 25, 50]}
        density="compact"
        disableColumnMenu
        disableColumnFilter
        headerHeight={85}
        rowHeight={55}
        disableSelectionOnClick
        onPageChange={handlePageNoChange}
        onPageSizeChange={handlePageSizeChange}
        rowCount={rowCount}
        selectionModel={selectionModel}
        onSelectionModelChange={handleSelectionModelChange}
        checkboxSelection={selectionModel !== undefined && true}
        initialState={{
            pagination: {
                pageSize
            }
        }}
        classes={{
            root: classes.root,
            row: classes.row,
            footerContainer: classes.footerContainer,
            columnHeaders: classes.columnHeaders,
            columnSeparator: classes.columnSeparator,
        }}
        loading={loading}
      /> 
    )
}