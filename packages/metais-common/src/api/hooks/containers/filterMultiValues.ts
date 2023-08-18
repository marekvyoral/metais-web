import { useGetEnum } from '@isdd/metais-common/api'

export const useOptionsPersonType = () => {
    const { data: personTypesCategories } = useGetEnum('TYP_OSOBY')
    const optionsPersonType = personTypesCategories?.enumItems?.map((enumItem) => ({
        value: `${enumItem.code}`,
        label: `${enumItem.value} - ${enumItem.description}`,
    }))
    return { optionsPersonType }
}
