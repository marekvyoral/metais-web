import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { MessageUi, UpdateTemplateRequest, useEditTemplate, useGetTemplates } from '@isdd/metais-common/api/generated/notification-manager-swagger'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'

import { defaultFilterValues } from '@/pages/templates-management/templates-management'

export interface IView {
    data?: MessageUi[]
    mutate: (editedTemplate: UpdateTemplateRequest, id: number) => Promise<void>
}

interface ITemplatesListContainer {
    View: React.FC<IView>
}

export const TemplatesManagementContainer: React.FC<ITemplatesListContainer> = ({ View }) => {
    const { data: templatesData, isLoading, isError, refetch, isFetching } = useGetTemplates({})
    const { filter: filterParams } = useFilterParams(defaultFilterValues)

    const { mutateAsync, isLoading: editLoading } = useEditTemplate({
        mutation: {
            onSuccess() {
                refetch()
            },
        },
    })

    const editTemplate = async (editedTemplate: UpdateTemplateRequest, id: number) => {
        await mutateAsync({
            id: id,
            data: {
                ...editedTemplate,
            },
        })
    }

    const filteredData = useMemo(() => {
        return (
            templatesData?.messages?.filter(
                (template) =>
                    latiniseString(template.key ?? '').includes(latiniseString(filterParams.fullTextSearch ?? '')) ||
                    latiniseString(template.message ?? '').includes(latiniseString(filterParams.fullTextSearch ?? '')),
            ) || []
        )
    }, [filterParams.fullTextSearch, templatesData?.messages])

    return (
        <QueryFeedback loading={isLoading || editLoading || isFetching} error={isError} indicatorProps={{ layer: 'parent' }} withChildren>
            <View data={filteredData} mutate={editTemplate} />
        </QueryFeedback>
    )
}
