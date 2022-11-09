import React, { useState } from 'react';
import './paymentsidepanel.css';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PhoneIcon from '@mui/icons-material/Phone';
import CancelIcon from '@mui/icons-material/Cancel';
import formatDate from '../../utils/date-format';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { Button, Grid, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateCompanyAllowance } from 'store/actions/companyAction';

const AddRecoveryAllowance = (props) => {
    const { parentCallback, arrCallBack, close, attend, order } = props;

    const dispatch = useDispatch();


    React.useEffect(() => {
        if (order?.user?.recoveryAndAllowance) {
            setArr(order?.user?.recoveryAndAllowance)

        }

    }, [order]);

    const [arr, setArr] = React.useState([{
        name: '',
        type: ''

    }]);


    const handleValueChange = (index, e) => {
        console.log(index, e.target.value)
        const val = [...arr];
        val[index][e.target.name] = e.target.value
        setArr(val);

    };




    // console.log('-------------', data, count, todaydays, Math.round((data?.salaryDetails?.basicSalary * count.count) / todaydays));
    return (
        <div className="salary-sidepanel-container">
            <div className="salary-sidepanel-box1">
                <span className="close-sidebar" role="button" onKeyDown={parentCallback} tabIndex={-27} onClick={parentCallback}>
                    <CancelIcon style={{ cursor: 'pointer' }} />
                </span>
                <h3 style={{ fontWeight: 700, color: '#000000', fontSize: '24px', borderBottom: '1px solid gray', textAlign: 'left', width: '100%' }} className="salary-sidepanel-box-img">

                    Add Recovery & Allowance
                </h3>

            </div>


            <Grid container spacing={6} alignItems="center" justifyContent="center" style={{ marginTop: '0px', padding: '0px 5px' }}>
                <Grid item xs={12} sm={8}>
                    Name
                </Grid>
                <Grid item xs={12} sm={4}>
                    Type
                </Grid>
            </Grid>
            <div class="allowance" style={{ overflowY: 'scroll', height: '40vh' }}>

                {arr?.map((item, index) => {
                    return (
                        <>
                            <Grid container spacing={6} alignItems="center" justifyContent="center" style={{ marginTop: '-10px', padding: '0px 5px' }}>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        required
                                        id="name"
                                        type="name"
                                        name="name"
                                        label="Name"
                                        placeholder="Enter Name"
                                        fullWidth
                                        autoComplete="name"
                                        variant="outlined"
                                        value={item.name}
                                        onChange={(e) => { handleValueChange(index, e) }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        required
                                        id="type"
                                        type="type"
                                        select
                                        name="type"
                                        label="Type"
                                        placeholder="Enter Type"
                                        fullWidth
                                        autoComplete="type"
                                        variant="outlined"
                                        value={item.type}
                                        onChange={(e) => { handleValueChange(index, e) }}

                                    >

                                        <MenuItem value={"allowence"}>Allowance</MenuItem>
                                        <MenuItem value={"recovery"}>Recovery</MenuItem>

                                    </TextField>
                                </Grid>
                            </Grid>
                        </>
                    )
                })}
            </div>


            <div style={{ textAlign: 'left' }}>
                <Button variant="text" onClick={() => {
                    setArr([...arr, {
                        name: '',
                        type: ''
                    }])
                }}>+ ADD</Button>
            </div>
            <div style={{ borderTop: '1px solid gray', padding: '5px', textAlign: 'center' }}>
                <Grid container spacing={6} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" style={{ marginRight: '20px' }} onClick={parentCallback} fullWidth>Cancel</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>

                        <Button variant="contained" onClick={() => {
                            dispatch(updateCompanyAllowance(arr));
                            arrCallBack(arr);
                            close();
                        }} fullWidth>Save</Button>
                    </Grid>
                </Grid>
            </div>

        </div >
    );
};
export default AddRecoveryAllowance;
