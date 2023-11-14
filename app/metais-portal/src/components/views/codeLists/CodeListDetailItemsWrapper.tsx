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
import { yupResolver } from '@hookform/resolvers/yup'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, CodeListItemState, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'

import { IItemForm, ItemForm } from './components/modals/ItemForm/ItemForm'
import { CodeListDetailItemsTable, TableCols } from './CodeListDetailItemsTable'
import { selectBasedOnLanguageAndDate } from './CodeListDetailUtils'
import { useSetDatesSchema } from './useCodeListSchemas'

import {
    CodeListDetailFilterData,
    CodeListDetailItemsViewProps,
    CodeListFilterEffective,
    defaultFilterValues,
} from '@/components/containers/CodeListDetailItemsContainer'

const getSelectedItemCodes = (rowSelection: Record<string, TableCols>): string[] => {
    return Object.values(rowSelection)
        .filter((item) => item.itemCode !== undefined)
        .map((row) => row.itemCode || '')
}

export const CodeListDetailItemsWrapper: React.FC<CodeListDetailItemsViewProps> = ({
    items,
    attributeProfile,
    isLoading,
    isError,
    isSuccessMutation,
    isErrorEditItemSubmit,
    isLoadingEditItemSubmit,
    isSuccessEditItemSubmit,
    workingLanguage,
    filter,
    invalidateCodeListDetailCache,
    handleFilterChange,
    handleMarkForPublish,
    handleSetDates,
    handleStartItemEdit,
    handleSubmitItem,
}) => {
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState<Record<string, TableCols>>({})
    const [isMarkForPublishDialogOpened, setIsMarkForPublishDialogOpened] = useState<boolean>(false)
    const [isSetDatesDialogOpened, setIsSetDatesDialogOpened] = useState<boolean>(false)
    const [isItemEditOpen, setIsItemEditOpen] = useState(false)
    const [editingCodeListItem, setEditingCodeListItem] = useState<IItemForm>()

    const { schema } = useSetDatesSchema()

    const { register, formState, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    })

    const onHandleMarkForPublish = () => {
        handleMarkForPublish(getSelectedItemCodes(rowSelection))
        setIsMarkForPublishDialogOpened(false)
        invalidateCodeListDetailCache()
    }

    const onSetDatesSubmit = (formValues: FieldValues) => {
        const itemCodes = getSelectedItemCodes(rowSelection)
        const { effectiveFrom, validFrom } = formValues
        handleSetDates(itemCodes, effectiveFrom, validFrom)
        setIsSetDatesDialogOpened(false)
        invalidateCodeListDetailCache()
    }

    const handleOpenEditItem = async (item?: IItemForm) => {
        const returnedItem = await handleStartItemEdit(Number(item?.id))

        setEditingCodeListItem(returnedItem)
        setIsItemEditOpen(true)
    }

    const handleOpenCreateItem = () => {
        setEditingCodeListItem(undefined)
        setIsItemEditOpen(true)
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
            <MutationFeedback success={isSuccessMutation} successMessage={t('codeListDetail.feedback.editCodeListItems')} error={undefined} />
            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber || BASE_PAGE_NUMBER,
                    pageSize: filter.pageSize || BASE_PAGE_SIZE,
                    dataLength: items?.codelistsItemCount || 0,
                }}
                entityName=""
                handleFilterChange={handleFilterChange}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                createButton={
                    <Can I={Actions.CREATE} a={Subjects.ITEM}>
                        <CreateEntityButton label={t('codeListDetail.button.addNewItem')} onClick={() => handleOpenCreateItem()} />
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
                    handleOpenEditItem={handleOpenEditItem}
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
            {isItemEditOpen && (
                <ItemForm
                    isOpen={isItemEditOpen}
                    close={() => setIsItemEditOpen(false)}
                    onSubmit={handleSubmitItem}
                    isErrorMutation={isErrorEditItemSubmit}
                    isLoadingMutation={isLoadingEditItemSubmit}
                    isSuccessMutation={isSuccessEditItemSubmit}
                    item={editingCodeListItem}
                    attributeProfile={attributeProfile}
                    defaultOrderValue={items?.codelistsItemCount ?? 1}
                />
            )}
        </QueryFeedback>
    )
}
