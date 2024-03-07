import React from 'react'
import { BaseModal, TextHeading } from '@isdd/idsk-ui-kit/index'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { SelectWorkingGroups } from '@isdd/metais-common/components/select-working-groups/SelectWorkingGroups'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styles from '@isdd/metais-common/components/export-items-or-relations/exportItemsOrRelations.module.scss'
import { API_STANDARD_REQUEST_ATTRIBUTES } from '@isdd/metais-common/api'
import { ModalButtons } from '@isdd/metais-common/index'

interface IDraftsListAssignToPSDialog {
    openAddToPSDialog: boolean
    setOpenAddToPSDialog: () => void
    assignToPs: (values: FieldValues) => Promise<void>
}

export const DraftsListAssignToPSDialog = ({ openAddToPSDialog, setOpenAddToPSDialog, assignToPs }: IDraftsListAssignToPSDialog) => {
    const { handleSubmit, setValue } = useForm<GetFOPStandardRequestsParams>()
    const { t } = useTranslation()

    return (
        <BaseModal isOpen={openAddToPSDialog} close={setOpenAddToPSDialog}>
            <form onSubmit={handleSubmit(assignToPs)} noValidate>
                <div className={styles.modalContainer}>
                    <div className={styles.content}>
                        <TextHeading size={'L'} className={styles.heading}>
                            {t(`DraftsList.header.ASSIGNED`)}
                        </TextHeading>

                        <SelectWorkingGroups
                            setValue={setValue}
                            label={t('DraftsList.filter.workGroupId')}
                            name={API_STANDARD_REQUEST_ATTRIBUTES.workGroupId}
                            optionLabel={(option) => option?.name ?? ''}
                        />
                    </div>
                </div>
                <ModalButtons submitButtonLabel={t('DraftsList.header.changeState.submit')} onClose={setOpenAddToPSDialog} />
            </form>
        </BaseModal>
    )
}
