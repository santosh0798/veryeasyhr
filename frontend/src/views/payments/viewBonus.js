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

function bonusReportDownload() {
    const pdfTable = document.getElementById('capture');
    /* eslint-disable new-cap */
    const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' });
    pdf.html(pdfTable, { html2canvas: { scale: 0.38 } }).then(() => {
        pdf.save('employee_bonus_list.pdf');
    });
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

const ViewBonus = () => {
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(1);
    const [attend, setAttend] = React.useState([]);
    const [pdfAttend, setPdfAttend] = React.useState([]);
    const [date, setdate] = React.useState(new Date());
    const [showdetails, setshowdetails] = React.useState(true);
    const [showIndex, setshowIndex] = React.useState(0);
    const [minWagesFull, setMinWages] = React.useState(0);

    const { error, orders } = useSelector((state) => state.myCompany);

    React.useEffect(() => {
        dispatch(getCompany());
        async function getAtt() {
            const x = await axios.get(`http://localhost:4000/api/v1/employee/bonus/mylist/${date.getFullYear()}?page=${page}`, {
                withCredentials: true
            });
            setAttend(x.data);

            const y = await axios.get(`http://localhost:4000/api/v1/employee/bonus/mylist/${date.getFullYear()}?page=${0}&limit=${999999999}`, {
                withCredentials: true
            });
            setPdfAttend(y.data);
        }
        getAtt();
    }, [page, date]);

    React.useEffect(() => {
        let tempDate = orders?.user?.wages?.sort(function (a, b) {
            return new Date(a.bonasFrom) - new Date(b.bonasFrom);
        });
        setMinWages(tempDate);
    }, [orders, date]);


    console.log(minWagesFull);


    const handleChange = (event, value) => {
        setPage(value);
    };
    const handleDate = (date) => {
        setdate(date);
    };
    const month = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const numMonth = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

    return (
        <>
            <StyledMainCard>
                <AttendanceTopbar
                    name="Manage Employee Bonus"
                    search="true"
                    parentCallback2={handleDate}
                    parentCallback5={bonusReportDownload}
                    leave="true"
                    date="true"
                    downloadButton="Bonus"
                />
                <Typography variant="body2">
                    <StyledContainer component={Paper}>
                        <StyledTable sx={{ minWidth: 650 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledHeader align="center" rowSpan={showdetails == true ? 1 : 2}>
                                        Sr No.
                                    </StyledHeader>
                                    <StyledHeader align="center" rowSpan={showdetails == true ? 1 : 2}>
                                        Name
                                    </StyledHeader>
                                    <StyledHeader align="center" rowSpan={showdetails == true ? 1 : 2}>
                                        Joining Date
                                    </StyledHeader>

                                    {showdetails == true ? (
                                        month.map((item, index) => {
                                            return (
                                                <StyledHeader
                                                    align="center"
                                                    style={{ cursor: 'pointer' }}
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
                                            colSpan={4}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setshowdetails(true);
                                            }}
                                        >
                                            {month[showIndex]}
                                        </StyledHeader>
                                    )}
                                    {showdetails == true && <StyledHeader align="center">Total</StyledHeader>}
                                </TableRow>
                                <TableRow>
                                    {showdetails != true && (
                                        <>
                                            <StyledHeader align="center">Wages Earned</StyledHeader>
                                            <StyledHeader align="center">Minimum Wages</StyledHeader>
                                            <StyledHeader align="center">Total Pay Day</StyledHeader>
                                            <StyledHeader align="center">Bonus Wages</StyledHeader>
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attend?.attendance?.map((item, index) => {
                                    let totalDaysofWorking = 0;
                                    let totalDaysofAttend = 0;
                                    let totalBonus = 0;

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

                                            {showdetails == true
                                                ? numMonth.map((months, index2) => {
                                                    let minWages = 0;
                                                    let filteredWages = minWagesFull?.filter((wage) => item?.empData?.companyDetails?.designation == wage?.designation);

                                                    console.log("filtered=======>", filteredWages)
                                                    if (filteredWages && filteredWages?.length != 0 && new Date(
                                                        months < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                        months,
                                                        0
                                                    ) > new Date(filteredWages[0]?.bonasFrom) &&
                                                        filteredWages?.length == 1) {
                                                        minWages = filteredWages[0]?.minimumWages;

                                                    }
                                                    else if (filteredWages) {
                                                        for (let i = 1; i < filteredWages?.length; i++) {



                                                            if (filteredWages?.length != 0 &&
                                                                new Date(
                                                                    months < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                                    months,
                                                                    0
                                                                ) > new Date(filteredWages[i]?.bonasFrom) &&
                                                                i == filteredWages?.length - 1
                                                            ) {
                                                                minWages = filteredWages[i]?.minimumWages;
                                                            } else if (
                                                                new Date(
                                                                    months < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                                    months,
                                                                    0
                                                                ) >= new Date(filteredWages[i - 1]?.bonasFrom) &&
                                                                new Date(
                                                                    months < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                                    months,
                                                                    0
                                                                ) < new Date(filteredWages[i]?.bonasFrom)
                                                            ) {
                                                                minWages = filteredWages[i - 1]?.minimumWages;
                                                            }
                                                        }
                                                    }
                                                    return (
                                                        <>
                                                            {item?.attandanceData?.map((attends, index3) => {
                                                                let presentDays = attends.employeeAttendance;
                                                                let totalPresent = [];
                                                                let totalWorkingDay = [];

                                                                if (months == attends.attendanceMonth) {
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
                                                                totalDaysofAttend += totalPresent.length;

                                                                if (months == attends.attendanceMonth) {
                                                                    tempArray[index2] = {
                                                                        totalDaysofWorking: totalWorkingDay.length,
                                                                        totalDaysofAttend: totalPresent.length
                                                                    };

                                                                    if (
                                                                        (item?.empData?.companyDetails?.selectWages == 'Monthly Wages' &&
                                                                            parseInt(item?.empData?.salaryDetails?.basicSalary) >
                                                                            21000) ||
                                                                        tempArray[index2].totalDaysofAttend == 0 ||
                                                                        (item?.empData?.companyDetails?.selectWages == 'Daily Wages' &&
                                                                            parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                            daysInMonth(months, date.getFullYear()) >
                                                                            21000)
                                                                    ) {
                                                                        totalBonus += 0;
                                                                    } else if (
                                                                        (item?.empData?.companyDetails?.selectWages == 'Monthly Wages' &&
                                                                            parseInt(item?.empData?.salaryDetails?.basicSalary) /
                                                                            daysInMonth(months, date.getFullYear()) >
                                                                            minWages) ||
                                                                        (item?.empData?.companyDetails?.selectWages == 'Daily Wages' &&
                                                                            parseInt(item?.empData?.salaryDetails?.basicSalary) >
                                                                            minWages)
                                                                    ) {
                                                                        totalBonus += parseInt(
                                                                            minWages * tempArray[index2].totalDaysofAttend
                                                                        );
                                                                    } else if (
                                                                        item?.empData?.companyDetails?.selectWages == 'Monthly Wages'
                                                                    ) {
                                                                        totalBonus += parseInt(
                                                                            parseInt(
                                                                                parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                                tempArray[index2].totalDaysofAttend
                                                                            ) / daysInMonth(months, date.getFullYear())
                                                                        );
                                                                    } else {
                                                                        totalBonus += parseInt(
                                                                            parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                            tempArray[index2].totalDaysofAttend
                                                                        );
                                                                    }
                                                                }
                                                                if (index3 == item?.attandanceData?.length - 1) {
                                                                    return (
                                                                        <>
                                                                            <TableCell align="center">
                                                                                {(item?.empData?.companyDetails?.selectWages ==
                                                                                    'Monthly Wages' &&
                                                                                    parseInt(item?.empData?.salaryDetails?.basicSalary) >
                                                                                    21000) ||
                                                                                    tempArray[index2].totalDaysofAttend == 0
                                                                                    ? 0
                                                                                    : (item?.empData?.companyDetails?.selectWages ==
                                                                                        'Daily Wages' &&
                                                                                        parseInt(
                                                                                            item?.empData?.salaryDetails?.basicSalary
                                                                                        ) *
                                                                                        daysInMonth(months, date.getFullYear()) >
                                                                                        21000) ||
                                                                                        tempArray[index2].totalDaysofAttend == 0
                                                                                        ? 0
                                                                                        : item?.empData?.companyDetails?.selectWages ==
                                                                                            'Monthly Wages' &&
                                                                                            parseInt(
                                                                                                item?.empData?.salaryDetails?.basicSalary
                                                                                            ) /
                                                                                            daysInMonth(months, date.getFullYear()) >
                                                                                            minWages
                                                                                            ? parseInt(
                                                                                                minWages * tempArray[index2].totalDaysofAttend
                                                                                            )
                                                                                            : item?.empData?.companyDetails?.selectWages ==
                                                                                                'Daily Wages' &&
                                                                                                parseInt(
                                                                                                    item?.empData?.salaryDetails?.basicSalary
                                                                                                ) > minWages
                                                                                                ? parseInt(
                                                                                                    minWages * tempArray[index2].totalDaysofAttend
                                                                                                )
                                                                                                : item?.empData?.companyDetails?.selectWages ==
                                                                                                    'Monthly Wages'
                                                                                                    ? parseInt(
                                                                                                        parseInt(
                                                                                                            parseInt(
                                                                                                                item?.empData?.salaryDetails
                                                                                                                    ?.basicSalary
                                                                                                            ) * tempArray[index2].totalDaysofAttend
                                                                                                        ) / daysInMonth(months, date.getFullYear())
                                                                                                    )
                                                                                                    : parseInt(
                                                                                                        parseInt(
                                                                                                            item?.empData?.salaryDetails?.basicSalary
                                                                                                        ) * tempArray[index2].totalDaysofAttend
                                                                                                    )}
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
                                                    let totalPresent = [];
                                                    let minWages = 0;
                                                    let filteredWages = minWagesFull?.filter((wage) => item?.empData?.companyDetails?.designation == wage?.designation);

                                                    if (filteredWages &&
                                                        filteredWages?.length != 0 && new Date(
                                                            numMonth[showIndex] < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                            numMonth[showIndex],
                                                            0
                                                        ) > new Date(filteredWages[0]?.bonasFrom) &&
                                                        filteredWages?.length == 1) {
                                                        minWages = filteredWages[0]?.minimumWages;

                                                    }

                                                    else if (filteredWages) {
                                                        for (let i = 1; i < filteredWages?.length; i++) {



                                                            if (
                                                                new Date(
                                                                    numMonth[showIndex] < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                                    numMonth[showIndex],
                                                                    0
                                                                ) > new Date(filteredWages[i]?.bonasFrom) &&
                                                                i == filteredWages?.length - 1
                                                            ) {
                                                                minWages = filteredWages[i]?.minimumWages;
                                                            } else if (
                                                                new Date(
                                                                    numMonth[showIndex] < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                                    numMonth[showIndex],
                                                                    0
                                                                ) >= new Date(filteredWages[i - 1]?.bonasFrom) &&
                                                                new Date(
                                                                    numMonth[showIndex] < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                                    numMonth[showIndex],
                                                                    0
                                                                ) < new Date(filteredWages[i]?.bonasFrom)
                                                            ) {
                                                                minWages = filteredWages[i - 1]?.minimumWages;
                                                            }
                                                        }
                                                    }
                                                    if (numMonth[showIndex] == attends.attendanceMonth) {
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
                                                    }
                                                    if (numMonth[showIndex] == attends.attendanceMonth) {
                                                        return (
                                                            <>
                                                                <TableCell align="center">
                                                                    {item?.empData?.companyDetails?.selectWages == 'Monthly Wages'
                                                                        ? parseInt(
                                                                            (item?.empData?.salaryDetails?.basicSalary *
                                                                                totalPresent?.length) /
                                                                            daysInMonth(numMonth[showIndex], date.getFullYear())
                                                                        )
                                                                        : item?.empData?.salaryDetails?.basicSalary *
                                                                        totalPresent?.length}
                                                                </TableCell>
                                                                <TableCell align="center">{minWages * totalPresent?.length}</TableCell>
                                                                <TableCell align="center">{totalPresent?.length}</TableCell>
                                                                <TableCell align="center">
                                                                    {console.log(minWages)}
                                                                    {item?.empData?.companyDetails?.selectWages == 'Monthly Wages' &&
                                                                        parseInt(item?.empData?.salaryDetails?.basicSalary) > 21000
                                                                        ? 0
                                                                        : item?.empData?.companyDetails?.selectWages == 'Daily Wages' &&
                                                                            parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                            daysInMonth(numMonth[showIndex], date.getFullYear()) >
                                                                            21000
                                                                            ? 0
                                                                            : item?.empData?.companyDetails?.selectWages == 'Monthly Wages' &&
                                                                                parseInt(item?.empData?.salaryDetails?.basicSalary) /
                                                                                daysInMonth(numMonth[showIndex], date.getFullYear()) >
                                                                                minWages
                                                                                ? parseInt(minWages * totalPresent?.length)
                                                                                : item?.empData?.companyDetails?.selectWages == 'Daily Wages' &&
                                                                                    parseInt(item?.empData?.salaryDetails?.basicSalary) > minWages
                                                                                    ? parseInt(minWages * totalPresent?.length)
                                                                                    : item?.empData?.companyDetails?.selectWages == 'Monthly Wages'
                                                                                        ? parseInt(
                                                                                            parseInt(
                                                                                                parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                                                totalPresent?.length
                                                                                            ) / daysInMonth(numMonth[showIndex], date.getFullYear())
                                                                                        )
                                                                                        : parseInt(
                                                                                            parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                                            totalPresent?.length
                                                                                        )}
                                                                </TableCell>
                                                            </>
                                                        );
                                                    }
                                                })}
                                            {showdetails == true && (
                                                <>
                                                    <TableCell align="center">
                                                        {parseInt((totalBonus * orders?.user?.bonusPercentage) / 100)}
                                                    </TableCell>
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
                <div id="capture" style={{ textAlign: 'center', width: '100%', margin: '10px', marginTop: '20px' }} width="100%">
                    <table
                        style={{
                            textAlign: 'center',
                            width: '100%',
                            borderCollapse: 'collapse',
                            border: '1px solid black',
                            marginTop: '30px'
                        }}
                        width="100%"
                    >
                        <tr>
                            <td colSpan={16} style={{ borderCollapse: 'collapse', padding: '5px' }}>
                                {' '}
                                FORM C{' '}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={16} style={{ borderCollapse: 'collapse', padding: '5px' }}>
                                [See rule 4 (c)]
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={16} style={{ borderCollapse: 'collapse', padding: '5px' }}>
                                BONUS PAID TO EMPLOYEES FOR THE ACCOUNTING YEAR ENDING ON THE{' '}
                                {date.getFullYear() + '-' + date.getFullYear() + 1}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ borderCollapse: 'collapse', padding: '5px' }} colSpan={16}>
                                {orders?.user?.companyName}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ borderCollapse: 'collapse', padding: '5px' }} colSpan={16}>
                                {orders?.user?.companyAddress}
                            </td>
                        </tr>

                        <tr>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Sr. No.
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Name of the employee
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Whether he has completed 15 years of age at the beginning of the accounting year
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Designation
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                No. of days worked in the year
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Total salary or wage in respect of the accounting year
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Amount of bonus payable under section 10 or section 11 as the case may be
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Puja bonus or other customary bonus during the accounting year
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Interim bonus of bonus paid advance
                            </th>
                            <th
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                                colSpan={3}
                            >
                                Deductions
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Net Amount Payable (Column 8 minus Column 12)
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Amount actually paid
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Date on which paid Bank A/C
                            </th>
                            <th
                                rowSpan={2}
                                style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}
                            >
                                Signature/thumb impression of the employee
                            </th>
                        </tr>
                        <tr>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                [Amount of income-tax deducted]
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                Deduction on account of financial loss, if any, caused by misconduct of employee
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                [Total sum deducted under columns 9, 10, 10A and 11]
                            </th>
                        </tr>

                        <tr>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                1
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                2
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                3
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                4
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                5
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                6
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                7
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                8
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                9
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                10
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                11
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                12
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                13
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                14
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                15
                            </th>
                            <th style={{ borderCollapse: 'collapse', border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                16
                            </th>
                        </tr>
                        {pdfAttend?.attendance?.map((item, index) => {
                            let totalDaysofWorking = 0;
                            let totalDaysofAttend = 0;
                            let totalBonus = 0;
                            let totalSal = 0;
                            let todayDates = new Date();
                            return (
                                <>
                                    {numMonth.map((months, index2) => {
                                        let minWages = 0;
                                        let filteredWages = minWagesFull?.filter((wage) => item?.empData?.companyDetails?.designation == wage?.designation);

                                        console.log("filtered=======>", filteredWages)
                                        if (filteredWages && filteredWages?.length != 0 && new Date(
                                            months < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                            months,
                                            0
                                        ) > new Date(filteredWages[0]?.bonasFrom) &&
                                            filteredWages?.length == 1) {
                                            minWages = filteredWages[0]?.minimumWages;

                                        }
                                        else if (filteredWages) {
                                            for (let i = 1; i < filteredWages?.length; i++) {



                                                if (filteredWages?.length != 0 &&
                                                    new Date(
                                                        months < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                        months,
                                                        0
                                                    ) > new Date(filteredWages[i]?.bonasFrom) &&
                                                    i == filteredWages?.length - 1
                                                ) {
                                                    minWages = filteredWages[i]?.minimumWages;
                                                } else if (
                                                    new Date(
                                                        months < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                        months,
                                                        0
                                                    ) >= new Date(filteredWages[i - 1]?.bonasFrom) &&
                                                    new Date(
                                                        months < 4 ? date.getFullYear() + 1 : date.getFullYear(),
                                                        months,
                                                        0
                                                    ) < new Date(filteredWages[i]?.bonasFrom)
                                                ) {
                                                    minWages = filteredWages[i - 1]?.minimumWages;
                                                }
                                            }
                                        }
                                        return (
                                            <>
                                                {item?.attandanceData?.map((attends, index3) => {
                                                    let presentDays = attends.employeeAttendance;
                                                    let totalPresent = [];
                                                    let totalWorkingDay = [];
                                                    if (months == attends.attendanceMonth) {
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
                                                    }
                                                    totalDaysofWorking += totalWorkingDay.length;
                                                    totalDaysofAttend += totalPresent.length;

                                                    if (months == attends.attendanceMonth) {
                                                        totalBonus +=
                                                            (item?.empData?.companyDetails?.selectWages == 'Monthly Wages' &&
                                                                parseInt(item?.empData?.salaryDetails?.basicSalary) > 21000) ||
                                                                totalPresent.length == 0
                                                                ? 0
                                                                : item?.empData?.companyDetails?.selectWages == 'Daily Wages' &&
                                                                    parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                    daysInMonth(months, date.getFullYear()) >
                                                                    21000
                                                                    ? 0
                                                                    : item?.empData?.companyDetails?.selectWages == 'Monthly Wages' &&
                                                                        parseInt(item?.empData?.salaryDetails?.basicSalary) /
                                                                        daysInMonth(months, date.getFullYear()) >
                                                                        minWages
                                                                        ? parseInt(minWages * totalPresent?.length)
                                                                        : item?.empData?.companyDetails?.selectWages == 'Daily Wages' &&
                                                                            parseInt(item?.empData?.salaryDetails?.basicSalary) > minWages
                                                                            ? parseInt(minWages * totalPresent?.length)
                                                                            : item?.empData?.companyDetails?.selectWages == 'Monthly Wages'
                                                                                ? parseInt(
                                                                                    parseInt(
                                                                                        parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                                        totalPresent?.length
                                                                                    ) / daysInMonth(months, date.getFullYear())
                                                                                )
                                                                                : parseInt(
                                                                                    parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                                    totalPresent?.length
                                                                                );

                                                        if (item?.empData?.companyDetails?.selectWages == 'Monthly Wages') {
                                                            totalSal += parseInt(
                                                                (parseInt(item?.empData?.salaryDetails?.basicSalary) *
                                                                    totalPresent?.length) /
                                                                daysInMonth(months, date.getFullYear())
                                                            );
                                                        } else {
                                                            totalSal += parseInt(
                                                                parseInt(item?.empData?.salaryDetails?.basicSalary) * totalPresent?.length
                                                            );
                                                        }
                                                    }
                                                })}
                                            </>
                                        );
                                    })}

                                    <tr style={{ borderTop: '1px solid black' }}>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            {index + 1}
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            {item?.empData?.personalDetails?.fullName}
                                        </td>

                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            YES
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            {item?.empData?.companyDetails?.designation}
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            {totalDaysofAttend}
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            {totalSal}
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            {parseInt((totalBonus * orders?.user?.bonusPercentage) / 100)}
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            Nil
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            Nil
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            Nil
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            Nil
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            Nil
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            {parseInt((totalBonus * orders?.user?.bonusPercentage) / 100)}
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            {parseInt((totalBonus * orders?.user?.bonusPercentage) / 100)}
                                        </td>
                                        <td
                                            style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        ></td>
                                    </tr>
                                </>
                            );
                        })}
                    </table>
                </div>
            </div>
        </>
    );
};

export default ViewBonus;
