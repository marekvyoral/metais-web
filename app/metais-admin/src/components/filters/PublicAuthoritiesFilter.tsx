import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { SelectPersonType } from '@isdd/metais-common/components/select-person-type/SelectPersonType'
import { useTranslation } from 'react-i18next'

import { PublicAuthoritiesFilterData } from '@/pages/public-authorities/list'

type Props = {
    defaultFilterValues: PublicAuthoritiesFilterData
}

const PublicAuthoritiesFilter = ({ defaultFilterValues }: Props) => {
    const { t } = useTranslation()

    return (
        <Filter<PublicAuthoritiesFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, setValue, filter }) => (
                <div>
                    <Input
                        label={t(`filter.publicAuthorities.name`)}
                        placeholder={t(`filter.namePlaceholder`)}
                        {...register(ATTRIBUTE_NAME.Gen_Profil_nazov)}
                    />
                    <SelectPersonType filter={filter} setValue={setValue} />
                    <Input
                        label={t(`filter.publicAuthorities.ICO`)}
                        placeholder={t(`filter.publicAuthorities.ICO`)}
                        {...register(ATTRIBUTE_NAME.EA_Profil_PO_ico)}
                    />
                </div>
            )}
        />
    )
}

export default PublicAuthoritiesFilter
