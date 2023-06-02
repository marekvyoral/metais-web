import { BASE_URL } from '@/constants/constants'

export const getHowToDisplayUnits = () => {
    return fetch(BASE_URL + '/enumsrepository/enums/enum/all/MERNA_JEDNOTKA?lang=sk').then((res) => res.json())
}

export const getHowToDisplayConstraints = (value: string) => {
    return fetch(BASE_URL + `/enumsrepository/enums/enum/all/${value}?lang=sk`).then((res) => res.json())
}
