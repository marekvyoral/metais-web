export const getHowToDisplayConstraints = (value: string | undefined, language: string) => {
    return fetch(import.meta.env.VITE_REST_CLIENT_ENUMS_REPO_TARGET_URL + `/enums/enum/all/${value}`, {
        method: 'GET',
        headers: {
            'Accept-Language': language,
        },
    }).then((res) => res.json())
}
