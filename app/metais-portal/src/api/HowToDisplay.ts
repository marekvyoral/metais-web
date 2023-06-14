export const getHowToDisplayUnits = () => {
    return fetch(import.meta.env.VITE_REST_CLIENT_ENUMS_REPO_BASE_URL + '/enumsrepository/enums/enum/all/MERNA_JEDNOTKA?lang=sk').then((res) =>
        res.json(),
    )
}

export const getHowToDisplayConstraints = (value: string | undefined) => {
    return fetch(import.meta.env.VITE_REST_CLIENT_ENUMS_REPO_BASE_URL + `/enums/enum/all/${value}?lang=sk`).then((res) => res.json())
}
