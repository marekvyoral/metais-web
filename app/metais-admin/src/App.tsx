import React from 'react'

import { Router } from '@/navigation/Router'

export const App: React.FC = () => {
    localStorage.setItem(
        'token',
        'eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJJYW1VSUNsaWVudCIsImlzcyI6Imh0dHA6XC9cL2lhbS1vaWRjLW1ldGFpczMuYXBwcy5kZXYuaXNkZC5zazo4MFwvIiwiZXhwIjoxNjg5ODY4Mjg1LCJpYXQiOjE2ODk4Mzk0ODUsImp0aSI6IjMwYWQ0YzQ0LTJkYWEtNDBjMC1hNzU0LTUxMjIwYWE4MzJlYSJ9.PgWs2pNS-rfqZvzh42fp--q_ql61ITXQEGKtptNPNWTEtd7gLFnli5U2HYiFIuWjm7ZclMyr5Ks-zRIfkPWG977V40L3oNzf61rjstzzvVBuvsNZAWGRfbw7JtqHsOWgf454RldOzSCsr2wTv8EJuy9VzLOerJ6nqLKgwD9HGHylRWU56XpK9skY2fsC0CH_FjITMzu6Toiz0CNSVouuTGpPvDytQgjsDFNFtvhqpp1lHDsxethd53UygQ0jP8oRCamNFqRkqbnmMxrpJ6GPHwBBQfI8q_o4A7pdu6Op1Ih4G-0ntb_Uvk2T_AkoVjhg-Pbi32XY_ffs60awFaug-A',
    )
    return <Router />
}
