import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { useTranslation } from 'react-i18next'
import {
    ActionsOverTable,
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    BulkPopup,
    CreateEntityButton,
    ModalButtons,
    MutationFeedback,
    QueryFeedback,
} from '@isdd/metais-common/index'
import {
    BaseModal,
    ButtonLink,
    Filter,
    LoadingIndicator,
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
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'

import { ItemFormModal } from './components/modals/ItemFormModal/ItemFormModal'
import { CodeListDetailItemsTable, TableCols } from './CodeListDetailItemsTable'
import { selectBasedOnLanguageAndDate } from './CodeListDetailUtils'
import { useSetDatesSchema } from './useCodeListSchemas'

import {
    CodeListDetailFilterData,
    CodeListDetailItemsViewProps,
    CodeListFilterEffective,
    defaultFilterValues,
} from '@/components/containers/CodeListDetailItemsContainer'
import { CodeListItemState } from '@/componentHelpers/codeList'

const getSelectedItemCodes = (rowSelection: Record<string, TableCols>): string[] => {
    return Object.values(rowSelection)
        .filter((item) => item.itemCode !== undefined)
        .map((row) => row.itemCode || '')
}

export const CodeListDetailItemsWrapper: React.FC<CodeListDetailItemsViewProps> = ({
    code,
    items,
    attributeProfile,
    isLoading,
    isLoadingItemAction,
    isError,
    itemActionErrors,
    isSuccessItemActionMutation,
    workingLanguage,
    filter,
    invalidateCodeListDetailCache,
    onModalOpen,
    handleFilterChange,
    handleMarkForPublish,
    handleSetDates,
}) => {
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState<Record<string, TableCols>>({})
    const [isMarkForPublishDialogOpened, setIsMarkForPublishDialogOpened] = useState<boolean>(false)
    const [isSetDatesDialogOpened, setIsSetDatesDialogOpened] = useState<boolean>(false)
    const [isItemEditOpen, setIsItemEditOpen] = useState(false)
    const [editingCodeListItem, setEditingCodeListItem] = useState<ApiCodelistItem>()

    const { schema } = useSetDatesSchema()

    const {
        register,
        formState,
        handleSubmit,
        control,
        setValue: setFormValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
    })

    const handleDateChange = (date: Date | null, name: string) => {
        setFormValue(name as 'validFrom' | 'effectiveFrom', date ?? new Date())
    }

    const onHandleMarkForPublish = () => {
        handleMarkForPublish(getSelectedItemCodes(rowSelection))
    }

    const onSetDatesSubmit = (formValues: FieldValues) => {
        const itemCodes = getSelectedItemCodes(rowSelection)
        const { effectiveFrom, validFrom } = formValues
        handleSetDates(itemCodes, effectiveFrom, validFrom)
    }

    const handleOpenEditItem = async (item: ApiCodelistItem) => {
        onModalOpen()
        setEditingCodeListItem(item)
        setIsItemEditOpen(true)
    }

    const handleOpenCreateItem = () => {
        onModalOpen()
        setEditingCodeListItem(undefined)
        setIsItemEditOpen(true)
    }

    const handleCloseItemEditModal = () => {
        invalidateCodeListDetailCache()
        setIsItemEditOpen(false)
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
                            defaultValue={formFilter.effective}
                        />
                    </div>
                )}
            />
            <MutationFeedback
                success={isSuccessItemActionMutation}
                successMessage={t('codeListDetail.feedback.editCodeListItems')}
                error={undefined}
                onMessageClose={() => onModalOpen()}
            />
            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber || BASE_PAGE_NUMBER,
                    pageSize: filter.pageSize || BASE_PAGE_SIZE,
                    dataLength: items?.codelistsItemCount || 0,
                }}
                entityName=""
                handleFilterChange={handleFilterChange}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                selectedRowsCount={Object.keys(rowSelection).length}
                createButton={
                    <Can I={Actions.CREATE} a={Subjects.ITEM}>
                        <CreateEntityButton label={t('codeListDetail.button.addNewItem')} onClick={() => handleOpenCreateItem()} />
                    </Can>
                }
                bulkPopup={
                    <Can I={Actions.BULK_ACTIONS} a={Subjects.ITEM}>
                        <BulkPopup
                            checkedRowItems={Object.keys(rowSelection).length}
                            items={(closePopup) => [
                                <ButtonLink
                                    key={'markReadyForPublishing'}
                                    label={t('codeListDetail.button.markReadyForPublishingBulk')}
                                    onClick={() => {
                                        onModalOpen()
                                        setIsMarkForPublishDialogOpened(true)
                                        closePopup()
                                    }}
                                />,
                                <ButtonLink
                                    key={'setDates'}
                                    label={t('codeListDetail.button.setDatesBulk')}
                                    onClick={() => {
                                        onModalOpen()
                                        setIsSetDatesDialogOpened(true)
                                        closePopup()
                                    }}
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
                {isLoadingItemAction && <LoadingIndicator label={t('feedback.saving')} />}
                <TextHeading size="M">{t(`codeListDetail.modal.title.setDates`)}</TextHeading>
                {Object.keys(rowSelection).length > 0 ? (
                    <form onSubmit={handleSubmit(onSetDatesSubmit)}>
                        <TextBody>{t('codeListDetail.modal.text.willBeChanged')}</TextBody>
                        {selectedItemsTable}
                        <DateInput
                            label={t('codeListDetail.modal.form.validFrom')}
                            id="validFrom"
                            {...register(`validFrom`)}
                            error={formState.errors.validFrom?.message}
                            control={control}
                            handleDateChange={handleDateChange}
                            setValue={setFormValue}
                        />
                        <DateInput
                            label={t('codeListDetail.modal.form.effectiveFrom')}
                            id="effectiveFrom"
                            {...register(`effectiveFrom`)}
                            error={formState.errors.validFrom?.message}
                            control={control}
                            handleDateChange={handleDateChange}
                            setValue={setFormValue}
                        />
                        <ModalButtons
                            submitButtonLabel={t('codeListDetail.modal.button.confirm')}
                            onClose={() => setIsSetDatesDialogOpened(false)}
                            disabled={!watch('effectiveFrom') || !watch('validFrom')}
                        />
                    </form>
                ) : (
                    <>
                        <TextWarning>{t('codeListDetail.modal.text.nothingSelected')}</TextWarning>
                        <ModalButtons onClose={() => setIsSetDatesDialogOpened(false)} />
                    </>
                )}
                {itemActionErrors.map((error, index) => (
                    <QueryFeedback
                        key={index}
                        error
                        loading={false}
                        errorProps={{
                            errorMessage: `${error.itemCode}: ${t([`errors.codeList.${error.message}`, 'feedback.mutationErrorTitle'])}`,
                        }}
                    />
                ))}
            </BaseModal>
            <BaseModal isOpen={isMarkForPublishDialogOpened} close={() => setIsMarkForPublishDialogOpened(false)}>
                {isLoadingItemAction && <LoadingIndicator label={t('feedback.saving')} />}
                <TextHeading size="M">{t(`codeListDetail.modal.title.markForPublish`)}</TextHeading>
                {Object.keys(rowSelection).length > 0 ? (
                    <>
                        <TextBody>{t('codeListDetail.modal.text.willBeChanged')}</TextBody>
                        {selectedItemsTable}
                        <ModalButtons
                            submitButtonLabel={t('codeListDetail.modal.button.confirm')}
                            onSubmit={onHandleMarkForPublish}
                            onClose={() => setIsMarkForPublishDialogOpened(false)}
                        />
                    </>
                ) : (
                    <>
                        <TextWarning>{t('codeListDetail.modal.text.nothingSelected')}</TextWarning>*
                        <ModalButtons onClose={() => setIsMarkForPublishDialogOpened(false)} />
                    </>
                )}
                {itemActionErrors.map((error, index) => (
                    <QueryFeedback
                        key={index}
                        error
                        loading={false}
                        errorProps={{
                            errorMessage: `${error.itemCode}: ${t([`errors.codeList.${error.message}`, 'feedback.mutationErrorTitle'])}`,
                        }}
                    />
                ))}
            </BaseModal>
            {isItemEditOpen && (
                <ItemFormModal
                    isOpen={isItemEditOpen}
                    close={handleCloseItemEditModal}
                    codeListCode={code}
                    item={editingCodeListItem}
                    attributeProfile={attributeProfile}
                    workingLanguage={workingLanguage}
                    defaultOrderValue={items?.codelistsItemCount ?? 1}
                />
            )}
        </QueryFeedback>
    )
}
