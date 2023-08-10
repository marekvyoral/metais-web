import React from 'react'
import { Filter, SimpleSelect } from '@isdd/idsk-ui-kit'
import { RelatedRoleType } from '@isdd/metais-common/api/generated/iam-swagger'
import { useTranslation } from 'react-i18next'
import { EnumType } from '@isdd/metais-common/api'

import { FilterData, defaultFilterValues } from '@/pages/egov/roles'

interface RoleFilterProps {
    tableRoleGroups: EnumType | undefined
}

const RolesFilter: React.FC<RoleFilterProps> = ({ tableRoleGroups }) => {
    const groups: { value: string; label: string }[] =
        tableRoleGroups?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.value ?? '' })) ?? []
    const { t } = useTranslation()
    return (
        <Filter<FilterData>
            form={(register) => (
                <>
                    <SimpleSelect
                        {...register('group')}
                        id="group"
                        label={'Group'}
                        options={[{ value: 'all', label: t('adminRolesPage.all') }, ...groups]}
                    />
                    <SimpleSelect
                        {...register('system')}
                        id="system"
                        label={'System'}
                        options={[
                            { value: 'all', label: t('adminRolesPage.all') },
                            { value: RelatedRoleType.SYSTEM, label: t('adminRolesPage.yes') },
                            { value: RelatedRoleType.NON_SYSTEM, label: t('adminRolesPage.no') },
                        ]}
                    />
                </>
            )}
            defaultFilterValues={defaultFilterValues}
        />
    )
}

export default RolesFilter
