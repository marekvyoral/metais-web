import { useLocation, useNavigate } from 'react-router-dom'

export const useBackButtonNavigate = (href: string) => {
    const location = useLocation()
    const navigate = useNavigate()

    const backButtonNavigate = () => {
        if (location.state && location.state.from.pathname === href && location.state.from.search) {
            const fromHref = location.state?.from?.pathname + location.state?.from?.search
            navigate(fromHref, { state: { from: location } })
        } else {
            navigate(href, { state: { from: location } })
        }
    }

    return { backButtonNavigate }
}
