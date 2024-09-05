import * as React from "react";
import { useState, useRef } from "react";
import {
  useGetOrdersQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../store/orders.api";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

import SnackbarAlert from "./SnackbarAlert";

interface Data {
  id: number;
  username: string;
  status: string;
  createdAt: string;
}

type OrderType = {
  id: string | number;
  username?: string;
  status?: string;
  createdAt?: string;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "username",
    numeric: false,
    disablePadding: true,
    label: "Username",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Created",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <span>Orders</span>
        </Typography>
      )}
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("status");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Data | null>(null);

  const [count, setCount] = useState("");
  const [newOrder, setNewOrder] = useState("");
  const { data = [], isLoading } = useGetOrdersQuery(count);
  const [addOrder, { isError }] = useAddOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const snackbarRefDelete = useRef<any>(null);
  const snackbarRefUpdate = useRef<any>(null);

  const handleAddOrder = async (order: {
    id: number;
    username: string;
    status: string;
    createdAt: string;
  }) => {
    if (newOrder) {
      await addOrder({ username: newOrder }).unwrap();
      setNewOrder("");
    }
  };

  //   const handleAddOrder = async (order: { id: number; username: string; status: string; createdAt: string }) => {
  //     if (order.username) {
  //       await addOrder(order).unwrap();
  //       setNewOrder("");
  //     }
  //   };

  const handleUpdateOrder = async (
    id: string,
    updatedData: Partial<OrderType>
  ) => {
    try {
      await updateOrder({ id, ...updatedData }).unwrap();
      handleOpenUpdateSnackbar();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    await deleteOrder(id).unwrap();
    handleCloseModal();
    handleOpenDeleteSnackbar();
  };

  if (isLoading) return <h1>Loading...</h1>;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, row: Data) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const triggerSnackbarDelete = () => {
    if (snackbarRefDelete.current) {
      snackbarRefDelete.current.openSnackbar();
    }
  };

  const triggerSnackbarUpdate = () => {
    if (snackbarRefUpdate.current) {
      snackbarRefUpdate.current.openSnackbar();
    }
  };

  const handleOpenDeleteSnackbar = () => {
    triggerSnackbarDelete();
  };

  const handleOpenUpdateSnackbar = () => {
    triggerSnackbarUpdate();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: Data, index: number) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <IconButton
        onClick={(event) => {
          handleClick(event, {
            id: 0,
            username: "",
            status: "",
            createdAt: "",
          });
        }}
      >
        <span>Add new orders</span>
        <AddCircleTwoToneIcon />
      </IconButton>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedRow ? "Edit Order" : "Add New Order"}
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="ID"
              value={selectedRow ? selectedRow.id : ""}
              onChange={(e) =>
                setSelectedRow((prev) =>
                  prev ? { ...prev, id: parseInt(e.target.value, 10) } : null
                )
              }
              fullWidth
              margin="normal"
              disabled={!!selectedRow}
            />
            <TextField
              label="Username"
              value={selectedRow ? selectedRow.username : ""}
              onChange={(e) =>
                setSelectedRow((prev) =>
                  prev ? { ...prev, username: e.target.value } : null
                )
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Status"
              value={selectedRow ? selectedRow.status : ""}
              onChange={(e) =>
                setSelectedRow((prev) =>
                  prev ? { ...prev, status: e.target.value } : null
                )
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Created At"
              value={selectedRow ? selectedRow.createdAt : ""}
              onChange={(e) =>
                setSelectedRow((prev) =>
                  prev ? { ...prev, createdAt: e.target.value } : null
                )
              }
              fullWidth
              margin="normal"
              disabled={!!selectedRow}
            />
          </Box>

          {selectedRow && (
            <IconButton
              onClick={() => handleDeleteOrder(selectedRow.id.toString())}
            >
              <DeleteIcon />
            </IconButton>
          )}

          <Button
            onClick={() => {
              if (selectedRow) {
                handleUpdateOrder(selectedRow.id.toString(), {
                  username: selectedRow.username,
                  status: selectedRow.status,
                  createdAt: selectedRow.createdAt,
                });
                console.log("Order was updated");
              } else {
                handleAddOrder({
                  id: Date.now(),
                  username: "",
                  status: "",
                  createdAt: new Date().toISOString(),
                });
                console.log("Order was added");
              }
              handleCloseModal();
              setSelectedRow(null);
            }}
            variant="contained"
            sx={{ mt: 2 }}
          >
            {selectedRow ? "Update Order" : "Add Order"}
          </Button>
        </Box>
      </Modal>

      <SnackbarAlert ref={snackbarRefDelete} text="Deleted" type="error" />
      <SnackbarAlert ref={snackbarRefUpdate} text="Update" type="info" />
    </Box>
  );
}
