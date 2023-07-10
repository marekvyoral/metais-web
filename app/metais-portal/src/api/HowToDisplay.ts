export const getHowToDisplayConstraints = (value: string | undefined) => {
    return fetch(import.meta.env.VITE_BASE_URL + `/enums/enum/all/${value}?lang=sk`).then((res) => res.json())
}
