import dashboard from './dashboard';
import attendance from './attendance';
import payments from './payments';
import employee from './employee';
import pcsRate from "./rate";

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [dashboard, employee, attendance, pcsRate, payments]
};

export default menuItems;
