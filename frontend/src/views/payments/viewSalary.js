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
    StyledTable,
    StyledTableRow,
    StyledTableCell,
    StyledMainCardSalary
} from 'ui-component/tables/tablestyle';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import Pagination from '@mui/material/Pagination';
import PaymentSidepanel from 'ui-component/payment/paymentsidepanel';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import {useDispatch, useSelector} from 'react-redux';
import {myEmployee} from 'store/actions/employeeAction';
import formatDate from 'utils/date-format';
import {clearErrors} from 'store/actions/userActions';
import axios from 'axios';
import {getCompany} from 'store/actions/companyAction';

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

const getAttendence = async (employee) => {
    const date = new Date();
    const {data} = await axios
        .get(`http://localhost:4000/api/v1/employee/attendance/mylist/${date.getMonth() + 1}/${date.getFullYear()}/${employee}`, {
            withCredentials: true
        })
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
    console.log(data);
    let count = 0;
    for (let i = 0; i < data?.employeesAttendance[0]?.employeesAttendance?.length; i += 1) {
        if (data.employeesAttendance[0]?.employeesAttendance[i]?.attendance === true) {
            count += 1;
        }
    }
    return count;
};

function printDocument() {
    const pdfTable = document.getElementById('capture');
    // html to pdf format
    const html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = {
        content: html,

        styles: {
            table: {
                textAlign: 'center',
                borderCollapse: 'collapse',
                width: '100%'
            },
            th: {
                border: '1px solid black',
                borderCollapse: 'collapse',
                padding: '10px 20px'
            },
            td: {
                border: '1px solid black',
                borderCollapse: 'collapse',
                padding: '10px 20px'
            }
        }
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentDefinition).download();
}

function salarySheetDownload() {
    const pdfTable = document.getElementById('capture2');
    /* eslint-disable new-cap */
    const pdf = new jsPDF({unit: 'px', format: 'a4', userUnit: 'px'});
    pdf.html(pdfTable, {html2canvas: {scale: 0.305}}).then(() => {
        pdf.save('salary_sheet.pdf');
    });
}

function wagesSlipDownload() {
    const pdfTable = document.getElementById('wage');
    /* eslint-disable new-cap */
    const pdf = new jsPDF({unit: 'px', format: 'a4', userUnit: 'px'});
    pdf.html(pdfTable, {html2canvas: {scale: 0.309}}).then(() => {
        pdf.save('wages_slip.pdf');
    });
}

// ==============================|| View Salary Page ||============================== //

