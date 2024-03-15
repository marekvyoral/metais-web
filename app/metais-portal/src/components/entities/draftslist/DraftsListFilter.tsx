import { Filter, IOption, Input, SimpleSelect } from '@isdd/idsk-ui-kit'
import { DraftFilter } from '@isdd/metais-common/api/filter/filterApi'
import { ApiStandardRequestPreviewRequestChannel } from '@isdd/metais-common/api/generated/standards-swagger'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DynamicFilterAttributes, ExtendedAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { SelectUserIdentities } from '@isdd/metais-common/components/select-user-identities/SelectUserIdentities'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import { useTranslation } from 'react-i18next'

import { DraftsListFilterItems } from '@/types/filters'

export interface Filter {
    defaultFilterValues: DraftFilter
    workingGroupOptions: IOption<string>[]
}

export const DraftsListFilter = ({ defaultFilterValues, workingGroupOptions }: Filter) => {
    const { t } = useTranslation()

    const statesOptions: IOption<string>[] = [
        { label: t('DraftsList.filter.state.REQUESTED'), value: 'REQUESTED' },
        { label: t('DraftsList.filter.state.ASSIGNED'), value: 'ASSIGNED' },
        { label: t('DraftsList.filter.state.REJECTED'), value: 'REJECTED' },
        { label: t('DraftsList.filter.state.ACCEPTED'), value: 'ACCEPTED' },
    ]

    const requestChannelOptions: IOption<string>[] = Object.keys(ApiStandardRequestPreviewRequestChannel)?.map((val) => ({
        label: t(`DraftsList.filter.draftType.${val}`),
        value: val,
    }))
    const filterAttributes = (): ExtendedAttribute[] | undefined => {
        return [
            {
                name: t('DraftsList.filter.workGroupId'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: DraftsListFilterItems.WORK_GROUP_ID,
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SimpleSelect
                            label={t('DraftsList.filter.workGroupId')}
                            name={DraftsListFilterItems.REQUEST_CHANNEL}
                            options={workingGroupOptions}
                            defaultValue={value?.value}
                            onChange={(val) => {
                                onChange({ ...value, value: val })
                            }}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('DraftsList.filter.state.label'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: DraftsListFilterItems.STATE_CUSTOM,
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SimpleSelect
                            label={t('DraftsList.filter.state.label')}
                            name={DraftsListFilterItems.STATE_CUSTOM}
                            options={statesOptions}
                            defaultValue={value?.value}
                            onChange={(val) => {
                                onChange({ ...value, value: val })
                            }}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('DraftsList.filter.draftType.label'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: DraftsListFilterItems.REQUEST_CHANNEL,
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SimpleSelect
                            label={t('DraftsList.filter.draftType.label')}
                            name={DraftsListFilterItems.REQUEST_CHANNEL}
                            options={requestChannelOptions}
                            defaultValue={value?.value}
                            onChange={(val) => {
                                onChange({ ...value, value: val })
                            }}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('DraftsList.filter.createdBy'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: DraftsListFilterItems.CREATED_BY,
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SelectUserIdentities
                            value={value.value}
                            onChange={(val) => {
                                if (val) {
                                    onChange({ ...value, value: val.login })
                                }
                            }}
                            name={DraftsListFilterItems.CREATED_BY}
                            label={t('DraftsList.filter.createdBy')}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('DraftsList.filter.fromDate'),
                attributeTypeEnum: AttributeAttributeTypeEnum.DATE,
                technicalName: DraftsListFilterItems.FROM_DATE,
                invisible: false,
                valid: true,
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('DraftsList.filter.toDate'),
                attributeTypeEnum: AttributeAttributeTypeEnum.DATE,
                technicalName: DraftsListFilterItems.TO_DATE,
                invisible: false,
                valid: true,
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
        ]
    }

    return (
        <Filter<DraftFilter>
            defaultFilterValues={defaultFilterValues}
            heading={<></>}
            form={({ register, setValue, filter }) => {
                return (
                    <div>
                        <Input {...register(DraftsListFilterItems.DRAFT_NAME)} label={t('DraftsList.filter.draftName')} />
                        <DynamicFilterAttributes
                            setValue={setValue}
                            defaults={defaultFilterValues}
                            attributes={filterAttributes()}
                            attributeProfiles={[]}
                            constraintsData={[]}
                            filterData={{
                                attributeFilters: filter.attributeFilters ?? {},
                                metaAttributeFilters: {},
                            }}
                            ignoreInputNames={['lastModifiedAt', 'createdAt', 'owner', 'state']}
                        />
                    </div>
                )
            }}
        />
    )
}
