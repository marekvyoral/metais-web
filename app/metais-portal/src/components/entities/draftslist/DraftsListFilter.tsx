import React from 'react'
import { Filter, IOption, Input, SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { ApiStandardRequestPreviewRequestChannel, GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { SelectUserIdentities } from '@isdd/metais-common/components/select-user-identities/SelectUserIdentities'
import { SelectWorkingGroups } from '@isdd/metais-common/components/select-working-groups/SelectWorkingGroups'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'

import { DraftsListFilterItems } from '@/types/filters'
export interface Filter {
    defaultFilterValues: GetFOPStandardRequestsParams
}
export const DraftsListFilter = ({ defaultFilterValues }: Filter) => {
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

    return (
        <Filter
            defaultFilterValues={defaultFilterValues}
            heading={<></>}
            form={({ register, setValue, filter, watch, control }) => {
                return (
                    <div>
                        <Input {...register(DraftsListFilterItems.DRAFT_NAME)} label={t('DraftsList.filter.draftName')} />
                        <SelectUserIdentities
                            filter={filter}
                            setValue={setValue}
                            name={DraftsListFilterItems.CREATED_BY}
                            label={t('DraftsList.filter.createdBy')}
                        />
                        <SelectWorkingGroups
                            filter={filter}
                            setValue={setValue}
                            label={t('DraftsList.filter.workGroupId')}
                            name={DraftsListFilterItems.WORK_GROUP_ID}
                        />
                        <SimpleSelect
                            label={t('DraftsList.filter.state.label')}
                            name={DraftsListFilterItems.STATE}
                            options={statesOptions}
                            setValue={setValue}
                            defaultValue={filter.state}
                        />
                        <SimpleSelect
                            label={t('DraftsList.filter.draftType.label')}
                            name={DraftsListFilterItems.REQUEST_CHANNEL}
                            options={requestChannelOptions}
                            setValue={setValue}
                            defaultValue={filter.requestChannel}
                        />
                        <DateInput
                            {...register(DraftsListFilterItems.FROM_DATE)}
                            label={t('DraftsList.filter.fromDate')}
                            maxDate={new Date(watch('toDate') ?? '')}
                            control={control}
                            setValue={setValue}
                        />
                        <DateInput
                            {...register(DraftsListFilterItems.TO_DATE)}
                            label={t('DraftsList.filter.toDate')}
                            minDate={new Date(watch('fromDate') ?? '')}
                            control={control}
                            setValue={setValue}
                        />
                    </div>
                )
            }}
        />
    )
}
