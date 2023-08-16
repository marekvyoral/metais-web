import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input, MultiSelect } from '@isdd/idsk-ui-kit/index'
import { useOptionsPersonType } from '@isdd/metais-common/api/hooks/containers/filterMultiValues'
import React from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'

import { KSFilterData } from '@/pages/organizations/organizations'

type Props = {
    defaultFilterValues: KSFilterData
}

const OrganizationFilter = ({ defaultFilterValues }: Props) => {
    const { t } = useTranslation()

    const { optionsPersonType } = useOptionsPersonType()

    return (
        <Filter<KSFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, control }) => (
                <div>
                    <Input
                        label={t(`filter.organizations.name`)}
                        placeholder={t(`filter.namePlaceholder`)}
                        {...register(ATTRIBUTE_NAME.Gen_Profil_nazov)}
                    />
                    <Controller
                        control={control}
                        name="EA_Profil_PO_typ_osoby"
                        render={({ field: { onChange, value } }) => (
                            <MultiSelect
                                name="EA_Profil_PO_typ_osoby"
                                label={t('filter.PO.publicAuthorityType')}
                                options={optionsPersonType ?? []}
                                values={optionsPersonType?.filter((option) => option.value && value?.includes(option.value))}
                                onChange={(personTypes) => onChange(personTypes.map((personType) => personType.value))}
                            />
                        )}
                    />
                    <Input label={t(`filter.organizations.ICO`)} placeholder={t(`filter.nameICO`)} {...register(ATTRIBUTE_NAME.EA_Profil_PO_ico)} />
                </div>
            )}
        />
    )
}

export default OrganizationFilter
