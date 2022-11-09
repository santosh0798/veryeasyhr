import axios from 'axios';
import {
    GET_COMPANY_FAIL,
    GET_COMPANY_REQUEST,
    GET_COMPANY_SUCCESS,
    UPDATE_COMPANY_ALLOWANCE_FAIL,
    UPDATE_COMPANY_ALLOWANCE_REQUEST,
    UPDATE_COMPANY_ALLOWANCE_SUCCESS,
    UPDATE_COMPANY_FAIL,
    UPDATE_COMPANY_REQUEST,
    UPDATE_COMPANY_SUCCESS
} from 'store/constant/companyConstant';
import { toast } from 'react-toastify';

// Add Company
export const updateCompany = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_COMPANY_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                withCredentials: true
            }
        };

        const { data } = await axios.put(' http://localhost:4000/api/v1/company/update', userData, config);
        dispatch({
            type: UPDATE_COMPANY_SUCCESS,
            payload: data
        });
        toast.success('Company updated successfully');
    } catch (error) {
        dispatch({
            type: UPDATE_COMPANY_FAIL,
            payload: error
        });
        toast.error('Company updated Failed');
    }
};

// Get Company
export const getCompany = () => async (dispatch) => {
    try {
        dispatch({ type: GET_COMPANY_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                withCredentials: true
            }
        };

        const { data } = await axios.get(' http://localhost:4000/api/v1/company/mylist', config);
        dispatch({
            type: GET_COMPANY_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: GET_COMPANY_FAIL,
            payload: error
        });
    }
};



export const updateCompanyAllowance = (data) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_COMPANY_ALLOWANCE_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                withCredentials: true
            }
        };

        const datas = await axios.post(' http://localhost:4000/api/v1/company/allowance', {
            data: data
        }, config);
        dispatch({
            type: UPDATE_COMPANY_ALLOWANCE_SUCCESS,
            payload: datas
        });
    } catch (error) {
        dispatch({
            type: UPDATE_COMPANY_ALLOWANCE_FAIL,
            payload: error
        });
        toast.error('Company updated Failed');
    }
};
