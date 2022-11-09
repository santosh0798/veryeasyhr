import * as React from 'react';
// material ui import
import { Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AttendanceTopbar from 'ui-component/attendence-topbar';
import { StyledContainer, StyledMainCard, StyledTable, StyledTableRow, StyledHeader } from 'ui-component/tables/tablestyle';
import Pagination from '@mui/material/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';

import formatDate from 'utils/date-format';
import axios from 'axios';
import { getCompany } from 'store/actions/companyAction';

// ==============================|| VIEW ATTENDENCE PAGE ||============================== //


// Function for Download the PDF File for Annual Leave Report
function leaveReportDownload() {
    const pdfTable = document.getElementById('capture');
    /* eslint-disable new-cap */
    const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' });
    pdf.html(pdfTable, { html2canvas: { scale: 0.6 } }).then(() => {
        pdf.save('annual_leave_report.pdf');
    });
}

const LeaveManage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(1);
    const [attend, setAttend] = React.useState([]);
    const [date, setdate] = React.useState(new Date());
    const [showdetails, setshowdetails] = React.useState(true);
    const [showIndex, setshowIndex] = React.useState(0);

    React.useEffect(() => {
        dispatch(getCompany());

        async function getAtt() {
            const x = await axios.get(` http://localhost:4000/api/v1/employee/attendance/mylist/${date.getFullYear()}?page=${page}`, {
                withCredentials: true
            });
            console.log(x.data);
            setAttend(x.data);
        }
        getAtt();
    }, [page, date]);

    console.log(attend);

    const handleChange = (event, value) => {
        setPage(value);
    };
    const handleDate = (date) => {
        setdate(date);
    };

    const { error, orders } = useSelector((state) => state.myCompany);


    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    console.log(attend);
    return (
        <>
            <StyledMainCard>
                <AttendanceTopbar
                    name="Manage Leave"
                    search="true"
                    parentCallback2={handleDate}
                    parentCallback5={leaveReportDownload}
                    leave="true"
                    date="true"
                    downloadButton="Leave"
                />
                <Typography variant="body2">
                    <StyledContainer component={Paper}>
                        <StyledTable sx={{ minWidth: 650 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledHeader align="center" rowSpan={2}>
                                        Sr No.
                                    </StyledHeader>
                                    <StyledHeader align="center" rowSpan={2}>
                                        Name
                                    </StyledHeader>
                                    <StyledHeader align="center" rowSpan={2}>
                                        Joining Date
                                    </StyledHeader>
                                    <StyledHeader align="center" rowSpan={2}>
                                        Total Leave
                                    </StyledHeader>
                                    <StyledHeader align="center" rowSpan={2}>
                                        Avail Leave
                                    </StyledHeader>
                                    <StyledHeader align="center" rowSpan={2}>
                                        Carry Forward
                                    </StyledHeader>
                                    {showdetails == true ? (
                                        month.map((item, index) => {
                                            return (
                                                <StyledHeader
                                                    align="center"
                                                    style={{ cursor: 'pointer' }}
                                                    colSpan={2}
                                                    onClick={() => {
                                                        setshowdetails(false);
                                                        setshowIndex(index);
                                                    }}
                                                >
                                                    {item}
                                                </StyledHeader>
                                            );
                                        })
                                    ) : (
                                        <StyledHeader
                                            align="center"
                                            colSpan={10}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setshowdetails(true);
                                            }}
                                        >
                                            {month[showIndex]}
                                        </StyledHeader>
                                    )}
                                    {showdetails == true && (
                                        <StyledHeader align="center" colSpan={2}>
                                            Total
                                        </StyledHeader>
                                    )}
                                </TableRow>
                                <TableRow>
                                    {showdetails == true ? (
                                        month.map((item, index) => {
                                            return (
                                                <>
                                                    <StyledHeader align="center">Present Days</StyledHeader>
                                                    <StyledHeader align="center">Working Days</StyledHeader>
                                                </>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <StyledHeader align="center">Paid Leave</StyledHeader>
                                            <StyledHeader align="center">Casual Leave</StyledHeader>
                                            <StyledHeader align="center">Sick Leave</StyledHeader>
                                            <StyledHeader align="center">Paid Holiday</StyledHeader>
                                            <StyledHeader align="center">Paid Weekly Off</StyledHeader>
                                            <StyledHeader align="center">Unpaid Weekly Off</StyledHeader>
                                            <StyledHeader align="center">Leave with permission</StyledHeader>
                                            <StyledHeader align="center">Leave without permission</StyledHeader>
                                            <StyledHeader align="center">Accident Leave</StyledHeader>
                                            <StyledHeader align="center">Maternity permission</StyledHeader>
                                        </>
                                    )}
                                    {showdetails == true && (
                                        <>
                                            <StyledHeader align="center">Total Present Days</StyledHeader>
                                            <StyledHeader align="center">Total Working Days</StyledHeader>
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attend?.attendance?.map((item, index) => {
                                    let totalDaysofWorking = 0;
                                    let totalDaysofAttend = 0;

                                    let tempArray = [
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 },
                                        { totalDaysofWorking: 0, totalDaysofAttend: 0 }
                                    ];
                                    return (
                                        <StyledTableRow
                                            key={(page - 1) * 10 + index + 1}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" component="th" scope="row">
                                                {(page - 1) * 10 + index + 1}
                                            </TableCell>
                                            <TableCell align="center">{item?.empData?.personalDetails?.fullName}</TableCell>
                                            <TableCell align="center">{formatDate(item?.empData?.companyDetails?.joiningDate)}</TableCell>
                                            <TableCell align="center">{item?.attandanceData[0]?.totalLeave}</TableCell>
                                            <TableCell align="center">{item.attandanceData[0]?.availLeave}</TableCell>
                                            <TableCell align="center">{item.attandanceData[0]?.carryForward}</TableCell>
                                            {showdetails == true
                                                ? month.map((months, index2) => {
                                                    return (
                                                        <>
                                                            {item?.attandanceData?.map((attends, index3) => {
                                                                let presentDays = attends.employeeAttendance;
                                                                let totalPresent = [];
                                                                let totalWorkingDay = [];
                                                                if (index2 + 1 == attends.attendanceMonth) {
                                                                    totalPresent = presentDays.filter(
                                                                        (attendance) =>
                                                                            attendance.attendance == true ||
                                                                            attendance.leave == 'Paid Leave' ||
                                                                            attendance.leave == 'Accident Leave' ||
                                                                            attendance.leave == 'Maternity Leave' ||
                                                                            (attendance.leave == 'Casual Leave' &&
                                                                                parseInt(item?.empData?.companyDetails?.casualLeave) >
                                                                                0) ||
                                                                            (attendance.leave == 'Sick Leave' &&
                                                                                item?.empData?.companyDetails?.sickLeave > 0)
                                                                    );
                                                                    totalWorkingDay = presentDays.filter(
                                                                        (attendance) => attendance.attendance == true
                                                                    );
                                                                }
                                                                totalDaysofWorking += totalWorkingDay.length;
                                                                totalDaysofAttend += totalPresent.length;
                                                                if (index2 + 1 == attends.attendanceMonth) {
                                                                    tempArray[index2] = {
                                                                        totalDaysofWorking: totalWorkingDay.length,
                                                                        totalDaysofAttend: totalPresent.length
                                                                    };
                                                                }
                                                                if (index3 == item?.attandanceData?.length - 1) {
                                                                    return (
                                                                        <>
                                                                            <TableCell align="center">
                                                                                {tempArray[index2].totalDaysofAttend}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {tempArray[index2].totalDaysofWorking}
                                                                            </TableCell>
                                                                        </>
                                                                    );
                                                                }
                                                            })}
                                                        </>
                                                    );
                                                })
                                                : item?.attandanceData?.map((attends, index3) => {
                                                    //for single
                                                    let presentDays = attends.employeeAttendance;
                                                    let paidLeave = [];
                                                    let casualLeave = [];
                                                    let sickLeave = [];
                                                    let paidHoliday = [];
                                                    let paidWeeklyOff = [];
                                                    let unpaidWeeklyOff = [];
                                                    let leaveWithPer = [];
                                                    let leaveWithoutPer = [];
                                                    let accidentLeave = [];
                                                    let maternityLeave = [];
                                                    if (showIndex + 1 == attends.attendanceMonth) {
                                                        paidLeave = presentDays.filter((attendance) => attendance.leave == 'Paid Leave');
                                                        casualLeave = presentDays.filter(
                                                            (attendance) => attendance.leave == 'Casual Leave'
                                                        );
                                                        sickLeave = presentDays.filter((attendance) => attendance.leave == 'Sick Leave');
                                                        paidHoliday = presentDays.filter(
                                                            (attendance) => attendance.leave == 'Paid Holiday'
                                                        );
                                                        paidWeeklyOff = presentDays.filter(
                                                            (attendance) => attendance.leave == 'Paid Weekly Off'
                                                        );
                                                        unpaidWeeklyOff = presentDays.filter(
                                                            (attendance) => attendance.leave == 'Unpaid Weekly Off'
                                                        );
                                                        leaveWithPer = presentDays.filter(
                                                            (attendance) => attendance.leave == 'Leave with Permission'
                                                        );
                                                        leaveWithoutPer = presentDays.filter(
                                                            (attendance) => attendance.leave == 'Leave without Permission'
                                                        );
                                                        accidentLeave = presentDays.filter(
                                                            (attendance) => attendance.leave == 'Accident Leave'
                                                        );
                                                        maternityLeave = presentDays.filter(
                                                            (attendance) => attendance.leave == 'Maternity Leave'
                                                        );
                                                    }
                                                    if (showIndex + 1 == attends.attendanceMonth) {
                                                        return (
                                                            <>
                                                                <TableCell align="center">{paidLeave.length}</TableCell>
                                                                <TableCell align="center">{casualLeave.length}</TableCell>
                                                                <TableCell align="center">{sickLeave.length}</TableCell>
                                                                <TableCell align="center">{paidHoliday.length}</TableCell>
                                                                <TableCell align="center">{paidWeeklyOff.length}</TableCell>
                                                                <TableCell align="center">{unpaidWeeklyOff.length}</TableCell>
                                                                <TableCell align="center">{leaveWithPer.length}</TableCell>
                                                                <TableCell align="center">{leaveWithoutPer.length}</TableCell>
                                                                <TableCell align="center">{accidentLeave.length}</TableCell>
                                                                <TableCell align="center">{maternityLeave.length}</TableCell>
                                                            </>
                                                        );
                                                    }
                                                })}
                                            {showdetails == true && (
                                                <>
                                                    {' '}
                                                    <TableCell align="center">{totalDaysofAttend}</TableCell>
                                                    <TableCell align="center">{totalDaysofWorking}</TableCell>
                                                </>
                                            )}
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </StyledTable>
                    </StyledContainer>
                    <Pagination
                        count={Math.floor(attend?.length / 10) + 1}
                        color="primary"
                        style={{ float: 'right' }}
                        page={page}
                        onChange={handleChange}
                    />
                </Typography>
            </StyledMainCard>
            <div style={{ display: 'none' }}>
                <div id="capture" style={{ textAlign: 'center', width: '100%', margin: '10px', marginTop: '0px' }} width="100%">
                    {attend?.attendance?.map((item, index) => {
                        let totalDaysofWorking = 0;
                        let maternityLeave = [];
                        let carryForward = 0;
                        let totalDaysofAttend = 0;
                        let todayDates = new Date();
                        return (
                            <>
                                {month.map((months, index2) => {
                                    return (
                                        <>
                                            {item?.attandanceData?.map((attends, index3) => {
                                                let presentDays = attends.employeeAttendance;
                                                let totalPresent = [];
                                                let totalWorkingDay = [];
                                                carryForward = attends?.carryForward;
                                                if (index2 + 1 == attends.attendanceMonth) {
                                                    totalPresent = presentDays.filter(
                                                        (attendance) =>
                                                            attendance.attendance == true ||
                                                            attendance.leave == 'Paid Leave' ||
                                                            attendance.leave == 'Accident Leave' ||
                                                            attendance.leave == 'Maternity Leave' ||
                                                            (attendance.leave == 'Casual Leave' &&
                                                                parseInt(item?.empData?.companyDetails?.casualLeave) > 0) ||
                                                            (attendance.leave == 'Sick Leave' &&
                                                                item?.empData?.companyDetails?.sickLeave > 0)
                                                    );
                                                    totalWorkingDay = presentDays.filter((attendance) => attendance.attendance == true);
                                                    maternityLeave = presentDays.filter(
                                                        (attendance) => attendance.leave == 'Maternity Leave'
                                                    );
                                                }
                                                totalDaysofWorking += totalWorkingDay.length;
                                                totalDaysofAttend += totalPresent.length;
                                            })}
                                        </>
                                    );
                                })}
                                <table
                                    style={{ textAlign: 'center', width: '100%', borderCollapse: 'collapse', marginBottom: '110px' }}
                                    width="100%"
                                >
                                    <tr>
                                        <td colSpan={9} style={{ borderCollapse: 'collapse', padding: '5px' }}>
                                            {' '}
                                            FORM NO: 18{' '}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={9} style={{ borderCollapse: 'collapse', padding: '5px' }}>
                                            (Prescribed under Rule 94)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={9} style={{ borderCollapse: 'collapse', padding: '5px' }}>
                                            Register of Leave with Wages
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'left', padding: '5px' }} colSpan={5}>
                                            Factory: TOTAL HR
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'right', padding: '5px' }} colSpan={5}>
                                            Part I- Adults{' '}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'left', padding: '5px' }} colSpan={5}>
                                            {orders?.user?.companyName}
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'right', padding: '5px' }} colSpan={5}>
                                            Part II - Children
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={9} style={{ borderCollapse: 'collapse', textAlign: 'left', padding: '5px' }}>
                                            {orders?.user?.companyAddress}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'left', padding: '5px' }} colSpan={5}>
                                            Department :
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'right', width: '100%' }} colSpan={5}>
                                            Name: {item?.empData?.personalDetails?.fullName}
                                            <br />
                                            Father's Name: {item?.empData?.personalDetails?.fatherName}
                                        </td>
                                    </tr>
                                    <tr style={{ borderTop: '3px solid black' }}>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>Sr. No.</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Sr No. in the register of adult Child workers
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Date of entry info service
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Calender year service
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            No of days of work performed
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            No of days of lay off
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            No of days of maternity leave with wages
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            No of days of leave with wages enjoyed
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Total columns 5 to 8
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>1</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>2</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>3</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>4</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>5</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>6</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>7</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>8</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>9</th>
                                    </tr>
                                    <tr style={{ borderTop: '1px solid black' }}>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>{index + 1}</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}></td>

                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            {' '}
                                            {formatDate(item?.empData?.companyDetails?.joiningDate)}
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            {todayDates.getFullYear() + '-' + (parseInt(todayDates.getFullYear()) + 1)}
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            {totalDaysofWorking}
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>0</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            {maternityLeave?.length}
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>0</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            {totalDaysofWorking + maternityLeave?.length}
                                        </td>
                                    </tr>
                                    <tr style={{ borderTop: '3px solid black', borderBottom: '3px solid black' }}>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'left', padding: '5px' }} colSpan={9}>
                                            LEAVE WITH WAGES TO CREDIT
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Bal of Leave with the wages from the preceeding year{' '}
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Leave with wages during the year (mentioned in column4)
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Total of columns 10 & 11
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            whether leave with wages refused in accordance with schemes under sec 79(8)
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            whether leave with wages not desired during the next calender year
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            Leave with wages enjoyed
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>Balance credit</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Normal rates of wages
                                        </th>
                                    </tr>
                                    <tr style={{ borderTop: '1px solid black' }}>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>10</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>11</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>12</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>13</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>14</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            15
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>16</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>17</th>
                                    </tr>
                                    <tr style={{ borderBottom: '2px solid black' }}>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>0</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>{carryForward}</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>{carryForward}</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>No</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>No</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            0
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>0</td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>0</td>
                                    </tr>
                                    <tr>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            Cash Equivalent or advantage sccruing through concessional Sale of food grains or other articles
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            Rate of wages for leave with wages period (total of columns 17 & 18)
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            Discharged worker date of discharges
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>
                                            Date and amount of payment made in lieu of leave with wages due
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            Remarks
                                        </th>
                                    </tr>
                                    <tr style={{ borderTop: '1px solid black' }}>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            18
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            19
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            20
                                        </th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}>21</th>
                                        <th style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            22
                                        </th>
                                    </tr>
                                    <tr>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            0
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            0
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}>
                                            Nil
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }}></td>
                                        <td style={{ borderCollapse: 'collapse', textAlign: 'center', padding: '5px' }} colSpan={2}></td>
                                    </tr>
                                </table>
                            </>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default LeaveManage;
