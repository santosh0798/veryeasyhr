import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyledTableCell } from './tablestyle';
import { AiFillPlusCircle } from 'react-icons/ai';
import { updateAllowances } from 'store/actions/attendenceAction';

export default function RecoveryInput(props) {
    const { arr, employee, date, allowence } = props;
    const dispatch = useDispatch();

    const [values, setVal] = useState([]);



    const handleValueChange = (index, e, type) => {
        console.log(index, e.target.value)
        const val = [...values];
        val[index] = {
            category: e.target.name,
            value: e.target.value,
            type: type
        }
        setVal(val);

    };
    console.log(allowence);

    useEffect(() => {
        if (allowence) {
            setVal(allowence);
        }
    }, [dispatch])



    console.log(values);



    return (
        <>
            {
                arr?.map((item, index) => {
                    return (
                        <StyledTableCell align="center">
                            <TextField id="outlined-basic" name={item?.name} variant="outlined" value={values[index]?.value} onChange={(e) => { handleValueChange(index, e, item?.type) }} />

                        </StyledTableCell>)
                })
            }
            <StyledTableCell align="center">
                <AiFillPlusCircle
                    style={{ width: '40px', height: '40px', color: '#009FBE', margin: '5px', cursor: 'pointer' }}
                    onClick={() => {
                        dispatch(updateAllowances(values, employee, date.getFullYear(), date.getMonth() + 1));
                    }}
                />
            </StyledTableCell>

        </>
    );
}
