import {
    GET_COMPANY_FAIL,
    GET_COMPANY_REQUEST,
    GET_COMPANY_SUCCESS,
    UPDATE_COMPANY_FAIL,
    UPDATE_COMPANY_REQUEST,
    UPDATE_COMPANY_SUCCESS
} from 'store/constant/companyConstant';

export const myCompanyReducer = (state = { orders: null }, action) => {
    switch (action.type) {
        case GET_COMPANY_REQUEST:
            return {
                orders: null,
                loading: true
            };
        case GET_COMPANY_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            };
        case GET_COMPANY_FAIL:
            return {
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};
