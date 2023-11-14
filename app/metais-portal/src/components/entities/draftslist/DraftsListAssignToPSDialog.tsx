import React from 'react'
import { BaseModal, Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { SelectWorkingGroups } from '@isdd/metais-common/components/select-working-groups/SelectWorkingGroups'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styles from '@isdd/metais-common/components/export-items-or-relations/exportItemsOrRelations.module.scss'
import { API_STANDARD_REQUEST_ATTRIBUTES } from '@isdd/metais-common/api'

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
            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <TextHeading size={'L'} className={styles.heading}>
                        {t(`DraftsList.header.ASSIGNED`)}
                    </TextHeading>

                    <form onSubmit={handleSubmit(assignToPs)}>
                        <>
                            <SelectWorkingGroups
                                setValue={setValue}
                                label={t('DraftsList.filter.workGroupId')}
                                name={API_STANDARD_REQUEST_ATTRIBUTES.workGroupId}
                                optionLabel={(option) => option?.name ?? ''}
                            />
                            <div className={styles.confirmButton}>
                                <Button label={t('DraftsList.header.changeState.submit')} type="submit" />
                            </div>
                        </>
                    </form>
                </div>
            </div>
        </BaseModal>
    )
}
