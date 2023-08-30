import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input, MultiSelect } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { useOptionsPersonType } from '@isdd/metais-common/api/hooks/containers/filterMultiValues'
import { useTranslation } from 'react-i18next'

import { OrganizationFilterData } from '@/pages/organizations/organizations'

type Props = {
    defaultFilterValues: OrganizationFilterData
}

const OrganizationFilter = ({ defaultFilterValues }: Props) => {
    const { t } = useTranslation()

    const { optionsPersonType } = useOptionsPersonType()

    return (
        <Filter<OrganizationFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, setValue, filter }) => (
                <div>
                    <Input
                        label={t(`filter.organizations.name`)}
                        placeholder={t(`filter.namePlaceholder`)}
                        {...register(ATTRIBUTE_NAME.Gen_Profil_nazov)}
                    />
                    <MultiSelect
                        name="EA_Profil_PO_typ_osoby"
                        label={t('filter.PO.publicAuthorityType')}
                        options={optionsPersonType ?? []}
                        defaultValue={filter.EA_Profil_PO_typ_osoby}
                        setValue={setValue}
                    />
                    <Input
                        label={t(`filter.organizations.ICO`)}
                        placeholder={t(`filter.organizations.ICO`)}
                        {...register(ATTRIBUTE_NAME.EA_Profil_PO_ico)}
                    />
                </div>
            )}
        />
    )
}

export default OrganizationFilter
