// assets
import { IconAlarm, IconEyeglass, IconCalendarTime, IconCalendarOff, IconReport } from '@tabler/icons';
// constant
const icons = {
    IconAlarm,
    IconEyeglass,
    IconCalendarTime,
    IconCalendarOff,
    IconReport
};

// ==============================|| ATTENDANCE MENU ITEMS ||============================== //

const attendance = {
    id: 'attendance',
    title: 'Attendance',
    type: 'group',
    children: [
        {
            id: 'machineAttendance',
            title: 'Machine Attendance',
            type: 'item',
            url: '/attendance/machine-attendance',
            icon: icons.IconAlarm,
            breadcrumbs: false
        },
        {
            id: 'addAttendance',
            title: 'Add Attendance',
            type: 'item',
            url: '/attendance/add-attendance',
            icon: icons.IconAlarm,
            breadcrumbs: false
        },
        {
            id: 'viewAttendance',
            title: 'View Attendance',
            type: 'item',
            url: '/attendance/view-attendance',
            icon: icons.IconReport,
            breadcrumbs: false
        },
        {
            id: 'overtime',
            title: 'Overtime (O.T)',
            type: 'item',
            url: '/attendance/overtime',
            icon: icons.IconCalendarTime,
            breadcrumbs: false
        },
        {
            id: 'leaveManage',
            title: 'Leave Manage',
            type: 'item',
            url: '/attendance/leave-manage',
            icon: icons.IconCalendarOff,
            breadcrumbs: false
        }
    ]
};

export default attendance;
