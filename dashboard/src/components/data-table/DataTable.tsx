import { FC, useEffect, useState } from "react";
import { GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles'
import { Theme } from 'theme'
import { ServerGrid } from "./ServerGrid";
import { ClientGrid } from "./ClientGrid";

interface DataTableProps {
    defaultPageSize: number;
    rows: any[];
    columns: GridColDef[];
    paginationMode: 'server' | 'client';
    filterModel?: GridFilterModel;
    selectionModel?: any[];
    fetchRows?: (pageNo: number, pageSize: number, setRowCount: Function, filterModel?: GridFilterModel) => Promise<void>;
    search?: (search: string, pageNo: number, pageSize: number, setRowCount: Function, filterModel: GridFilterModel) => Promise<void>;
    onSelectionModelChange?: (selectionModel: any[]) => void;
    loading?: boolean;
}

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      border: 'none',
      '& .MuiDataGrid-cell': {
        borderBottom: 'none !important',
      },
    },
    row: {
      color: palette.primaryNavy.main,
      fontSize: 16,
      lineHeight: 1.2,
    },
    columnHeaders: {
      background: palette.backgroundGray.main,
      borderRadius: spacing(1),
      borderBottom: 'none',
      color: palette.secondaryNavy1.main,
      fontSize: 16,
      lineHeight: 1.2,
    },
    columnSeparator: {
      display: 'none !important',
    },
    footerContainer: {
      borderTop: `1px solid ${palette.distinctiveGray.main}`,
      margin: spacing(0, -4),
      padding: spacing(0, 4),
    },
  }),
)

export const DataTable: FC<DataTableProps> = ({
    rows,
    columns,
    paginationMode = 'client',
    defaultPageSize,
    filterModel,
    selectionModel,
    onSelectionModelChange,
    fetchRows,
    search,
    loading
}) => {
    const classes = useStyles()
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPageSize || 25);
    const [rowCount, setRowCount] = useState(0);
    const [internalLoading, setLoading] = useState(false);

    const handlePageSizeChange = (value: number, details: any) => {
        setPageSize(Math.max(1, value));
    }
    
    const handlePageNoChange = (value: number, details: any) => {
        setPageNo(Math.max(0, value));
    }

    useEffect(() => {
        if (paginationMode === 'server' && fetchRows) {
        (async () => {
            setLoading(true)
            fetchRows(pageNo, pageSize, setRowCount)
            setLoading(false);
        })()
        }
    }, [pageNo, pageSize, filterModel]);

    return (
        <Box sx={{
            width: '100%',
            height: 'auto',
        }}>
            {paginationMode == 'client' ? 
            <ClientGrid 
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                pageNo={pageNo}
                handlePageNoChange={handlePageNoChange}
                handlePageSizeChange={handlePageSizeChange}
                loading={internalLoading || (loading ?? false)}
                classes={classes}
            /> : 
            <ServerGrid
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                pageSize={pageSize}
                pageNo={pageNo}
                handlePageNoChange={handlePageNoChange}
                selectionModel={selectionModel}
                handlePageSizeChange={handlePageSizeChange}
                handleSelectionModelChange={onSelectionModelChange}
                loading={internalLoading || (loading ?? false)}
                classes={classes}
            />}
        </Box>
    )
}