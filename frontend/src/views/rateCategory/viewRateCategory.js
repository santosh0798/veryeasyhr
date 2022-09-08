import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material ui import
import { Button, Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AttendanceTopbar from 'ui-component/attendence-topbar';
import { StyledContainer, StyledTable, StyledTableRow, StyledTableCell, StyledMainCardSalary } from 'ui-component/tables/tablestyle';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const options = [
    'Move to Draft',
    'Edit',
    'Delete',
];

const ITEM_HEIGHT = 25;

// ==============================|| VIEW ATTENDENCE PAGE ||============================== //

const ViewRateCategory = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <StyledMainCardSalary>
            <AttendanceTopbar name="View Pcs Rate Category" search="true" />
            <Typography variant="body2">
                <StyledContainer component={Paper}>
                    <StyledTable sx={{ minWidth: 650 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">#</StyledTableCell>
                                <StyledTableCell align="center">Pcs Rate Type</StyledTableCell>
                                <StyledTableCell align="center">Category Name</StyledTableCell>
                                <StyledTableCell align="center">Quantity</StyledTableCell>
                                <StyledTableCell align="center">Rate</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                                <StyledTableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center" component="th" scope="row">
                                        1
                                    </TableCell>
                                    <TableCell align="center">Pure Pcs Rate</TableCell>
                                    <TableCell align="center">Casual Paper</TableCell>
                                    <TableCell align="center">1</TableCell>
                                    <TableCell align="center">0.02564</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            aria-label="more"
                                            id="long-button"
                                            aria-controls={open ? 'long-menu' : undefined}
                                            aria-expanded={open ? 'true' : undefined}
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id="long-menu"
                                            MenuListProps={{
                                                'aria-labelledby': 'long-button',
                                            }}
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            PaperProps={{
                                                style: {
                                                    maxHeight: ITEM_HEIGHT * 4.5,
                                                    width: '17ch',
                                                },
                                            }}
                                        >
                                            {options.map((option) => (
                                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </TableCell>
                                </StyledTableRow>

                        </TableBody>
                    </StyledTable>
                    {/*<Pagination*/}
                    {/*    count={Math.floor(users?.usersCount / 10) + 1}*/}
                    {/*    color="primary"*/}
                    {/*    style={{ float: 'right' }}*/}
                    {/*    page={page}*/}
                    {/*    onChange={handleChange}*/}
                    {/*/>*/}
                </StyledContainer>
            </Typography>
        </StyledMainCardSalary>
    );
};

export default ViewRateCategory;
