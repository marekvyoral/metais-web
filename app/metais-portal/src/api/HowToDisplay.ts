export const getHowToDisplayConstraints = (value: string | undefined) => {
    return fetch(import.meta.env.VITE_REST_CLIENT_ENUMS_REPO_TARGET_URL + `/enums/enum/all/${value}`).then((res) => res.json())
}
