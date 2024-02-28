const baseURL = import.meta.env.VITE_API_BASE_URL

export const fetchCanCreateGraph = async (accessToken: string) => {
    const response = await fetch(`${baseURL}/controls/checkUserRights/canCreateGraph`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    const responseText = await response.text()
    return responseText
}