const ViewSalary = () => {
    const [open, setOpen] = React.useState('inactivesidebar');
    const [page, setPage] = React.useState(1);
    const [date, setdate] = React.useState(new Date());
    const [data, setdata] = React.useState({});
    const [employeeAttendance, setemployeeAttendance] = React.useState([]);
    const [datacount, setdatacount] = React.useState({});
    const [pdfData, setpdfData] = React.useState([]);
    const handleClickOpen = (item) => {
        setOpen('activesidebar');
        setdata(item);
    };

    const {error, orders} = useSelector((state) => state.myEmployee);
    const companys = useSelector((state) => state.myCompany);

    console.log("companys", companys)

    const handleClose = () => {
        setOpen('inactivesidebar');
    };

    const dispatch = useDispatch();

    React.useEffect(() => {
        axios
            .get(
                `http://localhost:4000/api/v1/employee/attendance/mylist/${date.getMonth() + 1}/${date.getFullYear()}?limit=${9999999999}`,
                {
                    withCredentials: true
                }
            )
            .then((data) => {
                setemployeeAttendance(data.data.employeesAttendance);
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [date, page]);

    React.useEffect(() => {
        dispatch(myEmployee(page));
        dispatch(getCompany());

        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch, page]);

    React.useEffect(() => {
        const func = async () => {
            const {data} = await axios.get(`http://localhost:4000/api/v1/employees/mylist?page=${page}&limit=${99999999}`, {
                withCredentials: true
            });
            setpdfData(data);
        };
        func();
    }, []);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleDate = (date) => {
        setdate(date);
    };

    const getAttendence = (employee) => {
        let count = 0;
        let ot = 0;

        for (let j = 0; j < employeeAttendance.length; j += 1) {
            if (employeeAttendance[j]?.employee === employee) {
                for (let i = 0; i < employeeAttendance[j]?.employeeAttendance?.length; i += 1) {
                    if (
                        employeeAttendance[j]?.employeeAttendance[i]?.attendance === true ||
                        employeeAttendance[j]?.employeeAttendance[i]?.leave === 'Casual Leave' ||
                        employeeAttendance[j]?.employeeAttendance[i]?.leave === 'Sick Leave' ||
                        employeeAttendance[j]?.employeeAttendance[i]?.leave === 'Paid Leave' ||
                        employeeAttendance[j]?.employeeAttendance[i]?.leave === 'Paid Holiday' ||
                        employeeAttendance[j]?.employeeAttendance[i]?.leave === 'Paid Weekly Off' ||
                        employeeAttendance[j]?.employeeAttendance[i]?.leave === 'Accident Leave' ||
                        employeeAttendance[j]?.employeeAttendance[i]?.leave === 'Maternity Leave'
                    ) {
                        count += 1;
                    }
                    if (employeeAttendance[j]?.employeeAttendance[i]?.overtime) {
                        ot += employeeAttendance[j]?.employeeAttendance[i]?.overtime;
                    }
                }

                return {count, ot, allowance: employeeAttendance[j]?.allowancesNReject};
            }
        }
        return 0;
    };
    console.log(orders);
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return (
        <>
            <StyledMainCardSalary>
                <AttendanceTopbar
                    name="View Salary List"
                    salary="true"
                    date="true"
                    parentCallback4={wagesSlipDownload}
                    wagesformat="true"
                    parentCallback={printDocument}
                    parentCallback3={salarySheetDownload}
                    salaryformat="true"
                    parentCallback2={handleDate}
                />
                <Typography variant="body2">
                    <StyledContainer component={Paper}>
                        <StyledTable sx={{minWidth: 650}} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">#</StyledTableCell>
                                    <StyledTableCell align="center">UAN</StyledTableCell>
                                    <StyledTableCell align="center">Name</StyledTableCell>
                                    <StyledTableCell align="center">Paid Days</StyledTableCell>
                                    <StyledTableCell align="center">OT Hours</StyledTableCell>
                                    <StyledTableCell align="center">Bank Name</StyledTableCell>
                                    <StyledTableCell align="center">Account No</StyledTableCell>
                                    <StyledTableCell align="center">Net Salary</StyledTableCell>
                                    <StyledTableCell align="center">View Salary</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders?.employees?.map((item, index) => {

                                    const count = getAttendence(item._id);
                                    const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;

                                    console.log(Math.round(item?.salaryDetails?.basicSalary));
                                    /* eslint no-underscore-dangle: 0 */
                                    return (
                                        <StyledTableRow
                                            key={(page - 1) * 10 + index + 1}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell align="center" component="th" scope="row">
                                                {(page - 1) * 10 + index + 1}
                                            </TableCell>
                                            <TableCell align="center">{item?.companyDetails?.UAN}</TableCell>
                                            <TableCell align="center">{item?.personalDetails?.fullName}</TableCell>
                                            <TableCell align="center">{count?.count ? count?.count : 0}</TableCell>
                                            <TableCell align="center">{count?.ot ? count?.ot : 0}</TableCell>
                                            <TableCell align="center">{item?.bankDetails?.bankName}</TableCell>
                                            <TableCell align="center">{item?.bankDetails?.accountNo}</TableCell>
                                            <TableCell align="center">
                                                {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                    ? Math.round(
                                                    (item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                    totalDaysOfMonth +
                                                    (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                    (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                    (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                    totalDaysOfMonth +
                                                    (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                    totalDaysOfMonth +
                                                    ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                        totalDaysOfMonth +
                                                        (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                        (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                        (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                        totalDaysOfMonth +
                                                        (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                        totalDaysOfMonth) / 26 / 4 *
                                                    (count.ot ? count.ot : 0) -
                                                    (item?.salaryDetails?.incomeTax) -
                                                    (((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                            totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                ) - Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                                    0,
                                                )) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                                    0,
                                                ))
                                                    : Math.round(
                                                    item?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                                    item?.salaryDetails?.hra * parseInt(count.count, 10) +
                                                    item?.salaryDetails?.con * parseInt(count.count, 10) +
                                                    item?.salaryDetails?.medical * parseInt(count.count, 10) +
                                                    item?.salaryDetails?.education * parseInt(count.count, 10) +
                                                    ((item?.salaryDetails?.basicSalary + item?.salaryDetails?.hra + item?.salaryDetails?.con + item?.salaryDetails?.medical + item?.salaryDetails?.education) / 4) * (count.ot ? count.ot : 0) -
                                                    (item?.salaryDetails?.basicSalary * parseInt(count.count, 10) * 12) / 100
                                                ) - Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                                    0,
                                                )) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                                    0,
                                                ))}
                                            </TableCell>
                                            <TableCell align="center">
                                                <TableViewOutlinedIcon
                                                    onClick={() => {
                                                        handleClickOpen(item);
                                                        setdatacount(count);
                                                    }}
                                                    style={{cursor: 'pointer'}}
                                                />
                                            </TableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </StyledTable>
                        <Pagination
                            count={Math.floor(orders?.employeeCount / 10) + 1}
                            color="primary"
                            style={{float: 'right'}}
                            page={page}
                            onChange={handleChange}
                        />
                    </StyledContainer>
                </Typography>
                <div className={`view-salary-sidebar ${open}`}>
                    <Typography variant="body2">
                        <PaymentSidepanel
                            data={data}
                            parentCallback={handleClose}
                            count={datacount}
                            todaydays={parseInt(datacount.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26}
                        />
                    </Typography>
                </div>
            </StyledMainCardSalary>
            <div id="capture" style={{display: 'none'}}>
                <table style={{textAlign: 'center', width: '100%', borderCollapse: 'collapse'}} width="100%">
                    <thead>
                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} colSpan="5">
                            {companys?.orders?.user?.companyName}
                        </td>
                    </tr>
                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} colSpan="5">
                            Bank Statement Salary Disbursement {month[date.getMonth()]}-{date.getDate()}
                        </td>
                    </tr>
                    <tr>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>Sr No</th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>Name</th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>Bank Account
                            Number
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>Bank IFSC
                            Code
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>Payable
                            Amount
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {pdfData?.employees?.map((item, index) => {

                        /* eslint no-underscore-dangle: 0 */
                        const count = getAttendence(item._id);

                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;

                        return (
                            <tr>
                                <td style={{
                                    border: '1px solid black',
                                    borderCollapse: 'collapse',
                                    padding: '5px'
                                }}>{index + 1}</td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item.personalDetails.fullName}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item.bankDetails.accountNo}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item.bankDetails.ifscCode}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item?.companyDetails?.selectWages === 'Monthly Wages'
                                        ? Math.round(
                                        (item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                            totalDaysOfMonth) / 26 / 4 *
                                        (count.ot ? count.ot : 0) -
                                        (item?.salaryDetails?.incomeTax) -
                                        (item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                            item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                        ) : (
                                            0
                                        ))
                                    ) - Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    )) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    ))
                                        : Math.round(
                                        item?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                        item?.salaryDetails?.hra * parseInt(count.count, 10) +
                                        item?.salaryDetails?.con * parseInt(count.count, 10) +
                                        item?.salaryDetails?.medical * parseInt(count.count, 10) +
                                        item?.salaryDetails?.education * parseInt(count.count, 10) +
                                        ((item?.salaryDetails?.basicSalary + item?.salaryDetails?.hra + item?.salaryDetails?.con + item?.salaryDetails?.medical + item?.salaryDetails?.education) / 4) * (count.ot ? count.ot : 0) -
                                        (item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                            item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                        ) : (
                                            0
                                        ))
                                    ) - Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    )) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    ))}
                                </td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>


                        <td>Total</td>

                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            {}


                            {pdfData?.employees?.reduce((total, num) => {
                                const count = getAttendence(num._id);
                                const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                    ? Math.round(
                                        (num?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        (num?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (num?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (num?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        (num?.salaryDetails?.education * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        ((num?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (num?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (num?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (num?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (num?.salaryDetails?.education * parseInt(count.count, 10)) /
                                            totalDaysOfMonth) / 26 / 4 *
                                        (count.ot ? count.ot : 0) -
                                        (num?.salaryDetails?.incomeTax) -
                                        (num?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : num?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (num?.pfDetails?.wereMember == 'Yes' && num?.pfDetails?.withdrawn == 'No') ? (
                                            num?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((num?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((num?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                        ) : (
                                            0
                                        ))
                                    )
                                    : Math.round(
                                        num?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                        num?.salaryDetails?.hra * parseInt(count.count, 10) +
                                        num?.salaryDetails?.con * parseInt(count.count, 10) +
                                        num?.salaryDetails?.medical * parseInt(count.count, 10) +
                                        num?.salaryDetails?.education * parseInt(count.count, 10) +
                                        ((num?.salaryDetails?.basicSalary + num?.salaryDetails?.hra + num?.salaryDetails?.con + num?.salaryDetails?.medical + num?.salaryDetails?.education) / 4) * (count.ot ? count.ot : 0) -
                                        (num?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : num?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (num?.pfDetails?.wereMember == 'Yes' && num?.pfDetails?.withdrawn == 'No') ? (
                                            num?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((num?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((num?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                        ) : (
                                            0
                                        ))
                                    )


                                temp -= Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                    0,
                                ))

                                temp += Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                    0,
                                ))

                                return (total + temp)
                            }, 0)}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style={{display: 'none'}}>
                <table
                    id="capture2"
                    style={{textAlign: 'center', width: '100%', borderCollapse: 'collapse', margin: '10px'}}
                    width="100%"
                >
                    <thead>
                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}
                            colSpan="22">
                            SCHEDULE
                        </td>
                    </tr>
                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}
                            colSpan="22">
                            [See Rule 2(1)]
                        </td>
                    </tr>
                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}
                            colSpan="22">
                            FORM B
                        </td>
                    </tr>
                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}
                            colSpan="22">
                            {companys?.orders?.user?.companyName} , {companys?.orders?.user?.companyAddress}
                        </td>
                    </tr>
                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}
                            colSpan="22">
                            Wage Register for the month of {month[date.getMonth()]}
                        </td>
                    </tr>
                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}
                            colSpan="11">
                            Name of Owner: {companys?.orders?.user?.companyName}
                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}
                            colSpan="11">
                            LIN:
                        </td>
                    </tr>
                    <tr>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Sr. No.
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            UAN
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Name of Employee{' '}
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Fathers Name
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Sex
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Nature of Work
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} colSpan="2">
                            Entitlement
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Payable Days
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} colSpan="2">
                            Earned
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} colSpan="3">
                            OT
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Total Earned
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} colSpan="2">
                            Recovery
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Net Payment
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Employer Share PF Welfare Found
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Receipt by Employee / Bank Transaction ID
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Date of Payment
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}} rowSpan="2">
                            Remarks
                        </th>
                    </tr>
                    <tr>
                        <th style={{
                            border: '1px solid black',
                            borderCollapse: 'collapse',
                            padding: '5px'
                        }}>Particulars
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>Rate</th>
                        <th style={{
                            border: '1px solid black',
                            borderCollapse: 'collapse',
                            padding: '5px'
                        }}>Particulars
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>Rate</th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>OT Hrs</th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>OT Rates
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>OT Earned
                        </th>

                        <th style={{
                            border: '1px solid black',
                            borderCollapse: 'collapse',
                            padding: '5px'
                        }}>Particulars
                        </th>
                        <th style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>Rate</th>
                    </tr>
                    </thead>

                    <tbody>
                    {pdfData?.employees?.map((item, index) => {

                        /* eslint no-underscore-dangle: 0 */
                        const count = getAttendence(item._id);
                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;
                        return (
                            <tr>
                                <td style={{
                                    border: '1px solid black',
                                    borderCollapse: 'collapse',
                                    padding: '5px'
                                }}>{index + 1}</td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item.companyDetails.UAN}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item.personalDetails.fullName}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item.personalDetails.fatherName}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item.personalDetails.gender}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item.companyDetails.designation}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    <tr>
                                        <td>Basic</td>
                                    </tr>
                                    <tr>
                                        <td>HRA</td>
                                    </tr>
                                    <tr>
                                        <td>Con</td>
                                    </tr>
                                    <tr>
                                        <td>Medical</td>
                                    </tr>
                                    <tr>
                                        <td>Edu</td>
                                    </tr>
                                    <tr>
                                        <td>Total</td>
                                    </tr>
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    <tr>
                                        <td>{item.salaryDetails.basicSalary}</td>
                                    </tr>
                                    <tr>
                                        <td>{item.salaryDetails.hra}</td>
                                    </tr>
                                    <tr>
                                        <td>{item.salaryDetails.con}</td>
                                    </tr>
                                    <tr>
                                        <td>{item.salaryDetails.medical}</td>
                                    </tr>
                                    <tr>
                                        <td>{item.salaryDetails.education}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {item.salaryDetails.basicSalary +
                                                item.salaryDetails.hra +
                                                item.salaryDetails.con +
                                                item.salaryDetails.medical +
                                                item.salaryDetails.education}
                                        </td>
                                    </tr>
                                </td>

                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {parseInt(count.count, 10) ? parseInt(count.count, 10) : 0}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    <tr>
                                        <td>Basic</td>
                                    </tr>
                                    <tr>
                                        <td>HRA</td>
                                    </tr>
                                    <tr>
                                        <td>Con</td>
                                    </tr>
                                    <tr>
                                        <td>Medical</td>
                                    </tr>
                                    <tr>
                                        <td>Edu</td>
                                    </tr>

                                    {count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.map((allowanceRow) => (
                                        <tr>
                                            <td>{allowanceRow?.category}</td>
                                        </tr>
                                    ))}

                                    <tr>
                                        <td>Total</td>
                                    </tr>
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    <tr>
                                        <td>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth)
                                                : Math.round(item?.salaryDetails?.basicSalary) * count.count}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round((item?.salaryDetails?.hra * count.count) / totalDaysOfMonth)
                                                : Math.round(item?.salaryDetails?.hra) * count.count}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round((item?.salaryDetails?.con * count.count) / totalDaysOfMonth)
                                                : Math.round(item?.salaryDetails?.con) * count.count}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round((item?.salaryDetails?.medical * count.count) / totalDaysOfMonth)
                                                : Math.round(item?.salaryDetails?.medical) * count.count}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round((item?.salaryDetails?.education * count.count) / totalDaysOfMonth)
                                                : Math.round(item?.salaryDetails?.education) * count.count}
                                        </td>
                                    </tr>

                                    {count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.map((allowanceRow) => (
                                        <tr>
                                            <td>{Math.round(allowanceRow?.value)}</td>
                                        </tr>
                                    ))}

                                    <tr>
                                        <td>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                (item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                totalDaysOfMonth
                                            ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            ))
                                                : Math.round(
                                                item?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                                item?.salaryDetails?.hra * parseInt(count.count, 10) +
                                                item?.salaryDetails?.con * parseInt(count.count, 10) +
                                                item?.salaryDetails?.medical * parseInt(count.count, 10) +
                                                item?.salaryDetails?.education * parseInt(count.count, 10)
                                            ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            ))}
                                        </td>
                                    </tr>
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {count.ot ? count.ot : 0}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item?.companyDetails?.selectWages === 'Monthly Wages'
                                        ? Math.round(
                                            ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                totalDaysOfMonth) / 26 / 4
                                        )
                                        : Math.round(
                                            Math.round(
                                                ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) +
                                                    (item?.salaryDetails?.hra * parseInt(count.count, 10)) +
                                                    (item?.salaryDetails?.con * parseInt(count.count, 10)) +
                                                    (item?.salaryDetails?.medical * parseInt(count.count, 10)) +
                                                    (item?.salaryDetails?.education * parseInt(count.count, 10))
                                                ) / 4)
                                        )}
                                </td>

                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>

                                    {item?.companyDetails?.selectWages === 'Monthly Wages'
                                        ? Math.round(
                                            ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                totalDaysOfMonth) / 26 / 4 *
                                            (count.ot ? count.ot : 0)
                                        )
                                        : Math.round(
                                            Math.round(
                                                ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) +
                                                    (item?.salaryDetails?.hra * parseInt(count.count, 10)) +
                                                    (item?.salaryDetails?.con * parseInt(count.count, 10)) +
                                                    (item?.salaryDetails?.medical * parseInt(count.count, 10)) +
                                                    (item?.salaryDetails?.education * parseInt(count.count, 10))
                                                ) / 4)
                                        )}
                                </td>

                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item?.companyDetails?.selectWages === 'Monthly Wages'
                                        ? Math.round(
                                        (item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (item?.salaryDetails?.medical * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (item?.salaryDetails?.education * parseInt(count.count, 10)) / totalDaysOfMonth
                                    ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    ))
                                        : Math.round(
                                        item?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                        item?.salaryDetails?.hra * parseInt(count.count, 10) +
                                        item?.salaryDetails?.con * parseInt(count.count, 10) +
                                        item?.salaryDetails?.medical * parseInt(count.count, 10) +
                                        item?.salaryDetails?.education * parseInt(count.count, 10)
                                    ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    ))}
                                </td>

                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    <tr>
                                        <td>PF</td>
                                    </tr>
                                    {count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.map((allowanceRow) => (
                                        <tr>
                                            <td>{allowanceRow?.category}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td>Tax</td>
                                    </tr>
                                    <tr>

                                        <td>Total</td>
                                    </tr>
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    <tr>
                                        <td>
                                            {item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                                <b>{Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)}</b>
                                            ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                            (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                                <b>
                                                    {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                        ? Math.round(
                                                            (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                                12) /
                                                            100
                                                        )
                                                        : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100)}
                                                </b>
                                            ) : (
                                                <b>0</b>
                                            )}
                                        </td>
                                    </tr>
                                    {count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.map((allowanceRow) => (
                                        <tr>
                                            <td>{Math.round(allowanceRow?.value)}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (item?.salaryDetails?.incomeTax)
                                                )
                                                : Math.round(item?.salaryDetails?.incomeTax)}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                                <b>{Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                                    0,
                                                )) + Math.round(
                                                    (item?.salaryDetails?.incomeTax)
                                                )}</b>
                                            ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                            (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                                <b>
                                                    {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                        ? Math.round(
                                                        (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                            12) /
                                                        100
                                                    ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                                        0,
                                                    )) + Math.round(
                                                        (item?.salaryDetails?.incomeTax)
                                                    )
                                                        : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                                        0,
                                                    )) + Math.round(
                                                        (item?.salaryDetails?.incomeTax)
                                                    )}
                                                </b>
                                            ) : (
                                                <b>{Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                                    0,
                                                )) + Math.round(
                                                    (item?.salaryDetails?.incomeTax)
                                                )}</b>
                                            )}
                                        </td>
                                    </tr>
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                                    {item?.companyDetails?.selectWages === 'Monthly Wages'
                                        ? Math.round(
                                        (item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                            totalDaysOfMonth) / 26 / 4 *
                                        (count.ot ? count.ot : 0) -
                                        (item?.salaryDetails?.incomeTax) -
                                        (item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                            item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                        ) : (
                                            0
                                        ))
                                    ) - Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    )) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    ))
                                        : Math.round(
                                        item?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                        item?.salaryDetails?.hra * parseInt(count.count, 10) +
                                        item?.salaryDetails?.con * parseInt(count.count, 10) +
                                        item?.salaryDetails?.medical * parseInt(count.count, 10) +
                                        item?.salaryDetails?.education * parseInt(count.count, 10) +
                                        ((item?.salaryDetails?.basicSalary + item?.salaryDetails?.hra + item?.salaryDetails?.con + item?.salaryDetails?.medical + item?.salaryDetails?.education) / 4) * (count.ot ? count.ot : 0) -
                                        (item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                            item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                        ) : (
                                            0
                                        ))
                                    ) - Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    )) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                        (previousValue, currentValue) => previousValue + currentValue.value,
                                        0,
                                    ))}
                                </td>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                                <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                            </tr>
                        );
                    })}

                    <tr>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>


                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            <tr>
                                <td>Basic</td>
                            </tr>
                            <tr>
                                <td>HRA</td>
                            </tr>
                            <tr>
                                <td>Con</td>
                            </tr>
                            <tr>
                                <td>Medical</td>
                            </tr>
                            <tr>
                                <td>Edu</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                            </tr>
                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            <tr>
                                <td>{pdfData?.employees?.reduce((total, num) => {
                                    return (total + num?.salaryDetails.basicSalary)
                                }, 0)}</td>
                            </tr>
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        return (total + num?.salaryDetails.hra)
                                    }, 0)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        return (total + num?.salaryDetails.con)
                                    }, 0)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        return (total + num?.salaryDetails.medical)
                                    }, 0)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        return (total + num?.salaryDetails.education)
                                    }, 0)}
                                </td>
                            </tr>
                            <tr>

                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                            return (total + num?.salaryDetails.basicSalary)
                                        }, 0) +
                                        pdfData?.employees?.reduce((total, num) => {
                                            return (total + num?.salaryDetails.education)
                                        }, 0) +
                                        pdfData?.employees?.reduce((total, num) => {
                                            return (total + num?.salaryDetails.hra)
                                        }, 0) +
                                        pdfData?.employees?.reduce((total, num) => {
                                            return (total + num?.salaryDetails.con)
                                        }, 0) +
                                        pdfData?.employees?.reduce((total, num) => {
                                            return (total + num?.salaryDetails.medical)
                                        }, 0)
                                    }
                                </td>
                            </tr>
                        </td>

                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            {pdfData?.employees?.reduce((total, num) => {
                                return (total + getAttendence(num._id).count)
                            }, 0)}

                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            <tr>
                                <td>Basic</td>
                            </tr>
                            <tr>
                                <td>HRA</td>
                            </tr>
                            <tr>
                                <td>Con</td>
                            </tr>
                            <tr>
                                <td>Medical</td>
                            </tr>
                            <tr>
                                <td>Edu</td>
                            </tr>
                            {companys?.orders?.user?.recoveryAndAllowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.map((allowanceRow) => (
                                <tr>
                                    <td>{allowanceRow?.name}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>Total</td>
                            </tr>
                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            <tr>
                                <td>

                                    {pdfData?.employees?.reduce((total, num) => {
                                        const count = getAttendence(num._id);
                                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                        let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                            ? Math.round((num?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth)
                                            : Math.round(num?.salaryDetails?.basicSalary) * count.count

                                        return (total + temp)
                                    }, 0)}


                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        const count = getAttendence(num._id);
                                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                        let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                            ? Math.round((num?.salaryDetails?.hra * count.count) / totalDaysOfMonth)
                                            : Math.round(num?.salaryDetails?.hra) * count.count

                                        return (total + temp)
                                    }, 0)}


                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        const count = getAttendence(num._id);
                                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                        let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                            ? Math.round((num?.salaryDetails?.con * count.count) / totalDaysOfMonth)
                                            : Math.round(num?.salaryDetails?.con) * count.count

                                        return (total + temp)
                                    }, 0)}

                                </td>
                            </tr>
                            <tr>
                                <td>

                                    {pdfData?.employees?.reduce((total, num) => {
                                        const count = getAttendence(num._id);
                                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                        let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                            ? Math.round((num?.salaryDetails?.medical * count.count) / totalDaysOfMonth)
                                            : Math.round(num?.salaryDetails?.medical) * count.count

                                        return (total + temp)
                                    }, 0)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        const count = getAttendence(num._id);
                                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                        let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                            ? Math.round((num?.salaryDetails?.education * count.count) / totalDaysOfMonth)
                                            : Math.round(num?.salaryDetails?.education) * count.count

                                        return (total + temp)
                                    }, 0)}
                                </td>
                            </tr>
                            {companys?.orders?.user?.recoveryAndAllowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.map((allowanceRow) => (

                                <tr>
                                    {console.log("allowanceRow", allowanceRow)}
                                    <td>

                                        {employeeAttendance?.reduce((total1, num1) => {
                                            const count = getAttendence(num1.employee);

                                            const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                            let temp = num1?.allowancesNReject?.filter((allowanceRows) => allowanceRows?.type == "allowence").reduce((total, num) => {

                                                if (num?.category == allowanceRow?.name) {
                                                    return (total + (num.value ? num.value : 0))
                                                } else {
                                                    return (total + 0);

                                                }
                                            }, 0);
                                            console.log("temp", temp)

                                            return Math.round(total1 + (temp ? temp : 0))


                                        }, 0)}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>


                                    {pdfData?.employees?.reduce((total, num) => {
                                        const count = getAttendence(num._id);
                                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                        let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                            ? Math.round(
                                            (num?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (num?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (num?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (num?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (num?.salaryDetails?.education * parseInt(count.count, 10)) /
                                            totalDaysOfMonth
                                        ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                            (previousValue, currentValue) => previousValue + currentValue.value,
                                            0,
                                        ))
                                            : Math.round(
                                            num?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                            num?.salaryDetails?.hra * parseInt(count.count, 10) +
                                            num?.salaryDetails?.con * parseInt(count.count, 10) +
                                            num?.salaryDetails?.medical * parseInt(count.count, 10) +
                                            num?.salaryDetails?.education * parseInt(count.count, 10)
                                        ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                            (previousValue, currentValue) => previousValue + currentValue.value,
                                            0,
                                        ))


                                        return (total + temp)
                                    }, 0)}

                                </td>
                            </tr>
                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            {pdfData?.employees?.reduce((total, num) => {
                                return (total + getAttendence(num._id).ot)
                            }, 0)}
                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>

                        </td>

                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>


                            {pdfData?.employees?.reduce((total, num) => {
                                const count = getAttendence(num._id);
                                const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                    ? Math.round(
                                        ((num?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (num?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (num?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (num?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (num?.salaryDetails?.education * parseInt(count.count, 10)) /
                                            totalDaysOfMonth) / 26 / 4 *
                                        (count.ot ? count.ot : 0)
                                    )
                                    : Math.round(
                                        Math.round(
                                            ((num?.salaryDetails?.basicSalary * parseInt(count.count, 10)) + (num?.salaryDetails?.hra * parseInt(count.count, 10)) + (num?.salaryDetails?.con * parseInt(count.count, 10))  + (num?.salaryDetails?.medical * parseInt(count.count, 10))  + (num?.salaryDetails?.education * parseInt(count.count, 10))) / 4
                                        )
                                    )

                                return (total + temp)
                            }, 0)}


                        </td>

                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>


                            {pdfData?.employees?.reduce((total, num) => {
                                const count = getAttendence(num._id);
                                const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                    ? Math.round(
                                    (num?.salaryDetails?.basicSalary * parseInt(count.count, 10)) / totalDaysOfMonth +
                                    (num?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                    (num?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                    (num?.salaryDetails?.medical * parseInt(count.count, 10)) / totalDaysOfMonth +
                                    (num?.salaryDetails?.education * parseInt(count.count, 10)) / totalDaysOfMonth
                                ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                    0,
                                ))
                                    : Math.round(
                                    num?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                    num?.salaryDetails?.hra * parseInt(count.count, 10) +
                                    num?.salaryDetails?.con * parseInt(count.count, 10) +
                                    num?.salaryDetails?.medical * parseInt(count.count, 10) +
                                    num?.salaryDetails?.education * parseInt(count.count, 10)
                                ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                    0,
                                ))

                                return (total + temp)
                            }, 0)}
                        </td>

                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            <tr>
                                <td>PF</td>
                            </tr>
                            <tr>
                                <td>Tax</td>
                            </tr>
                            {companys?.orders?.user?.recoveryAndAllowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.map((allowanceRow) => (
                                <tr>
                                    <td>{allowanceRow?.name}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>Total</td>
                            </tr>
                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            <tr>
                                <td>


                                    {pdfData?.employees?.reduce((total, num) => {
                                        const count = getAttendence(num._id);
                                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                        let temp = num?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : num?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (num?.pfDetails?.wereMember == 'Yes' && num?.pfDetails?.withdrawn == 'No') ? (

                                            num?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((num?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((num?.salaryDetails?.basicSalary * count.count * 12) / 100)

                                        ) : (
                                            0
                                        )

                                        return (total + temp)
                                    }, 0)}


                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        return (total + num?.salaryDetails?.incomeTax)
                                    }, 0)}
                                </td>
                            </tr>

                            {companys?.orders?.user?.recoveryAndAllowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.map((allowanceRow) => (
                                <tr>
                                    <td>

                                        {employeeAttendance?.reduce((total1, num1) => {
                                            const count = getAttendence(num1.employee);

                                            const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                            let temp = num1?.allowancesNReject?.filter((allowanceRows) => allowanceRows?.type == "recovery").reduce((total, num) => {

                                                if (num.category == allowanceRow?.name) {
                                                    return (total + (num.value ? num.value : 0))
                                                } else {
                                                    return (total + 0)
                                                }
                                            }, 0) / totalDaysOfMonth

                                            return Math.round(total1 + (temp ? temp : 0))


                                        }, 0)}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    {pdfData?.employees?.reduce((total, num) => {
                                        const count = getAttendence(num._id);
                                        const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                        let temp = num?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : num?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (num?.pfDetails?.wereMember == 'Yes' && num?.pfDetails?.withdrawn == 'No') ? (

                                            num?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((num?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((num?.salaryDetails?.basicSalary * count.count * 12) / 100)

                                        ) : (
                                            0
                                        )

                                        temp += Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                            (previousValue, currentValue) => previousValue + currentValue.value,
                                            0,
                                        )) + num?.salaryDetails?.incomeTax

                                        return (total + temp)
                                    }, 0)}
                                </td>
                            </tr>
                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}>
                            {}


                            {pdfData?.employees?.reduce((total, num) => {
                                const count = getAttendence(num._id);
                                const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;


                                let temp = num?.companyDetails?.selectWages === 'Monthly Wages'
                                    ? Math.round(
                                        (num?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        (num?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (num?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                        (num?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        (num?.salaryDetails?.education * parseInt(count.count, 10)) /
                                        totalDaysOfMonth +
                                        ((num?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (num?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (num?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                            (num?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                            totalDaysOfMonth +
                                            (num?.salaryDetails?.education * parseInt(count.count, 10)) /
                                            totalDaysOfMonth) / 26 / 4 *
                                        (count.ot ? count.ot : 0) -
                                        (num?.salaryDetails?.incomeTax) -
                                        (num?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : num?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (num?.pfDetails?.wereMember == 'Yes' && num?.pfDetails?.withdrawn == 'No') ? (
                                            num?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((num?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((num?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                        ) : (
                                            0
                                        ))
                                    )
                                    : Math.round(
                                        num?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                        num?.salaryDetails?.hra * parseInt(count.count, 10) +
                                        num?.salaryDetails?.con * parseInt(count.count, 10) +
                                        num?.salaryDetails?.medical * parseInt(count.count, 10) +
                                        num?.salaryDetails?.education * parseInt(count.count, 10) +
                                        ((num?.salaryDetails?.basicSalary + num?.salaryDetails?.hra + num?.salaryDetails?.con + num?.salaryDetails?.medical + num?.salaryDetails?.education) / 4) * (count.ot ? count.ot : 0) -
                                        (num?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                            Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                        ) : num?.pfDetails?.aboveBasic === 'PF on actual' ||
                                        (num?.pfDetails?.wereMember == 'Yes' && num?.pfDetails?.withdrawn == 'No') ? (
                                            num?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    (((num?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                        12) /
                                                    100
                                                )
                                                : Math.round((num?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                        ) : (
                                            0
                                        ))
                                    )


                                temp -= Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                    0,
                                ))

                                temp += Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                    (previousValue, currentValue) => previousValue + currentValue.value,
                                    0,
                                ))

                                return (total + temp)
                            }, 0)}


                        </td>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                        <td style={{border: '1px solid black', borderCollapse: 'collapse', padding: '5px'}}/>
                    </tr>


                    </tbody>
                </table>
            </div>
            <div>
                <div style={{display: 'none'}}>
                    <div id="wage" style={{textAlign: 'center', width: '100%', margin: '10px'}} width="100%">
                        {pdfData?.employees?.map((item, index) => {


                            /* eslint no-underscore-dangle: 0 */
                            const count = getAttendence(item._id);
                            const totalDaysOfMonth = parseInt(count.count, 10) > 26 ? parseInt(daysInMonth(date.getMonth() + 1, date.getFullYear()), 10) : 26;

                            return (
                                <table
                                    style={{
                                        textAlign: 'center',
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        margin: '10px',
                                        marginBottom: '267px',
                                        height: '247px'
                                    }}
                                    width="100%"
                                >
                                    <thead>
                                    <tr style={{textAlign: 'center'}}>
                                        <th colSpan="26">Total HR</th>
                                    </tr>
                                    <tr style={{textAlign: 'center'}}>
                                        <th colSpan="26">{companys?.orders?.user?.companyAddress}</th>
                                    </tr>
                                    <tr style={{textAlign: 'center'}}>
                                        <th colSpan="26">
                                            Salary slip for the month
                                            of {month[date.getMonth() + 1]} - {month[date.getMonth() + 2]}
                                        </th>
                                    </tr>

                                    <tr>
                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            rowSpan="2"
                                        >
                                            Sr. No.
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            rowSpan="2"
                                        >
                                            UAN
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            rowSpan="2"
                                        >
                                            Name
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            rowSpan="2"
                                        >
                                            Fathers Name
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            rowSpan="2"
                                        >
                                            Sex
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            rowSpan="2"
                                        >
                                            Designation
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            colSpan="4"
                                        >
                                            Entitlement
                                        </th>

                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            colSpan={7 + count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence").length}
                                        >
                                            Earned
                                        </th>

                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            colSpan={3 + count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery").length}
                                        >
                                            Recovery
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            rowSpan="2"
                                        >
                                            Net Salary
                                        </th>

                                        <th
                                            style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}
                                            rowSpan="2"
                                        >
                                            Signature
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>Basic
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>HRM
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>Con
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>Total
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            Payable Days
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>Basic
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>HRA
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>CON
                                        </th>
                                        {count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.map((allowanceRow) => (
                                            <th style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}>
                                                {allowanceRow?.category}
                                            </th>
                                        ))}
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            OT hrs
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            Extra Hours Payable
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>Total
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>PF
                                        </th>
                                        {count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.map((allowanceRow) => (
                                            <th style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}>
                                                {allowanceRow?.category}
                                            </th>
                                        ))}
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            Reimbursement of ABRY
                                        </th>
                                        <th style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>Total
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {index + 1}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.companyDetails.UAN}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.personalDetails.fullName}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.personalDetails.fatherName}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.personalDetails.gender}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.companyDetails.designation}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.salaryDetails.basicSalary}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.salaryDetails.hra}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.salaryDetails.con}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item.salaryDetails.basicSalary +
                                                item.salaryDetails.hra +
                                                item.salaryDetails.con +
                                                item.salaryDetails.medical +
                                                item.salaryDetails.education}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {parseInt(count.count, 10) ? parseInt(count.count, 10) : 0}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth)
                                                : Math.round(item?.salaryDetails?.basicSalary) * count.count}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round((item?.salaryDetails?.hra * count.count) / totalDaysOfMonth)
                                                : Math.round(item?.salaryDetails?.hra) * count.count}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round((item?.salaryDetails?.con * count.count) / totalDaysOfMonth)
                                                : Math.round(item?.salaryDetails?.con) * count.count}
                                        </td>
                                        {count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.map((allowanceRow) => (
                                            <td style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}>
                                                {Math.round(allowanceRow?.value)}
                                            </td>
                                        ))}
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {count.ot ? count.ot : 0}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                    ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                        totalDaysOfMonth +
                                                        (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                        (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                        (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                        totalDaysOfMonth +
                                                        (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                        totalDaysOfMonth) / 26 / 4
                                                )
                                                : Math.round(
                                                    Math.round(
                                                        item?.salaryDetails?.basicSalary * parseInt(count.count, 10)
                                                    ) / totalDaysOfMonth / 4
                                                )}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                (item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                totalDaysOfMonth
                                            ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            ))
                                                : Math.round(
                                                item?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                                item?.salaryDetails?.hra * parseInt(count.count, 10) +
                                                item?.salaryDetails?.con * parseInt(count.count, 10) +
                                                item?.salaryDetails?.medical * parseInt(count.count, 10) +
                                                item?.salaryDetails?.education * parseInt(count.count, 10)
                                            ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            ))}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                                <b>{Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)}</b>
                                            ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                            (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                                <b>
                                                    {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                        ? Math.round(
                                                            (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                                12) /
                                                            100
                                                        )
                                                        : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100)}
                                                </b>
                                            ) : (
                                                <b>0</b>
                                            )}
                                        </td>

                                        {count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.map((allowanceRow) => (
                                            <td style={{
                                                border: '1px solid black',
                                                borderCollapse: 'collapse',
                                                padding: '5px'
                                            }}>
                                                {Math.round(allowanceRow?.value)}
                                            </td>
                                        ))}

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>{0}</td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                (((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                        totalDaysOfMonth) *
                                                    12) /
                                                100 +
                                                0 +
                                                0 +
                                                0 +
                                                0
                                            ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            ))
                                                : Math.round(
                                                (item?.salaryDetails?.basicSalary * parseInt(count.count, 10) * 12) / 100 +
                                                0 +
                                                0 +
                                                0 +
                                                0
                                            ) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            ))}
                                        </td>

                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}>
                                            {item?.companyDetails?.selectWages === 'Monthly Wages'
                                                ? Math.round(
                                                (item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                totalDaysOfMonth +
                                                ((item?.salaryDetails?.basicSalary * parseInt(count.count, 10)) /
                                                    totalDaysOfMonth +
                                                    (item?.salaryDetails?.hra * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                    (item?.salaryDetails?.con * parseInt(count.count, 10)) / totalDaysOfMonth +
                                                    (item?.salaryDetails?.medical * parseInt(count.count, 10)) /
                                                    totalDaysOfMonth +
                                                    (item?.salaryDetails?.education * parseInt(count.count, 10)) /
                                                    totalDaysOfMonth) / 26 / 4 *
                                                (count.ot ? count.ot : 0) -
                                                (item?.salaryDetails?.incomeTax) -
                                                (item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                                    Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                                ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                                (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                                    item?.companyDetails?.selectWages === 'Monthly Wages'
                                                        ? Math.round(
                                                            (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                                12) /
                                                            100
                                                        )
                                                        : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                                ) : (
                                                    0
                                                ))
                                            ) - Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            )) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            ))
                                                : Math.round(
                                                item?.salaryDetails?.basicSalary * parseInt(count.count, 10) +
                                                item?.salaryDetails?.hra * parseInt(count.count, 10) +
                                                item?.salaryDetails?.con * parseInt(count.count, 10) +
                                                item?.salaryDetails?.medical * parseInt(count.count, 10) +
                                                item?.salaryDetails?.education * parseInt(count.count, 10) +
                                                (item?.salaryDetails?.basicSalary / 4) * (count.ot ? count.ot : 0) -
                                                (item?.pfDetails?.aboveBasic === 'PF but restricted to 15k' ? (
                                                    Math.round((15000 / totalDaysOfMonth / 12) * 100 * count.count)
                                                ) : item?.pfDetails?.aboveBasic === 'PF on actual' ||
                                                (item?.pfDetails?.wereMember == 'Yes' && item?.pfDetails?.withdrawn == 'No') ? (
                                                    item?.companyDetails?.selectWages === 'Monthly Wages'
                                                        ? Math.round(
                                                            (((item?.salaryDetails?.basicSalary * count.count) / totalDaysOfMonth) *
                                                                12) /
                                                            100
                                                        )
                                                        : Math.round((item?.salaryDetails?.basicSalary * count.count * 12) / 100)
                                                ) : (
                                                    0
                                                ))
                                            ) - Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "recovery")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            )) + Math.round(count.allowance?.filter((allowanceRow) => allowanceRow?.type == "allowence")?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue.value,
                                                0,
                                            ))}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            borderCollapse: 'collapse',
                                            padding: '5px'
                                        }}/>
                                    </tr>
                                    </tbody>
                                </table>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewSalary;
