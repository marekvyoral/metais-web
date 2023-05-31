export const getHowToDisplayUnits = () => {
    return fetch('https://metais.vicepremier.gov.sk/enumsrepository/enums/enum/all/MERNA_JEDNOTKA?lang=sk').then((res) => res.json())
}

export const getHowToDisplayConstraints = (value: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/enumsrepository/enums/enum/all/${value}?lang=sk`).then((res) => res.json())
}
