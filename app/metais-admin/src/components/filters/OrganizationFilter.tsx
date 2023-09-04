import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { SelectPersonType } from '@isdd/metais-common/components/select-person-type/SelectPersonType'
import { useTranslation } from 'react-i18next'

import { OrganizationFilterData } from '@/pages/organizations/organizations'

type Props = {
    defaultFilterValues: OrganizationFilterData
}

const OrganizationFilter = ({ defaultFilterValues }: Props) => {
    const { t } = useTranslation()

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
                    <SelectPersonType filter={filter} setValue={setValue} />
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
