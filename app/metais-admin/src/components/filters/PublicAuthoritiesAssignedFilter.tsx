import { Filter } from '@isdd/idsk-ui-kit/filter'
import { CheckBox, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { useOptionsPersonCategory } from '@isdd/metais-common/api/hooks/containers/filterMultiValues'
import { useTranslation } from 'react-i18next'

import { PublicAuthoritiesFilterData } from '@/pages/public-authorities/list'

type Props = {
    defaultFilterValues: PublicAuthoritiesFilterData
}

export const PublicAuthoritiesAssignedFilter = ({ defaultFilterValues }: Props) => {
    const { t } = useTranslation()

    const { optionsPersonCategories } = useOptionsPersonCategory()

    return (
        <Filter<PublicAuthoritiesFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, filter, setValue }) => (
                <div>
                    <Input
                        label={t(`filter.publicAuthorities.name`)}
                        placeholder={t(`filter.namePlaceholder`)}
                        {...register(ATTRIBUTE_NAME.Gen_Profil_nazov)}
                    />
                    <SimpleSelect
                        name="EA_Profil_PO_kategoria_osoby"
                        setValue={setValue}
                        label={t('filter.PO.publicAuthorityType')}
                        options={optionsPersonCategories}
                        defaultValue={filter.EA_Profil_PO_kategoria_osoby}
                    />
                    <Input
                        label={t(`filter.publicAuthorities.ICO`)}
                        placeholder={t(`filter.publicAuthorities.ICO`)}
                        {...register(ATTRIBUTE_NAME.EA_Profil_PO_ico)}
                    />

                    <CheckBox id="onlyFreePO" label={t('filter.publicAuthorities.onlyFreePO')} {...register('onlyFreePO')} />
                </div>
            )}
        />
    )
}
