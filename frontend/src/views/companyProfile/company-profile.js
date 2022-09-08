import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { Container, Box, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { addRoles, clearErrors } from '../../store/actions/employeeAction';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADD_ROLES_RESET } from '../../store/constant/employeeConstant';
import { getCompany, updateCompany } from '../../store/actions/companyAction';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';

// ==============================|| SAMPLE PAGE ||============================== //

const ColorButton = styled(Button)(({ theme }) => ({
    marginTop: '20px',
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: '22px',
    width: '100%',
    backgroundColor: '#009FBE'
}));

export default function CompanyProfile() {
    const [value, setValue] = useState(null);

    const [email, setEmail] = useState('');
    const [bonusPer, setBonusPer] = useState('');

    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAdd, setCompanyAdd] = useState('');
    const [designation, setDesignation] = useState('');

    const dispatch = useDispatch();
    const { error, orders } = useSelector((state) => state.myCompany);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    console.log(orders);

    useEffect(() => {
        dispatch(getCompany());
    }, [dispatch]);

    useEffect(() => {
        setCompanyName(orders?.user?.companyName);
        setEmail(orders?.user?.wages[orders?.user?.wages?.length - 1]?.minimumWages);
        setBonusPer(orders?.user?.bonusPercentage);
        setValue(orders?.user?.wages[orders?.user?.wages?.length - 1]?.bonasFrom);
        setDesignation(orders?.user?.wages[orders?.user?.wages?.length - 1]?.designation);

        setCompanyAdd(orders?.user?.companyAddress);
    }, [orders]);

    const submitHandler = (e) => {
        e.preventDefault();
        const x = {};
        console.log(e.target.elements.companyName.value);
        x.companyName = e.target.elements.companyName.value;

        x.minimumWages = e.target.elements['minimum-wages2'].value;
        x.bonusPercentage = e.target.elements.bonusPercentage.value;
        x.bonasFrom = e.target.elements.date.value;
        x.companyAddress = e.target.elements.companyAdd.value;
        x.designation = e.target.elements.designation.value;

        console.log(x);
        dispatch(updateCompany(x));
    };

    console.log(companyName);

    return (
        <>
            {user && (
                <Container component={Box} p={4}>
                    <Typography variant="h2" gutterBottom>
                        Company Profile
                    </Typography>
                    <form onSubmit={submitHandler} encType="multipart/form-data">
                        <Grid container spacing={4} alignItems="center" justifyContent="center" style={{ marginTop: '35px' }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Enter Company Name"
                                    fullWidth
                                    disabled
                                    variant="outlined"
                                    label="Enter Company Name"
                                    value={companyName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="bonasPercentage"
                                    type="number"
                                    name="bonusPercentage"
                                    placeholder="Enter Bonus Percentage"
                                    fullWidth
                                    variant="outlined"
                                    label="Enter Bonus Percentage"
                                    value={bonusPer}
                                    onChange={(e) => setBonusPer(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    id="minimum-wages2"
                                    type="text"
                                    name="minimum-wages2"
                                    placeholder="Enter Minimum Wages"
                                    fullWidth
                                    variant="outlined"
                                    label="Enter Minimum Wages"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Select Month"
                                        onChange={(newValue) => {
                                            setValue(newValue);
                                        }}
                                        value={value}
                                        renderInput={(params) => <TextField {...params} name="date" />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="designation"
                                    name="designation"
                                    placeholder="Designation"
                                    value={designation}
                                    label="Designation"
                                    variant="outlined"
                                    fullWidth
                                    select
                                    onChange={(e) => setDesignation(e.target.value)}
                                >
                                    <MenuItem value="Skilled">Skilled</MenuItem>
                                    <MenuItem value="Semi Skilled">Semi Skilled</MenuItem>
                                    <MenuItem value="Un Skilled">Un Skilled</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    id="companyAdd"
                                    name="companyAdd"
                                    placeholder="Enter Company Address"
                                    fullWidth
                                    variant="outlined"
                                    label="Enter Company Addres"
                                    value={companyAdd}
                                    onChange={(e) => setCompanyAdd(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5} sm={12}>
                                <ColorButton variant="contained" type="submit">
                                    Update Company Profile
                                </ColorButton>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            )}
        </>
    );
}
