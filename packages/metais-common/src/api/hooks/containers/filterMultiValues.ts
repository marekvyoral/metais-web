import { useTranslation } from 'react-i18next'

import { useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { GET_ENUM } from '@isdd/metais-common/api/constants'

export const useOptionsPersonType = () => {
    const { data: personTypesCategories } = useGetEnum(GET_ENUM.TYP_OSOBY)
    const optionsPersonType = personTypesCategories?.enumItems?.map((enumItem) => ({
        value: `${enumItem.code}`,
        label: `${enumItem.value} - ${enumItem.description}`,
    }))
    return { optionsPersonType }
}

export const useOptionsPersonCategory = () => {
    const { data: personCategories } = useGetEnum(GET_ENUM.KATEGORIA_OSOBA)
    const { t } = useTranslation()

    const optionsPersonCategories = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(personCategories?.enumItems?.map((enumItem) => ({
            value: enumItem.code ?? '',
            label: `${enumItem.value} - ${enumItem.description}` ?? '',
        })) ?? []),
    ]
    return { optionsPersonCategories }
}
