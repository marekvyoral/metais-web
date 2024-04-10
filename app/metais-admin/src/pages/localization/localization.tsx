import { GetAllLocale, GetAllUserInterface } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { useTranslation } from 'react-i18next'
import { ActionsOverTable, BulkPopup, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { BreadCrumbs, Button, ButtonLink, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useEffect, useState } from 'react'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { ImportModal } from '@/components/views/localization/ImportModal'
import { UpdateLocalizationForm } from '@/components/views/localization/UpdateLocalizationForm'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import styles from '@/components/views/localization/local.module.scss'
import { LocalizationTable } from '@/components/views/localization/LocalizationTable'
import { DataRecord, LocalizationFilterMap, NameValueObj, getDataArr } from '@/componentHelpers/localization'
import { useGetAllLocales } from '@/hooks/useGetAllLocales'
import { LocalizationFilter } from '@/components/views/localization/LocalizationFilter'
import { DiffLocalizationModal } from '@/components/views/localization/DiffLocalizationModal'
import { useTransUpdate } from '@/hooks/useTransUpdate'

const LocalizationList = () => {
    const { t } = useTranslation()
    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()
    const defaultFilterValues: LocalizationFilterMap = { type: GetAllUserInterface.PORTAL, language: GetAllLocale.SK }
    const {
        data,
        secondData,
        isError,
        isLoading,
        handleFilterChange,
        userInterface,
        pagination,
        localeLanguage: [firstLanguage, secondLanguage],
        sort,
    } = useGetAllLocales({ defaultFilterValues })
    const { dataLength, pageNumber, pageSize } = pagination
    const {
        isError: isUpdateError,
        isLoading: isUpdateLoading,
        isMultipleSuccess,
        isSuccess,
        updateMultiple,
        updateForm,
    } = useTransUpdate(firstLanguage, userInterface)

    const dataArr: NameValueObj[] = getDataArr({
        firstData: data,
        secondData,
        secondLanguage,
        sortBy: sort?.[0]?.orderBy == 'en-value' ? 'EN' : 'SK',
    })

    const [rowSelection, setRowSelection] = useState<DataRecord>({})
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)
    const [isDiffModalOpen, setIsDiffModalOpen] = useState(false)

    const clearSelectedRows = () => {
        setRowSelection({})
    }

    //clear selected rows when anything but pagination changes in filter
    useEffect(() => {
        clearSelectedRows()
    }, [firstLanguage, secondLanguage, userInterface])

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('localization.heading'), href: AdminRouteNames.LOCALIZATION },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading || isUpdateLoading} error={isError || isUpdateError} withChildren>
                    <MutationFeedback
                        success={isActionSuccess.value || isMultipleSuccess || isSuccess}
                        successMessage={isActionSuccess?.additionalInfo?.['import'] ? t('localization.import.diffSuccess') : ''}
                    />

                    <TextHeading size="XL">{t('localization.heading')}</TextHeading>
                    <LocalizationFilter defaultFilterValues={defaultFilterValues} />
                    <ActionsOverTable
                        entityName=""
                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                        pagination={{ pageNumber, pageSize, dataLength }}
                        handleFilterChange={handleFilterChange}
                        hiddenButtons={{ SELECT_COLUMNS: true }}
                        importButton={
                            <Button
                                variant="secondary"
                                className={styles.noMargin}
                                label={t('localization.import')}
                                onClick={() => {
                                    setIsImportModalOpen(true)
                                    setIsActionSuccess({ value: false, path: AdminRouteNames.LOCALIZATION })
                                }}
                            />
                        }
                        selectedRowsCount={Object.keys(rowSelection).length}
                        bulkPopup={({ selectedRowsCount }) => (
                            <BulkPopup
                                checkedRowItems={selectedRowsCount}
                                items={(closePopup) => [
                                    <ButtonLink
                                        key="selection"
                                        className={styles.buttonPadding}
                                        onClick={() => {
                                            closePopup()
                                            setIsDiffModalOpen(true)
                                        }}
                                        label={t('localization.diff.selection')}
                                    />,
                                    <ButtonLink
                                        key={'updateMultiple'}
                                        label={t('localization.updateMultiple')}
                                        onClick={() => {
                                            closePopup()
                                            setIsUpdateFormOpen(true)
                                        }}
                                    />,
                                ]}
                            />
                        )}
                    />
                    <LocalizationTable
                        handleFilterChange={handleFilterChange}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        clearSelectedRows={clearSelectedRows}
                        pagination={pagination}
                        dataArr={dataArr}
                        secondLanguage={secondLanguage}
                        firstLanguage={firstLanguage}
                        sort={sort ?? []}
                        userInterface={userInterface}
                        updateForm={updateForm}
                        updateMultiple={updateMultiple}
                    />
                    <DiffLocalizationModal
                        isOpen={isDiffModalOpen}
                        close={() => setIsDiffModalOpen(false)}
                        rowSelection={rowSelection}
                        userInterface={userInterface}
                        filterLanguage={secondLanguage ? 'ALL' : firstLanguage}
                    />
                    <ImportModal close={() => setIsImportModalOpen(false)} isOpen={isImportModalOpen} />
                    {isUpdateFormOpen && (
                        //condition for having current default values without need of form reset
                        <UpdateLocalizationForm
                            defaultFormData={rowSelection}
                            firstLanguage={firstLanguage}
                            secondLanguage={secondLanguage}
                            userInterface={userInterface}
                            close={() => {
                                setIsUpdateFormOpen(false)
                                clearSelectedRows()
                            }}
                            isOpen
                        />
                    )}
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
export default LocalizationList
