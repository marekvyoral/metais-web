import { useTranslation } from 'react-i18next'

import { useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'

export const useOptionsPersonType = () => {
    const { data: personTypesCategories } = useGetEnum('TYP_OSOBY')
    const optionsPersonType = personTypesCategories?.enumItems?.map((enumItem) => ({
        value: `${enumItem.code}`,
        label: `${enumItem.value} - ${enumItem.description}`,
    }))
    return { optionsPersonType }
}

export const useOptionsPersonCategory = () => {
    const { data: personCategories } = useGetEnum('KATEGORIA_OSOBA')
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
