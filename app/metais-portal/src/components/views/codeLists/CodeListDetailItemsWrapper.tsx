import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { useTranslation } from 'react-i18next'
import {
    ActionsOverTable,
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    BulkPopup,
    CreateEntityButton,
    MutationFeedback,
    QueryFeedback,
} from '@isdd/metais-common/index'
import {
    BaseModal,
    Button,
    ButtonGroupRow,
    ButtonLink,
    Filter,
    Input,
    PaginatorWrapper,
    SimpleSelect,
    Table,
    TextBody,
    TextWarning,
} from '@isdd/idsk-ui-kit/index'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, CodeListItemState, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'

import { CodeListDetailItemsTable, TableCols } from './CodeListDetailItemsTable'
import { selectBasedOnLanguageAndDate } from './CodeListDetailUtils'

import {
    CodeListDetailFilterData,
    CodeListDetailItemsViewProps,
    CodeListFilterEffective,
    defaultFilterValues,
} from '@/components/containers/CodeListDetailItemsContainer'

interface SetDatesFormData {
    validFrom: Date
    effectiveFrom: Date
}

const getSelectedIds = (rowSelection: Record<string, TableCols>): number[] => {
    return Object.values(rowSelection)
        .map((row) => row.id)
        .filter((item): item is number => !!item)
}

const schema: Yup.ObjectSchema<SetDatesFormData> = Yup.object({
    validFrom: Yup.date().required().default(null),
    effectiveFrom: Yup.date().required().default(null),
})

