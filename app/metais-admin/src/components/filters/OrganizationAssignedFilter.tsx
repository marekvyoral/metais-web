import { Filter } from '@isdd/idsk-ui-kit/filter'
import { CheckBox, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { useOptionsPersonCategory } from '@isdd/metais-common/api/hooks/containers/filterMultiValues'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { OrganizationFilterData } from '@/pages/organizations/organizations'

type Props = {
    defaultFilterValues: OrganizationFilterData
    onlyFreePO: {
        onlyFreePOChecked: boolean
        setOnlyFreePOChecked: Dispatch<SetStateAction<boolean>>
    }
}

export const OrganizationAssignedFilter = ({ defaultFilterValues, onlyFreePO: { onlyFreePOChecked, setOnlyFreePOChecked } }: Props) => {
    const { t } = useTranslation()

    const { optionsPersonCategories } = useOptionsPersonCategory()

    return (
        <Filter<OrganizationFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, filter, setValue }) => (
                <div>
                    <Input
                        label={t(`filter.organizations.name`)}
                        placeholder={t(`filter.namePlaceholder`)}
                        {...register(ATTRIBUTE_NAME.Gen_Profil_nazov)}
                    />
                    <SimpleSelect
                        name="EA_Profil_PO_kategoria_osoby"
                        setValue={setValue}
                        label={t('filter.PO.publicAuthorityType')}
                        options={optionsPersonCategories}
                        defaultValue={filter.EA_Profil_PO_kategoria_osoby?.[0] ?? ''}
                    />
                    <Input
                        label={t(`filter.organizations.ICO`)}
                        placeholder={t(`filter.organizations.ICO`)}
                        {...register(ATTRIBUTE_NAME.EA_Profil_PO_ico)}
                    />

                    <CheckBox
                        name="onlyFreePO"
                        id="onlyFreePO"
                        label={t('filter.organizations.onlyFreePO')}
                        checked={onlyFreePOChecked}
                        onChange={(e) => setOnlyFreePOChecked(e?.target?.checked)}
                    />
                </div>
            )}
        />
    )
}
