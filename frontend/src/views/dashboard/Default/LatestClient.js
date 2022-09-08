import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant/customizationConstant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers, clearErrors } from 'store/actions/userActions';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const LatestClients = ({ isLoading, role }) => {
    const theme = useTheme();
    const { error, users } = useSelector((state) => state.allUsers);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    console.log(role);
    const [emp, setemp] = useState([]);

    useEffect(() => {
        if (user.role == 'admin') {
            dispatch(allUsers(1, -1, 3));
        }

        async function getdata() {
            const { data } = await axios.get(`http://localhost:4000/api/v1/employees/mylist?page=${1}&sorted=${-1}&limit=${3}`, {
                withCredentials: true
            });

            if (user.role == 'admin') {
                setemp(data.user);
            } else {
                setemp(data);
            }
        }
        getdata();
        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch]);

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Latest Added {user.role == 'admin' ? 'Clients' : 'Employees'}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                {user.role == 'admin'
                                    ? users?.users?.map((item, index) => {
                                          const date = new Date(item.createdAt);
                                          const monthNames = [
                                              'January',
                                              'February',
                                              'March',
                                              'April',
                                              'May',
                                              'June',
                                              'July',
                                              'August',
                                              'September',
                                              'October',
                                              'November',
                                              'December'
                                          ];
                                          return (
                                              <>
                                                  <Grid container direction="column">
                                                      <Grid item>
                                                          <Grid container alignItems="center" justifyContent="space-between">
                                                              <Grid item>
                                                                  <Typography variant="subtitle1" color="inherit">
                                                                      {item.name}
                                                                  </Typography>
                                                              </Grid>
                                                              <Grid item>
                                                                  <Grid container alignItems="center" justifyContent="space-between">
                                                                      <Grid item>
                                                                          <Typography variant="subtitle1" color="inherit">
                                                                              {`${date.getDate()}
                                                                            ${monthNames[date.getMonth()]} 
                                                                           `}
                                                                          </Typography>
                                                                      </Grid>
                                                                  </Grid>
                                                              </Grid>
                                                          </Grid>
                                                      </Grid>
                                                  </Grid>
                                                  {index !== 2 && <Divider sx={{ my: 1.5 }} />}
                                              </>
                                          );
                                      })
                                    : emp?.employees?.map((item, index) => {
                                          const date = new Date(item.createdAt);
                                          const monthNames = [
                                              'January',
                                              'February',
                                              'March',
                                              'April',
                                              'May',
                                              'June',
                                              'July',
                                              'August',
                                              'September',
                                              'October',
                                              'November',
                                              'December'
                                          ];
                                          return (
                                              <>
                                                  <Grid container direction="column">
                                                      <Grid item>
                                                          <Grid container alignItems="center" justifyContent="space-between">
                                                              <Grid item>
                                                                  <Typography variant="subtitle1" color="inherit">
                                                                      {item.personalDetails.fullName}
                                                                  </Typography>
                                                              </Grid>
                                                              <Grid item>
                                                                  <Grid container alignItems="center" justifyContent="space-between">
                                                                      <Grid item>
                                                                          <Typography variant="subtitle1" color="inherit">
                                                                              {`${date.getDate()}
                                                                            ${monthNames[date.getMonth()]} 
                                                                           `}
                                                                          </Typography>
                                                                      </Grid>
                                                                  </Grid>
                                                              </Grid>
                                                          </Grid>
                                                      </Grid>
                                                  </Grid>
                                                  {index !== 2 && <Divider sx={{ my: 1.5 }} />}
                                              </>
                                          );
                                      })}
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        <Button size="small" disableElevation>
                            <Link
                                to={user.role == 'admin' ? '/roles/manage-user' : '/employee/view-employee'}
                                style={{ textDecoration: 'none', color: '#009FBE', fontWeight: 400 }}
                            >
                                View All
                            </Link>
                        </Button>
                    </CardActions>
                </MainCard>
            )}
        </>
    );
};

LatestClients.propTypes = {
    isLoading: PropTypes.bool
};

export default LatestClients;
