import { Filter, SimpleSelect } from '@isdd/idsk-ui-kit'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { RelatedRoleType } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ALL_EVENT_TYPES } from '@isdd/metais-common/constants'

import { FilterData, defaultFilterValues } from '@/components/containers/Egov/Roles/RolesListContainer'

interface IRoleFilterProps {
    tableRoleGroups: EnumType | undefined
}

export const RolesFilter: React.FC<IRoleFilterProps> = ({ tableRoleGroups }) => {
    const groups: { value: string; label: string }[] =
        tableRoleGroups?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.value ?? '' })) ?? []
    const { t } = useTranslation()

    return (
        <Filter<FilterData>
            form={({ setValue, filter }) => (
                <>
                    <SimpleSelect
                        setValue={setValue}
                        id="group"
                        name="group"
                        label={'Group'}
                        options={[{ value: ALL_EVENT_TYPES, label: t('adminRolesPage.all') }, ...groups]}
                        defaultValue={filter.group}
                    />
                    <SimpleSelect
                        setValue={setValue}
                        id="system"
                        name="system"
                        label={'System'}
                        options={[
                            { value: ALL_EVENT_TYPES, label: t('adminRolesPage.all') },
                            { value: RelatedRoleType.SYSTEM, label: t('adminRolesPage.yes') },
                            { value: RelatedRoleType.NON_SYSTEM, label: t('adminRolesPage.no') },
                        ]}
                        defaultValue={filter.system}
                    />
                </>
            )}
            defaultFilterValues={defaultFilterValues}
        />
    )
}
