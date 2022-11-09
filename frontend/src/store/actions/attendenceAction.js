import axios from 'axios';
import { toast } from 'react-toastify';
import {
    ADD_ATTENDENCE_FAIL,
    ADD_ATTENDENCE_REQUEST,
    ADD_ATTENDENCE_SUCCESS,
    GET_ATTENDENCE_FAIL,
    GET_ATTENDENCE_REQUEST,
    GET_ATTENDENCE_SUCCESS,
    GET_SINGLE_ATTENDENCE_FAIL,
    GET_SINGLE_ATTENDENCE_REQUEST,
    GET_SINGLE_ATTENDENCE_SUCCESS,
    OVERTIME_ATTENDENCE_FAIL,
    OVERTIME_ATTENDENCE_REQUEST,
    OVERTIME_ATTENDENCE_SUCCESS,
    UPDATE_ALLOWANCE_FAIL,
    UPDATE_ALLOWANCE_REQUEST,
    UPDATE_ALLOWANCE_SUCCESS
} from '../constant/attendenceConstant';
import { CLEAR_ERRORS } from '../constant/userConstant';

axios.defaults.withCredentials = true;
// Add Attendence
export const addAttendence = (userData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_ATTENDENCE_REQUEST });
        console.log(userData);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                withCredentials: true
            }
        };

        const { data } = await axios.post(' http://localhost:4000/api/v1/employee/attendance', userData, config);

        dispatch({
            type: ADD_ATTENDENCE_SUCCESS,
            payload: data.user
        });
    } catch (error) {
        dispatch({
            type: ADD_ATTENDENCE_FAIL,
            payload: error
        });
    }
};

// Get currently logged in user attendence list
export const myAttendence = (page, month, year) => async (dispatch) => {
    axios.defaults.withCredentials = true;
    try {
        dispatch({ type: GET_ATTENDENCE_REQUEST });

        const x = await axios.get(` http://localhost:4000/api/v1/employee/attendance/mylist/${month + 1}/${year}?page=${page}`, {
            withCredentials: true
        });

        dispatch({
            type: GET_ATTENDENCE_SUCCESS,
            payload: x.data
        });
    } catch (error) {
        dispatch({
            type: GET_ATTENDENCE_FAIL,
            payload: error.response
        });
    }
};


// update allowances
export const updateAllowances = (data, employee, attendanceYear, attendanceMonth) => async (dispatch) => {
    axios.defaults.withCredentials = true;
    try {
        dispatch({ type: UPDATE_ALLOWANCE_REQUEST });

        const x = await axios.post(` http://localhost:4000/api/v1/employee/allowances`, {
            data: data, employee: employee, attendanceYear: attendanceYear, attendanceMonth: attendanceMonth
        }, {
            withCredentials: true
        });

        toast.success("Allowance updated successfully");

        dispatch({
            type: UPDATE_ALLOWANCE_SUCCESS,
            payload: x
        });
    } catch (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message.toString());

        dispatch({
            type: UPDATE_ALLOWANCE_FAIL,
            payload: error.response
        });
    }
};

// Get currently logged in user attendence of selected employee
export const myEmployeeAttendence = (employee, month, year) => async (dispatch) => {
    axios.defaults.withCredentials = true;
    try {
        dispatch({ type: GET_SINGLE_ATTENDENCE_REQUEST });

        const { data } = await axios.get(` http://localhost:4000/api/v1/employee/attendance/mylist/${month + 1}/${year}/${employee}`, {
            withCredentials: true
        });

        dispatch({
            type: GET_SINGLE_ATTENDENCE_SUCCESS,
            payload: data.employeesAttendance[0]
        });
    } catch (error) {
        dispatch({
            type: GET_SINGLE_ATTENDENCE_FAIL,
            payload: error.response
        });
    }
};

// post overtime
export const myEmployeeAttendenceOvertime = (employee, attendanceMonth, attendanceYear, overtime, date) => async (dispatch) => {
    axios.defaults.withCredentials = true;
    try {
        dispatch({ type: OVERTIME_ATTENDENCE_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                withCredentials: true
            }
        };
        const { data } = await axios.post(
            ` http://localhost:4000/api/v1/employee/attendance/updateovertime`,
            { employee, attendanceMonth, attendanceYear, overtime, date },
            config
        );
        console.log(data);
        dispatch({
            type: OVERTIME_ATTENDENCE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: OVERTIME_ATTENDENCE_FAIL,
            payload: error.response
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};
