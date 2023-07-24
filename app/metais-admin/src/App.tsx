import React from 'react'

import { Router } from '@/navigation/Router'

export const App: React.FC = () => {
    localStorage.setItem(
        'token',
        'eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJJYW1VSUNsaWVudCIsImlzcyI6Imh0dHA6XC9cL2lhbS1vaWRjLW1ldGFpczMuYXBwcy5kZXYuaXNkZC5zazo4MFwvIiwiZXhwIjoxNjkwMjE3NTA5LCJpYXQiOjE2OTAxODg3MDksImp0aSI6IjNhZTg2Y2M0LWNjZWMtNGQ5ZS1hZGIzLWJmNzA1NDIyNjVhZSJ9.ASLdrzIj55H-VgyjUQtjVyOa4jfxnxEcrizTfkIpFTdO_pg5yKp6U3wgTM2lCWsMW-WQ29Rqvg3i_-Cpv7mt-wfHGVD5YtxbCknMggxiuD5817RQzKHLihWI5xSEYpknZqgcR1MVzfUaEDblYmyMIddvA6qqBhuhvSB4OrYgg-FTgU8ySdlgggaqM5_Aj9jELJNrh6bLlCyUS3UCkezKfn_COh_nef2zbIreUMXm8qc-I3X3pSGoyv1Deu4AiANLWSO5rvj3AKjKmyxqjZqJp0ona0Zv4ZscVBX1xkaq7wAGSZlQv6iGBIRg5ivIhcRQSxCZtafUtG28MG1H6ZVj1A',
    )
    return <Router />
}
