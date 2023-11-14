import {
    ApiReferenceRegisterItem,
    useDeleteReferenceRegisterItem,
    useUpdateReferenceRegisterItem,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useTranslation } from 'react-i18next'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FieldValues, useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import { Button } from '@isdd/idsk-ui-kit/index'
import { useParams } from 'react-router-dom'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { MutationFeedback } from '@isdd/metais-common/index'

import { RefRegisterItemViewItemInput } from './itemTypes/RefRegisterItemViewItemInput'
import { RefRegisterItemViewItemTextArea } from './itemTypes/RefRegisterItemViewItemTextArea'
import { RefRegisterItemViewItemLazySelects } from './itemTypes/RefRegisterItemViewItemLazySelects'

import styles from '@/components/entities/accordion/basicInformationSection.module.scss'
import itemStyles from '@/components/views/refregisters/refRegisterItemView.module.scss'
import { RefRegisterItemItems, RefRegisterItemItemsFieldNames } from '@/types/filters'

interface IRefRegisterItemView {
    row: ApiReferenceRegisterItem
    referenceRegisterItemAttributes: Attribute[] | undefined
}

export const RefRegisterItemView = ({ row, referenceRegisterItemAttributes }: IRefRegisterItemView) => {
    const { t } = useTranslation()
    const [isChangeMode, setIsChangeMode] = useState<boolean>(false)
    const { entityId } = useParams()
    const { mutateAsync: updateRefRegisterItem, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = useUpdateReferenceRegisterItem()
    const { mutateAsync: deleteRefRegisterItem, isSuccess: isSuccessDelete, isError: isErrorDelete } = useDeleteReferenceRegisterItem()
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            ...row,
        },
    })

    const onSubmit = useCallback(
        (formValues: FieldValues) => {
            updateRefRegisterItem({
                referenceRegisterUuid: entityId ?? '',
                referenceRegisterItemUuid: row?.uuid ?? '',
                data: {
                    ...formValues,
                },
            })
            setIsChangeMode(false)
        },
        [entityId, row, updateRefRegisterItem],
    )

    const onDelete = useCallback(
        (regItem: ApiReferenceRegisterItem) => {
            deleteRefRegisterItem({
                referenceRegisterUuid: entityId ?? '',
                referenceRegisterItemUuid: regItem?.uuid ?? '',
            })
        },
        [entityId, deleteRefRegisterItem],
    )

    const getTooltipOfRow = (refRegisterAttribute: string) => {
        return referenceRegisterItemAttributes?.find((val) => val?.technicalName === refRegisterAttribute)?.description ?? ''
    }

    const sourceReferenceHolders = watch('sourceReferenceHolders')

    return (
        <div className={styles.attributeGridRowBox}>
            <MutationFeedback
                success={isSuccessUpdate || isSuccessDelete}
                error={isErrorDelete || isErrorUpdate}
                successMessage={t('mutationFeedback.successfulUpdated')}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <RefRegisterItemViewItemInput
                    isChangeMode={isChangeMode}
                    register={register}
                    value={row?.order}
                    name={RefRegisterItemItemsFieldNames.ORDER}
                    label={t('refRegisters.detail.items.order')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.ORDER)}
                />

                <RefRegisterItemViewItemInput
                    isChangeMode={isChangeMode}
                    register={register}
                    value={row?.itemName}
                    name={RefRegisterItemItemsFieldNames.ITEM_NAME}
                    label={t('refRegisters.detail.items.itemName')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.NAME)}
                />

                <RefRegisterItemViewItemInput
                    isChangeMode={isChangeMode}
                    register={register}
                    value={row?.referenceRegisterGroup?.groupName}
                    name={RefRegisterItemItemsFieldNames.GROUP}
                    label={t('refRegisters.detail.items.group')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.GROUP)}
                />

                <RefRegisterItemViewItemInput
                    isChangeMode={isChangeMode}
                    register={register}
                    value={row?.referenceRegisterSubGroup?.groupName}
                    name={RefRegisterItemItemsFieldNames.SUB_GROUP_NAME}
                    label={t('refRegisters.detail.items.subGroup')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.SUB_GROUP_NAME)}
                />

                <RefRegisterItemViewItemTextArea
                    isChangeMode={isChangeMode}
                    register={register}
                    value={row?.subjectIdentification}
                    name={RefRegisterItemItemsFieldNames.SUBJECT_IDENTIFICATION}
                    label={t('refRegisters.detail.items.subjectIdentification')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.SUBJECT_IDENTIFICATIONS)}
                />

                <RefRegisterItemViewItemTextArea
                    isChangeMode={isChangeMode}
                    register={register}
                    value={row?.refID}
                    name={RefRegisterItemItemsFieldNames.REF_ID}
                    label={t('refRegisters.detail.items.refID')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.REF_ID)}
                />

                <RefRegisterItemViewItemTextArea
                    isChangeMode={isChangeMode}
                    register={register}
                    value={row?.dataElementRefID}
                    name={RefRegisterItemItemsFieldNames.DATA_ELEMENT_REF_ID}
                    label={t('refRegisters.detail.items.dataElementRefID')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.DATA_ELEMENT_REF_ID)}
                />

                <RefRegisterItemViewItemTextArea
                    isChangeMode={isChangeMode}
                    register={register}
                    value={row?.note}
                    name={RefRegisterItemItemsFieldNames.NOTE}
                    label={t('refRegisters.detail.items.note')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.NOTE)}
                />

                <RefRegisterItemViewItemLazySelects
                    isChangeMode={isChangeMode}
                    setValue={setValue}
                    formValue={sourceReferenceHolders}
                    value={row?.sourceReferenceHolders}
                    name={RefRegisterItemItemsFieldNames.sourceReferenceHolders}
                    label={t('refRegisters.detail.items.sourceElementHolders')}
                    tooltip={getTooltipOfRow(RefRegisterItemItems.sourceElementHolders)}
                />

                <Can I={Actions.EDIT} a={'refRegisters.items'}>
                    <div className={itemStyles.buttonsWrapper}>
                        {isChangeMode && (
                            <div className={itemStyles.checkedButtons}>
                                <Button label={t('refRegisters.detail.items.save')} type="submit" />
                                <Button label={t('refRegisters.detail.items.cancel')} onClick={() => setIsChangeMode(false)} />
                            </div>
                        )}
                        <div className={itemStyles.buttonsPadding} />

                        <div className={itemStyles.buttonsGroup}>
                            {!isChangeMode && (
                                <>
                                    <Button label={t('refRegisters.detail.items.edit')} onClick={() => setIsChangeMode(!isChangeMode)} />
                                    <Button label={t('refRegisters.detail.items.delete')} onClick={() => onDelete(row)} />
                                </>
                            )}
                        </div>
                    </div>
                </Can>
            </form>
        </div>
    )
}
