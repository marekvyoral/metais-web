import { useLocation, useNavigate } from 'react-router-dom'

export const useBackButtonNavigate = (href: string) => {
    const location = useLocation()
    const navigate = useNavigate()
    const fromHref = location.state?.from?.pathname + location.state?.from?.search

    const backButtonNavigate = () => {
        if (location.state.from.pathname === href && location.state.from.search) {
            navigate(fromHref)
        } else {
            navigate(href)
        }
    }

    return { backButtonNavigate }
}
