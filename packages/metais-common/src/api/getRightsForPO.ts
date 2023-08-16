export const getRightsForPO = (userId: string, orgId: string, token: string) => {
    const queryBody = {
        identityUuid: userId,
        cmdbId: orgId,
    }

    const baseUrl = import.meta.env.VITE_REST_CLIENT_METAIS_IAM_REST_TARGET_URL

    return fetch(baseUrl + `/metaisiam-rest/organizations/getRightsForPO`, {
        method: 'POST',
        body: JSON.stringify(queryBody),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json())
}
