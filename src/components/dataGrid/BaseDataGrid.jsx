import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'

export const BaseDataGrid = ({ fireStoreListData, columns }) => {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={fireStoreListData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        componentsprops={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd'
        }
      />
    </Box>
  );
};