export const CodeListDetailItemsWrapper: React.FC<CodeListDetailItemsViewProps> = ({
    items,
    attributeProfile,
    isLoading,
    isError,
    isErrorMutation,
    isSuccessMutation,
    workingLanguage,
    filter,
    invalidateCodeListDetailCache,
    handleFilterChange,
    handleMarkForPublish,
    handleSetDates,
}) => {
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState<Record<string, TableCols>>({})
    const [isMarkForPublishDialogOpened, setIsMarkForPublishDialogOpened] = useState<boolean>(false)
    const [isSetDatesDialogOpened, setIsSetDatesDialogOpened] = useState<boolean>(false)

    const { register, formState, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    })

    const onHandleMarkForPublish = () => {
        handleMarkForPublish(getSelectedIds(rowSelection))
        setIsMarkForPublishDialogOpened(false)
        invalidateCodeListDetailCache()
    }

    const onSetDatesSubmit = (formValues: FieldValues) => {
        const ids = getSelectedIds(rowSelection)
        const { effectiveFrom, validFrom } = formValues
        handleSetDates(ids, effectiveFrom, validFrom)
        setIsSetDatesDialogOpened(false)
        invalidateCodeListDetailCache()
    }

    const selectedItemsTable = (
        <Table
            data={Object.values(rowSelection)}
            columns={[
                {
                    id: 'code',
                    header: t('codeListDetail.table.code'),
                    accessorFn: (row) => row.itemCode,
                },
                {
                    id: 'name',
                    header: t('codeListDetail.table.name'),
                    meta: { getCellContext: (ctx) => ctx?.getValue?.() },
                    accessorFn: (row) => selectBasedOnLanguageAndDate(row.codelistItemNames, workingLanguage),
                },
            ]}
        />
    )

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            {isError && <QueryFeedback error={isError} loading={false} />}
            <TextHeading size="L">{t('codeListDetail.title.items')}</TextHeading>
            <Filter<CodeListDetailFilterData>
                heading={t('codeList.filter.title')}
                defaultFilterValues={defaultFilterValues}
                form={({ filter: formFilter, setValue }) => (
                    <div>
                        <SimpleSelect
                            id="state"
                            name="state"
                            label={t('codeListDetail.filter.state')}
                            options={Object.values(CodeListItemState).map((state) => ({
                                value: state,
                                label: t(`codeListDetail.state.${state}`),
                            }))}
                            setValue={setValue}
                            defaultValue={formFilter.state || defaultFilterValues.state}
                        />
                        <SimpleSelect
                            id="effective"
                            name="effective"
                            label={t('codeListDetail.filter.effective.label')}
                            options={[
                                { value: CodeListFilterEffective.TRUE, label: t('codeListDetail.filter.effective.true') },
                                { value: CodeListFilterEffective.FALSE, label: t('codeListDetail.filter.effective.false') },
                            ]}
                            setValue={setValue}
                            defaultValue={formFilter.effective || defaultFilterValues.effective}
                        />
                    </div>
                )}
            />
            <MutationFeedback
                success={isSuccessMutation}
                successMessage={t('codeListDetail.feedback.editCodeListItems')}
                error={isErrorMutation ? t('feedback.mutationErrorMessage') : undefined}
            />
            <ActionsOverTable
                entityName=""
                handleFilterChange={handleFilterChange}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                createButton={
                    <Can I={Actions.CREATE} a={Subjects.ITEM}>
                        <CreateEntityButton
                            label={t('codeListDetail.button.addNewItem')}
                            onClick={() => {
                                return // add edit
                            }}
                        />
                    </Can>
                }
                bulkPopup={
                    <Can I={Actions.BULK_ACTIONS} a={Subjects.ITEM}>
                        <BulkPopup
                            checkedRowItems={Object.keys(rowSelection).length}
                            items={() => [
                                <ButtonLink
                                    key={'markReadyForPublishing'}
                                    label={t('codeListDetail.button.markReadyForPublishingBulk')}
                                    onClick={() => setIsMarkForPublishDialogOpened(true)}
                                />,
                                <ButtonLink
                                    key={'setDates'}
                                    label={t('codeListDetail.button.setDatesBulk')}
                                    onClick={() => setIsSetDatesDialogOpened(true)}
                                />,
                            ]}
                        />
                    </Can>
                }
            />
            {items && (
                <CodeListDetailItemsTable
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    items={items}
                    attributeProfile={attributeProfile}
                    filter={filter}
                    workingLanguage={workingLanguage}
                    handleFilterChange={handleFilterChange}
                    handleMarkForPublish={handleMarkForPublish}
                />
            )}
            <PaginatorWrapper
                pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                pageSize={filter.pageSize || BASE_PAGE_SIZE}
                dataLength={items?.codelistsItemCount || 0}
                handlePageChange={handleFilterChange}
            />
            <BaseModal isOpen={isSetDatesDialogOpened} close={() => setIsSetDatesDialogOpened(false)}>
                <TextHeading size="M">{t(`codeListDetail.modal.title.setDates`)}</TextHeading>
                {Object.keys(rowSelection).length > 0 ? (
                    <form onSubmit={handleSubmit(onSetDatesSubmit)}>
                        <TextBody>{t('codeListDetail.modal.text.willBeChanged')}</TextBody>
                        {selectedItemsTable}
                        <Input
                            type="date"
                            label={t('codeListDetail.modal.form.validFrom')}
                            id="validFrom"
                            {...register(`validFrom`)}
                            error={formState.errors.validFrom?.message}
                        />
                        <Input
                            type="date"
                            label={t('codeListDetail.modal.form.effectiveFrom')}
                            id="effectiveFrom"
                            {...register(`effectiveFrom`)}
                            error={formState.errors.validFrom?.message}
                        />
                        <ButtonGroupRow>
                            <Button type="submit" disabled={!formState.isValid} label={t('codeListDetail.modal.button.confirm')} />
                        </ButtonGroupRow>
                    </form>
                ) : (
                    <TextWarning>{t('codeListDetail.modal.text.nothingSelected')}</TextWarning>
                )}
            </BaseModal>
            <BaseModal isOpen={isMarkForPublishDialogOpened} close={() => setIsMarkForPublishDialogOpened(false)}>
                <TextHeading size="M">{t(`codeListDetail.modal.title.markForPublish`)}</TextHeading>
                {Object.keys(rowSelection).length > 0 ? (
                    <>
                        <TextBody>{t('codeListDetail.modal.text.willBeChanged')}</TextBody>
                        {selectedItemsTable}
                        <ButtonGroupRow>
                            <Button onClick={onHandleMarkForPublish} label={t('codeListDetail.modal.button.confirm')} />
                        </ButtonGroupRow>
                    </>
                ) : (
                    <TextWarning>{t('codeListDetail.modal.text.nothingSelected')}</TextWarning>
                )}
            </BaseModal>
        </QueryFeedback>
    )
}
