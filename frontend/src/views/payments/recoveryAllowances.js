import * as React from 'react';
// material ui import
import { Button, Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AttendanceTopbar from 'ui-component/attendence-topbar';
import { StyledContainer, StyledMainCard, StyledTable, StyledTableCell, StyledTableRow } from 'ui-component/tables/tablestyle';
import OvertimeInput from 'ui-component/tables/increasetextfield';
import Pagination from '@mui/material/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillPlusCircle } from 'react-icons/ai';
import formatDate from 'utils/date-format';
import { clearErrors } from 'store/actions/userActions';
import { myAttendence } from 'store/actions/attendenceAction';
import RecoveryInput from "../../ui-component/tables/increaseInputFields";
import AddRecoveryAllowance from 'ui-component/payment/recoverySidePanel';
import { getCompany } from 'store/actions/companyAction';

// ==============================|| OVERTIME PAGE ||============================== //

const RecoveryAllowances = () => {
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(1);
    const { error, attend } = useSelector((state) => state.getAttendence);
    const [date, setdate] = React.useState(new Date());

    const [open, setOpen] = React.useState('inactivesidebar');
    const [arr, setArr] = React.useState([]);


    const { orders } = useSelector((state) => state.myCompany);


    console.log(arr);


    React.useEffect(() => {
        dispatch(myAttendence(page, date.getMonth(), date.getFullYear()));
        dispatch(getCompany());
        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch, page, date]);


    React.useEffect(() => {
        if (orders?.user?.recoveryAndAllowance) {
            setArr(orders?.user?.recoveryAndAllowance)
        }

    }, [orders]);


    const handleChange = (event, value) => {
        setPage(value);
    };
    const handleDate = (date) => {
        setdate(date);
    };

    console.log(attend);




    const handleClose = () => {
        setOpen('inactivesidebar');
    };

    const handleClickOpen = () => {
        setOpen('activesidebar');
    };

    return (
        <StyledMainCard style={{ position: "relative" }}>
            <AttendanceTopbar name="Recovery and Allowances" search="true" date="true" filter="true" parentCallback2={handleDate} />
            <Typography variant="body2">
                <Button onClick={handleClickOpen} style={{ position: "absolute", top: "83px", right: "25px" }}>
                    <AiFillPlusCircle
                        style={{ width: '40px', height: '40px', color: 'rgb(209 108 255)', margin: '5px', cursor: 'pointer' }}
                    />
                </Button>
                <StyledContainer component={Paper}>
                    <StyledTable sx={{ minWidth: 650 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">#</StyledTableCell>
                                <StyledTableCell align="center">Employee Name</StyledTableCell>
                                {arr?.map((item, index) => {
                                    return (
                                        <StyledTableCell align="center">{item?.name}

                                            <br />
                                            <Typography variant="body2">
                                                ({item?.type})
                                            </Typography>
                                        </StyledTableCell>
                                    )
                                })}

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attend?.employeesAttendance?.map((item, index) => {

                                return (
                                    <StyledTableRow
                                        key={(page - 1) * 10 + index + 1}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center" component="th" scope="row">
                                            {(page - 1) * 10 + index + 1}
                                        </TableCell>

                                        <TableCell align="center">{item?.fullName}</TableCell>

                                        <RecoveryInput arr={arr} date={date} employee={item?.employee} allowence={item?.allowancesNReject} />

                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </StyledTable>
                    <Pagination
                        count={Math.floor(attend?.length / 10) + 1}
                        color="primary"
                        style={{ float: 'right' }}
                        page={page}
                        onChange={handleChange}
                    />

                </StyledContainer>
            </Typography>
            <div className={`view-salary-sidebar ${open}`}>
                <Typography variant="body2">
                    <AddRecoveryAllowance
                        parentCallback={handleClose}
                        arrCallBack={setArr}
                        close={handleClose}
                        attend={attend}
                        order={orders}
                    />
                </Typography>
            </div>
        </StyledMainCard>
    );
};

export default RecoveryAllowances;
