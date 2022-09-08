import * as React from 'react';
// material ui import
import {Typography} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AttendanceTopbar from 'ui-component/attendence-topbar';
import {
    StyledContainer,
    StyledMainCard,
    StyledTable,
    StyledTableCell,
    StyledTableRow
} from 'ui-component/tables/tablestyle';

import Pagination from '@mui/material/Pagination';
import {useDispatch, useSelector} from 'react-redux';

import {clearErrors} from 'store/actions/userActions';
import {myAttendence} from 'store/actions/attendenceAction';


// ==============================|| OVERTIME PAGE ||============================== //

const ViewMixRate = () => {
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(1);
    const {error, attend} = useSelector((state) => state.getAttendence);
    const [date, setdate] = React.useState(new Date());
    const [category, setCategory] = React.useState('');
    React.useEffect(() => {
        dispatch(myAttendence(page, date.getMonth(), date.getFullYear()));
        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch, page, date]);

    const handleChange = (event, value) => {
        setPage(value);
        setCategory(event.target.value);
    };
    const handleDate = (date) => {
        setdate(date);
    };

    console.log(attend);

    return (
        <StyledMainCard>
            <AttendanceTopbar name="Mix Pcs Rate" sea date="true" filter="true" salaryformat="true" wagesformat="true" parentCallback2={handleDate}/>
            <hr color="#fdfdfd"/>
            <Typography variant="body2">
                <StyledContainer component={Paper}>
                    <StyledTable sx={{minWidth: 650}} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">#</StyledTableCell>
                                <StyledTableCell align="center">UAN</StyledTableCell>
                                <StyledTableCell align="center">Employee Name</StyledTableCell>
                                <StyledTableCell align="center">Category</StyledTableCell>
                                <StyledTableCell align="center">Work Done</StyledTableCell>
                                <StyledTableCell align="center">Wages Earned</StyledTableCell>
                                <StyledTableCell align="center">Incentives Earned</StyledTableCell>
                                <StyledTableCell align="center">Total Earned</StyledTableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/*{attend?.employeesAttendance?.map((item, index) => {*/}
                            {/*    let y = 0;*/}
                            {/*    for (let i = 0; i < item.employeeAttendance.length; i += 1) {*/}
                            {/*        if (item.employeeAttendance[i].date === date.getDate()) {*/}
                            {/*            y = item.employeeAttendance[i].overtime;*/}
                            {/*        }*/}
                            {/*    }*/}
                            {/*return (*/}
                            <StyledTableRow
                                // key={(page - 1) * 10 + index + 1}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell align="center" component="th" scope="row">
                                    {/*{(page - 1) * 10 + index + 1}*/}
                                    1
                                </TableCell>
                                <TableCell align="center">
                                    {/*{item?.UAN}*/}
                                    100065102245
                                </TableCell>
                                <TableCell align="center">
                                    {/*{item?.fullName}*/}
                                    Shiva Kumar Choudhary
                                </TableCell>
                                <TableCell align="center">
                                    {/*{formatDate(item?.joiningDate)}*/}
                                    Category 1
                                </TableCell>
                                <TableCell align="center">
                                    {/*{item?.fullName}*/}
                                    1000
                                </TableCell>

                                <TableCell align="center">
                                    {/*{item?.fullName}*/}
                                    7000
                                </TableCell>
                                <TableCell align="center">
                                    {/*{item?.fullName}*/}
                                    10000
                                </TableCell>
                                <TableCell align="center">
                                    {/*{item?.fullName}*/}
                                    17000
                                </TableCell>
                            </StyledTableRow>
                            {/*);*/}
                            {/*})}*/}
                        </TableBody>
                    </StyledTable>
                    <Pagination
                        count={Math.floor(attend?.length / 10) + 1}
                        color="primary"
                        style={{float: 'right'}}
                        page={page}
                        onChange={handleChange}
                    />
                </StyledContainer>
            </Typography>
        </StyledMainCard>
    );
};

export default ViewMixRate;
