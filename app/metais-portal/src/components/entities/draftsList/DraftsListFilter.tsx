import React from 'react'
import { Filter, IOption, Input, SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { ApiStandardRequestPreviewRequestChannel } from '@isdd/metais-common/api/generated/standards-swagger'
import { SelectUserIdentities } from '@isdd/metais-common/components/select-user-identities/SelectUserIdentities'

import { DraftsListFilterItems } from '@/types/filters'
export interface Filter {
    defaultFilterValues: any
}
export const DraftsListFilter = ({ defaultFilterValues }: Filter) => {
    const { t } = useTranslation()

    const statesOptions: IOption[] = [
        { label: t('DraftsList.filter.state.REQUESTED'), value: 'REQUESTED' },
        { label: t('DraftsList.filter.state.ASSIGNED'), value: 'ASSIGNED' },
        { label: t('DraftsList.filter.state.REJECTED'), value: 'REJECTED' },
        { label: t('DraftsList.filter.state.ACCEPTED'), value: 'ACCEPTED' },
    ]

    const requestChannelOptions: IOption[] = Object.keys(ApiStandardRequestPreviewRequestChannel)?.map((val) => ({
        label: t(`DraftsList.filter.draftType.${val}`),
        value: val,
    }))

    return (
        <Filter
            defaultFilterValues={defaultFilterValues}
            heading={<></>}
            form={({ register, setValue, filter }) => (
                <div>
                    <Input {...register('draftName')} label={t('DraftsList.filter.draftName')} />
                    <SelectUserIdentities filter={filter} setValue={setValue} />
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
                    <Input {...register('fromDate')} type="date" label={t('DraftsList.filter.fromDate')} />
                    <Input {...register('toDate')} type="date" label={t('DraftsList.filter.toDate')} />
                </div>
            )}
        />
    )
}
