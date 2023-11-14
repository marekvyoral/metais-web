import { Filter } from '@isdd/idsk-ui-kit/filter'
import { SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { SelectFilterOrganization } from '@isdd/metais-common/components/select-organization/SelectFilterOrganization'
import { useTranslation } from 'react-i18next'

import { PublicAuthoritiesMassUpdateFilterData } from '@/pages/public-authorities/mass-update'

type Props = {
    defaultFilterValues: PublicAuthoritiesMassUpdateFilterData
    entityName: string
}

export enum PublicAuthorityStateEnum {
    NEW = 'NEW',
    PROCESSED = 'PROCESSED',
    REJECTED = 'REJECTED',
}

export const PublicAuthoritiesMassUpdateFilter = ({ defaultFilterValues }: Props) => {
    const { t } = useTranslation()

    const optionsState = Object.values(PublicAuthorityStateEnum).map((i) => ({
        value: i,
        label: t(`publicAuthorities.massUpdate.stateEnum.${i}`),
    }))

    return (
        <Filter<PublicAuthoritiesMassUpdateFilterData>
            defaultFilterValues={defaultFilterValues}
            onlyForm
            heading={<></>}
            form={({ filter, setValue }) => (
                <div>
                    <SimpleSelect
                        name="state"
                        setValue={setValue}
                        isClearable={false}
                        label={t('filter.publicAuthorities.state')}
                        options={optionsState}
                        defaultValue={filter.state}
                    />
                    <SelectFilterOrganization<PublicAuthoritiesMassUpdateFilterData>
                        label={t('filter.publicAuthorities.poName')}
                        name="cmdbId"
                        isMulti
                        filter={filter}
                        setValue={setValue}
                    />
                </div>
            )}
        />
    )
}
