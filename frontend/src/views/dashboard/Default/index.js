import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid } from '@mui/material';

// project imports
import TotalClientCard from './TotalClientCard';
import HolidayCard from './HolidayCard';
import AdminTotalEmployeesCard from './AdminTotalEmployeesCard';
import AddClientCard from './AddClientCard';
import ManageClientCard from './ManageClientCard';
import { gridSpacing } from 'store/constant/customizationConstant';
import NewJoiningCard from './NewJoiningCard';
import { useDispatch, useSelector } from 'react-redux';
import LatestClient from './LatestClient';
import ViewPFRemittance from './ViewPFRemittance';
import AddPFRemittanceCard from './AddPFRemittance';
import { Link, useNavigate } from 'react-router-dom';
import { myEmployee } from 'store/actions/employeeAction';
import { allUsers } from 'store/actions/userActions';
import AddRateCard from "./AddRateCategory";
import ViewRateCard from "./ViewRateCategory";
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);
    const { error, orders } = useSelector((state) => state.myEmployee);
    const { users } = useSelector((state) => state.allUsers);
    console.log('order', orders);

    useEffect(() => {
        dispatch(myEmployee(1, 99999999));
        dispatch(allUsers(1, -1, 3));
    }, [dispatch, error]);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(false);
        console.log('user====>', user);
        if (!user) {
            navigate('/login');
        }
    }, []);

    return (
        <>
            {user && user.role === 'admin' && (
                <Grid container spacing={gridSpacing} style={{ overflow: 'hidden' }}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item lg={3} md={12} sm={12} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <AddClientCard isLoading={isLoading} />
                                    </Grid>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <ManageClientCard isLoading={isLoading} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} md={12} sm={12} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <AddRateCard isLoading={isLoading} />
                                    </Grid>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <ViewRateCard isLoading={isLoading} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                <TotalClientCard isLoading={isLoading} totalCli={users?.count - 1} />
                            </Grid>
                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                <AdminTotalEmployeesCard isLoading={isLoading} totalEmp={orders?.employeeCount} />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={4}>
                                <HolidayCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <HolidayCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <LatestClient isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {user && user.role === 'user' && (
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <AdminTotalEmployeesCard totalEmp={orders?.count} isLoading={isLoading} />
                            </Grid>
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <NewJoiningCard totalEmp={orders?.count} isLoading={isLoading} />
                            </Grid>

                            <Grid item lg={4} md={12} sm={12} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <AddPFRemittanceCard isLoading={isLoading} />
                                    </Grid>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <ViewPFRemittance isLoading={isLoading} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={4}>
                                <HolidayCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <HolidayCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <LatestClient isLoading={isLoading} role={user} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            )}
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12} mt={5}>
                    <Button variant="outlined" style={{ width: "100%" }} onClick={(e) => {
                        e.preventDefault();

                        var urls = [
                            '/template/attendance.csv',
                            '/template/Daywise.csv',
                            '/template/add employee.csv'
                        ]

                        var interval = setInterval(download, 300, urls);

                        function download(urls) {
                            var url = urls.pop();

                            var a = document.createElement("a");
                            a.setAttribute('href', url);
                            a.setAttribute('download', '');
                            a.setAttribute('target', '_blank');
                            a.click();

                            if (urls.length == 0) {
                                clearInterval(interval);
                            }
                        }

                    }}>Download all CSV template</Button>
                </Grid>
            </Grid>
        </>
    );
};
export default Dashboard;
