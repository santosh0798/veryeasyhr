// assets
    import { IconAlarm, IconEyeglass, IconCalendarTime, IconCalendarOff, IconReport, IconReportAnalytics } from '@tabler/icons';
// constant
const icons = {
    IconAlarm,
    IconEyeglass,
    IconCalendarTime,
    IconCalendarOff,
    IconReport,
    IconReportAnalytics
};

// ==============================|| ATTENDANCE MENU ITEMS ||============================== //

const pcsRate = {
    id: 'pcsRate',
    title: 'Piece Rate',
    type: 'group',
    children: [
        {
            id: 'addPurePcsRate',
            title: 'Add Pure Pcs Rate',
            type: 'item',
            url: '/piece-rate/add-pure-pcs-rate',
            icon: icons.IconCalendarTime,
            breadcrumbs: false
        },
        {
            id: 'viewPurePcsRate',
            title: 'View Pure Pcs Rate',
            type: 'item',
            url: '/piece-rate/view-pure-pcs-rate',
            icon: icons.IconReport,
            breadcrumbs: false
        },
        {
            id: 'addMixPcsRate',
            title: 'Add Mix Pcs Rate',
            type: 'item',
            url: '/piece-rate/add-mix-pcs-rate',
            icon: icons.IconCalendarTime,
            breadcrumbs: false
        },
        {
            id: 'viewMixPcsRate',
            title: 'View Mix Pcs Rate',
            type: 'item',
            url: '/piece-rate/view-mix-pcs-rate',
            icon: icons.IconReport,
            breadcrumbs: false
        }
    ]
};

export default pcsRate;
