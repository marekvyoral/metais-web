import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IOption, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { DRAFT, ENTITY_ISVS, ENTITY_PROJECT, INVALIDATED, PO } from '@isdd/metais-common/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CustomListIntegrationLinksParams } from '@/pages/prov-integration/list'

type Props = {
    defaultFilterValues: CustomListIntegrationLinksParams
    dizStateData: EnumType | undefined
}

enum IntegrationListFilterInputNames {
    INTEGRATION_NAME = 'integrationName',
    ITEM_STATE = 'itemState',
    DIZ_STATE = 'dizState',
}
const MULTI_SELECT_INPUTS: { code: keyof CustomListIntegrationLinksParams; entity: string }[] = [
    {
        code: 'providingProjects',
        entity: ENTITY_PROJECT,
    },
    {
        code: 'consumingProjects',
        entity: ENTITY_PROJECT,
    },
    {
        code: 'providingIsvs',
        entity: ENTITY_ISVS,
    },
    {
        code: 'consumingIsvs',
        entity: ENTITY_ISVS,
    },
    {
        code: 'providingPo',
        entity: PO,
    },
    {
        code: 'consumingPo',
        entity: PO,
    },
]

export const ProvIntegrationListFilter: React.FC<Props> = ({ defaultFilterValues, dizStateData }) => {
    const { t } = useTranslation()

    const itemStateOptions: IOption<string>[] = [
        {
            label: t('metaAttributes.state.INVALIDATED'),
            value: INVALIDATED,
        },
        {
            label: t('metaAttributes.state.DRAFT'),
            value: DRAFT,
        },
    ]
    const dizStateOptions: IOption<string>[] =
        dizStateData?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.description ?? '', disabled: !item.valid })) ?? []

    return (
        <Filter
            defaultFilterValues={defaultFilterValues}
            heading={<></>}
            form={({ register, setValue, filter }) => {
                return (
                    <div>
                        <Input {...register(IntegrationListFilterInputNames.INTEGRATION_NAME)} label={t('integrationLinks.filter.name')} />
                        <SimpleSelect
                            label={t('integrationLinks.filter.state')}
                            name={IntegrationListFilterInputNames.ITEM_STATE}
                            options={itemStateOptions}
                            setValue={setValue}
                            defaultValue={filter.itemState}
                        />
                        <SimpleSelect
                            label={t('integrationLinks.filter.dizState')}
                            name={IntegrationListFilterInputNames.DIZ_STATE}
                            options={dizStateOptions}
                            setValue={setValue}
                            defaultValue={filter.dizState}
                        />
                        {MULTI_SELECT_INPUTS.map((multiSelect) => (
                            <SelectPOForFilter
                                key={multiSelect.code}
                                name={multiSelect.code}
                                ciType={multiSelect.entity}
                                label={t(`integrationLinks.filter.${multiSelect.code}`)}
                                valuesAsUuids={(filter[multiSelect.code] as string[]) ?? []}
                                isMulti
                                onChange={(val) =>
                                    setValue(
                                        multiSelect.code,
                                        val?.map((v) => v?.uuid ?? ''),
                                    )
                                }
                            />
                        ))}
                    </div>
                )
            }}
        />
    )
}
