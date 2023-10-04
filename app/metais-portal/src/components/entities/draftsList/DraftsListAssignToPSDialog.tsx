import React, { useCallback } from 'react'
import { BaseModal, Button } from '@isdd/idsk-ui-kit/index'
import { GetFOPStandardRequestsParams, useAssignStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { SelectWorkingGroups } from '@isdd/metais-common/components/select-working-groups/SelectWorkingGroups'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface IDraftsListAssignToPSDialog {
    openAddToPSDialog: boolean
    setOpenAddToPSDialog: () => void
    standardRequestId: number
}

export const DraftsListAssignToPSDialog = ({ openAddToPSDialog, setOpenAddToPSDialog, standardRequestId }: IDraftsListAssignToPSDialog) => {
    const { handleSubmit, setValue } = useForm<GetFOPStandardRequestsParams>()
    const { t } = useTranslation()
    const { mutateAsync: assignToPS } = useAssignStandardRequest()

    const onSubmit = useCallback(
        async (values: FieldValues) => {
            await assignToPS({
                groupId: values?.workGroupId,
                standardRequestId,
            })
        },
        [assignToPS, standardRequestId],
    )
    return (
        <BaseModal isOpen={openAddToPSDialog} close={setOpenAddToPSDialog}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <>
                    <SelectWorkingGroups
                        setValue={setValue}
                        label={t('DraftsList.filter.workGroupId')}
                        name={'workGroupId'}
                        optionLabel={(option) => option?.name ?? ''}
                    />
                    <Button label={t('DraftsList.header.changeState.submit')} type="submit" />
                </>
            </form>
        </BaseModal>
    )
}
