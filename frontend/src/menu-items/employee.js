// assets
import { IconAlarm, IconEyeglass, IconCalendarTime, IconCalendarOff, IconUserPlus } from '@tabler/icons';
// constant
const icons = {
    IconAlarm,
    IconEyeglass,
    IconCalendarTime,
    IconCalendarOff,
    IconUserPlus
};

// ==============================|| ATTENDANCE MENU ITEMS ||============================== //

const employee = {
    id: 'employee',
    title: 'Employee',
    type: 'group',
    children: [
        {
            id: 'addEmployee',
            title: 'Add Employee',
            type: 'item',
            url: '/employee/add-employee',
            icon: icons.IconUserPlus,
            breadcrumbs: false
        },
        {
            id: 'viewEmployee',
            title: 'View Employee',
            type: 'item',
            url: '/employee/view-employee',
            icon: icons.IconEyeglass,
            breadcrumbs: false
        }
    ]
};

export default employee;
