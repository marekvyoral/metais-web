import { urlBase } from './constants'

export const getHowToDisplayUnits = () => {
    return fetch(urlBase + '/enumsrepository/enums/enum/all/MERNA_JEDNOTKA?lang=sk').then((res) => res.json())
}

export const getHowToDisplayConstraints = (value: string | undefined) => {
    return fetch(urlBase + `/enumsrepository/enums/enum/all/${value}?lang=sk`).then((res) => res.json())
}
