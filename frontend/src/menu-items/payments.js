// assets
import { IconCash, IconBusinessplan, IconReceipt, IconCashBanknote, IconReportMoney, IconReceiptRefund } from '@tabler/icons';

// constant
const icons = {
    IconCash,
    IconBusinessplan,
    IconReceipt,
    IconCashBanknote,
    IconReportMoney,
    IconReceiptRefund
};

// ==============================|| PAYMENTS MENU ITEMS ||============================== //

const payments = {
    id: 'payments',
    title: 'Payments',
    type: 'group',
    children: [
        {
            id: 'recovery-and-allowances',
            title: 'Recovery & Allowances',
            type: 'item',
            url: '/payments/recovery-and-allowances',
            icon: icons.IconReceiptRefund,
            breadcrumbs: false
        },
        {
            id: 'view-salary',
            title: 'View Salary',
            type: 'item',
            url: '/payments/view-salary',
            icon: icons.IconReportMoney,
            breadcrumbs: false
        },
        {
            id: 'ecrChallan',
            title: 'ECR Challan',
            type: 'item',
            url: '/payments/ecr-challan',
            icon: icons.IconReceipt,
            breadcrumbs: false
        },
        {
            id: 'bonus',
            title: 'Bonus',
            type: 'item',
            url: '/payments/bonus',
            icon: icons.IconCashBanknote,
            breadcrumbs: false
        }
    ]
};

export default payments;
