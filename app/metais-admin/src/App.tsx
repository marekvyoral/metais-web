import React from 'react'

import { Router } from '@/navigation/Router'

export const App: React.FC = () => {
    localStorage.setItem(
        'token',
        'eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJJYW1VSUNsaWVudCIsImlzcyI6Imh0dHA6XC9cL2lhbS1vaWRjLW1ldGFpczMuYXBwcy5kZXYuaXNkZC5zazo4MFwvIiwiZXhwIjoxNjg5OTU2OTYxLCJpYXQiOjE2ODk5MjgxNjEsImp0aSI6Ijk0YmVkOWZlLTQ0ZjktNDQ3ZC1iYmU1LTAyZjQ5NDk5ZWIyZSJ9.ENU2TWr6oXottY96cahLkwg51IDqe2D37lN1GZIwWKdTCOwo8oCo7XW_xS0C63mg5AM9zvoWqv2G2z30UDw24t9n4F4l8uAfYYnJM1L2OeKR2nQI-VlPW2CxSZwCYxzED1PySDODzIjBTLzzVBTphrGgUeqdWrlw8I7olND7MVNl_EKuaarW_gtgfIWm3Hke_lVtcybLc8ZY5WCxSF643lrV8eToVYdkmqsgQoUdk9U6OZ5hF9lx5fUbLCiKieqwu4QvEighsSMX5gE62rMb1dA_3oxytnVVPTkADgoiFixWxl-OuffSGp7--1J--_RVET6oR-nOFWiO3YYhPrZjYA',
    )
    return <Router />
}
