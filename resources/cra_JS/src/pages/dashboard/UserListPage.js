import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Drawer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// import { _userList } from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers } from '../../redux/slices/user';

// renderer
import ImageRenderer from '../renderers/ImageRenderer';
import EmailRenderer from '../renderers/EmailRenderer';
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserListPage() {
  const pagination = true;

  const paginationPageSize = 13;

  const dispatch = useDispatch();

  const users = useSelector((state) => state.user.users);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'name',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      cellRenderer: ImageRenderer,
      filter: 'agTextColumnFilter',
      cellStyle: {
        cursor: 'pointer',
      },
    },
    {
      field: 'email',
      cellRenderer: EmailRenderer,
      filter: 'agTextColumnFilter',
    },
  ]);

  const [defaultColDef, setDefaultColDef] = useState({
    editable: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    floatingFilter: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterEmail, setFilterEmail] = useState('');

  const [checked, setChecked] = useState(true);

  const [openDrawer, setOpenDrawer] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [suppressClickEdit, setSuppressClickEdit] = useState(true);

  const [isEditGrid, setIsEditGrid] = useState(false);

  const gridRef = useRef();

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterEmail !== '';

  const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterEmail);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterEmail = (event) => {
    setPage(0);
    setFilterEmail(event.target.value);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const handleCloseDetails = () => {
    setOpenDrawer(false);
  };

  const getRowId = useMemo(() => {
    return (params) => params.data.id;
  }, []);

  const refetchData = () => {
    dispatch(getUsers());
  };

  const addItem = () => {
    setOpenDrawer(true)
    setIsEdit(false)
    setCurrentUser(null)
  }

  const onBtStopEditing = useCallback(() => {
    setIsEditGrid(false);
    setSuppressClickEdit(true);
    gridRef.current.api.stopEditing();
  }, []);

  const onBtStartEditing = useCallback(() => {
    setIsEditGrid(true);
    setSuppressClickEdit(false);
    gridRef.current.api.setFocusedCell(0, 'name');
    gridRef.current.api.startEditingCell({
      rowIndex: 0,
      colKey: 'name',
    });
  });

  const onRowDoubleClicked = (item) => {
    if (!isEditGrid) {
      setOpenDrawer(true);
      setIsEdit(true);
      const dataItem = item?.data || [];
      setCurrentUser(dataItem);
    }
  };

  const handleDeleteRow = (id) => {
    console.log(id);
    const deleteRow = users.filter((row) => row.id !== id);
    setSelected([]);
    // setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = users.filter((row) => !selected.includes(row.id));
    setSelected([]);
    // setTableData(deleteRows);

    if (page > 0) {
      if (selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selected.length === dataFiltered.length) {
        setPage(0);
      } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((users.length - selected.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked === true) {
      setDefaultColDef((prev) => ({ ...prev, floatingFilter: true }));
    } else {
      setDefaultColDef((prev) => ({ ...prev, floatingFilter: false }));
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterEmail('');
  };

  return (
    <>
      <Helmet>
        <title> User: List | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={addItem}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New User
            </Button>
          }
        />

        <Drawer anchor={'right'} open={openDrawer} onClose={toggleDrawer(false)}>
          <UserNewEditForm
            isEdit={isEdit}
            onClose={handleCloseDetails}
            currentUser={currentUser}
            refetchData={refetchData}
          />
        </Drawer>

        <Card>
          <UserTableToolbar
            checked={checked}
            handleChange={handleChange}
            isFiltered={isFiltered}
            filterName={filterName}
            filterEmail={filterEmail}
            onFilterName={handleFilterName}
            onFilterEmail={handleFilterEmail}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={users.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  users.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <div className="ag-theme-alpine" style={{ height: 620, width: '100%' }}>
                <AgGridReact
                  //   headerHeight={headerHeight}
                  ref={gridRef}
                  rowSelection={'multiple'}
                  //   editType={'fullRow'}
                  animateRows={'true'}
                  //   onCellEditRequest={onCellEditRequest}
                    getRowId={getRowId}
                    readOnlyEdit={'true'}
                  //   onRowSelected={onRowSelected}
                  defaultColDef={defaultColDef}
                  rowData={dataFiltered}
                  columnDefs={columnDefs}
                  pagination={pagination}
                  paginationPageSize={paginationPageSize}
                  onRowDoubleClicked={onRowDoubleClicked}
                  suppressClickEdit={suppressClickEdit}
                >
                  <></>
                </AgGridReact>
              </div>
            </Scrollbar>
          </TableContainer>
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterEmail }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterEmail) {
    inputData = inputData.filter((user) => user.email.toLowerCase().indexOf(filterEmail.toLowerCase()) !== -1);
  }

  return inputData;
}
