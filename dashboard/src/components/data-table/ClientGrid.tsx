import { FC, useState } from "react";
import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";

interface ClientGridProps {
    rows: any[];
    columns: GridColDef[];
    pageSize: number;
    pageNo: number;
    handlePageNoChange: (page: number, details: any) => void;
    handlePageSizeChange: (page: number, details: any) => void;
    loading: boolean;
    classes: {
        root?: string;
        row?: string;
        columnHeaders?: string;
        columnSeparator?: string;
        footerContainer?: string;
    }
}

export const ClientGrid: FC<ClientGridProps>= ({
    rows,
    columns,
    pageSize,
    pageNo,
    handlePageNoChange,
    handlePageSizeChange,
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
        paginationMode={'client'}
        rowsPerPageOptions={[5, 10, 25, 50]}
        density="compact"
        disableColumnMenu
        disableColumnFilter
        headerHeight={85}
        rowHeight={55}
        disableSelectionOnClick
        onPageChange={handlePageNoChange}
        onPageSizeChange={handlePageSizeChange}
        rowCount={rows.length}
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