import React, { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { SimpleSelect } from '@isdd/idsk-ui-kit/simple-select/SimpleSelect'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import classnames from 'classnames'
import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'
import { IColumnSectionType, TableSelectColumns } from '@isdd/idsk-ui-kit/table-select-columns/TableSelectColumns'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { useNavigate } from 'react-router-dom'

import { ExportItemsOrRelations } from '../export-items-or-relations/ExportItemsOrRelations'

import styles from './actionsOverTable.module.scss'

import { Attribute, AttributeProfile, BASE_PAGE_SIZE } from '@/api'
import {
    useExportCsvUsingGETHook,
    useExportXmlUsingGETHook,
    useExportExcelUsingGETHook,
    useExportRelCsvUsingGETHook,
    useExportRelExcelUsingGETHook,
    useExportRelXmlUsingGETHook,
    useExportXmlUsingGET,
    useExportCsvUsingGET,
    useExportExcelUsingGET,
    useExportRelXmlUsingGET,
    useExportRelCsvUsingGET,
    useExportRelExcelUsingGET,
} from '@/api/generated/impexp-cmdb-swagger'
import { ChangeIcon, CheckInACircleIcon, CrossInACircleIcon, ExportIcon, ImportIcon, PlusIcon } from '@/assets/images'
import { IColumn } from '@/hooks/useColumnList'

interface IActionsOverTableProps {
    pagingOptions?: { value: string; label: string; disabled?: boolean }[]
    handleFilterChange?: (filter: IFilter) => void
    ciType: string
    entityName: string
    storeUserSelectedColumns: (columnSelection: {
        attributes: { name: string; order: number }[]
        metaAttributes: { name: string; order: number }[]
    }) => void
    resetUserSelectedColumns: () => Promise<void>
    attributeProfiles: AttributeProfile[]
    columnListData: IColumn | undefined
    attributes: Attribute[]
}

const defaultPagingOptions = [
    { value: '100', label: '100' },
    { value: '100000', label: '1000000' },
]

export const ActionsOverTable: React.FC<IActionsOverTableProps> = ({
    pagingOptions,
    ciType,
    entityName,
    handleFilterChange,
    resetUserSelectedColumns,
    storeUserSelectedColumns,
    attributeProfiles,
    columnListData,
    attributes,
}) => {
    const [modalOpen, setModalOpen] = useState(false)

    const { t } = useTranslation()
    const pagingSelectId = useId()
    const navigate = useNavigate()

    const openModal = () => {
        setModalOpen(true)
    }
    const onClose = () => {
        setModalOpen(false)
    }

    const exportCsv = useExportCsvUsingGET
    const exportXml = useExportXmlUsingGET
    const exportExcel = useExportExcelUsingGET

    const exportRelXml = useExportRelXmlUsingGET
    const exportRelCsv = useExportRelCsvUsingGET
    const exportRelExcel = useExportRelExcelUsingGET

    const exportData = (exportFunction: any) => {
        const { data } = exportFunction({
            filter: {
                type: [ciType],
                // metaAttributes: {
                //     state: ['DRAFT'],
                // },
            },
        })
        console.log(data)
    }
    const onExportStart = (exportValue: string, extension: string) => {
        // eslint-disable-next-line no-console
        console.log(exportValue, extension)

        if (exportValue === 'items') {
            if (extension === 'XML') {
                exportData(exportXml)
                return
            }
            if (extension === 'CSV') {
                exportCsv({})
                return
            }
            if (extension === 'XLSX') {
                exportExcel({})
                return
            }
        }
        if (exportValue === 'relations') {
            if (extension === 'XML') {
                exportRelXml({})
                return
            }
            if (extension === 'CSV') {
                exportRelCsv({})
                return
            }
            if (extension === 'XLSX') {
                exportRelExcel({})
                return
            }
        }
    }

    const attributeProfilesColumnSections: IColumnSectionType[] = attributeProfiles.map((attributeProfile) => ({
        name: attributeProfile.name || '',
        attributes:
            attributeProfile.attributes
                ?.filter((attribute) => attribute.invisible === false)
                .map((attribute) => ({
                    name: attribute.name || '',
                    technicalName: attribute.technicalName || '',
                })) || [],
    }))

    const attributesColumnSection: IColumnSectionType = {
        name: entityName || '',
        attributes: attributes
            .filter((attribute) => attribute.invisible === false)
            .map((attribute) => ({
                name: attribute.name || '',
                technicalName: attribute.technicalName || '',
            })),
    }

    const metaAttributesColumnSection: IColumnSectionType = {
        name: 'Metainformácie položky',
        attributes: [
            {
                name: t('actionOverTable.metaColumnName.state'),
                technicalName: 'state',
            },
            {
                name: t('actionOverTable.metaColumnName.group'),
                technicalName: 'group',
            },
            {
                name: t('actionOverTable.metaColumnName.createdAt'),
                technicalName: 'createdAt',
            },
            {
                name: t('actionOverTable.metaColumnName.lastModifiedAt'),
                technicalName: 'lastModifiedAt',
            },
        ],
    }

    return (
        <div className={styles.buttonContainer}>
            <div className={styles.buttonGroup}>
                <div className={classnames(styles.mobileOrder3, styles.buttonPopup)}>
                    <ButtonPopup
                        buttonLabel={`${t('actionOverTable.actions')} (2)`}
                        buttonClassname={styles.withoutMarginBottom}
                        popupContent={() => {
                            return (
                                <div className={styles.popupActions}>
                                    <ButtonLink
                                        className={styles.buttonLinkWithIcon}
                                        icon={<img className={styles.iconInPopup} src={CrossInACircleIcon} />}
                                        label={t('actionOverTable.invalidateItems')}
                                    />
                                    <ButtonLink
                                        className={styles.buttonLinkWithIcon}
                                        icon={<img className={styles.iconInPopup} src={CheckInACircleIcon} />}
                                        label={t('actionOverTable.validateItems')}
                                    />
                                    <ButtonLink
                                        className={styles.buttonLinkWithIcon}
                                        icon={<img className={styles.iconInPopup} src={ChangeIcon} />}
                                        label={t('actionOverTable.changeOwner')}
                                    />
                                </div>
                            )
                        }}
                    />
                </div>
                <div className={classnames(styles.buttonImportExport, styles.mobileOrder2)}>
                    <Button
                        className={classnames(styles.withoutMarginBottom)}
                        label={
                            <div className={styles.buttonWithIcon}>
                                <img className={styles.iconExportImport} src={ImportIcon} />
                                <TextBody className={styles.withoutMarginBottom}>{t('actionOverTable.import')}</TextBody>
                            </div>
                        }
                        variant="secondary"
                    />
                    <Button
                        className={classnames(styles.withoutMarginBottom)}
                        onClick={openModal}
                        label={
                            <div className={styles.buttonWithIcon}>
                                <img className={styles.iconExportImport} src={ExportIcon} />
                                <TextBody className={styles.withoutMarginBottom}>{t('actionOverTable.export')}</TextBody>
                            </div>
                        }
                        variant="secondary"
                    />
                    <ExportItemsOrRelations isOpen={modalOpen} close={onClose} onExportStart={onExportStart} />
                </div>

                <Button
                    className={classnames(styles.withoutMarginBottom, styles.mobileOrder1)}
                    onClick={() => {
                        navigate(`/ci/${ciType}/create`)
                    }}
                    label={
                        <div className={styles.buttonWithIcon}>
                            <img className={styles.iconAddItems} src={PlusIcon} />
                            {t('actionOverTable.addISVSitem')}
                        </div>
                    }
                />
            </div>
            <div className={styles.buttonGroupSelect}>
                <ButtonPopup
                    buttonLabel={t('actionOverTable.selectColumn')}
                    buttonClassname={styles.withoutMarginBottom}
                    popupContent={(closePopup) => {
                        return (
                            <TableSelectColumns
                                onClose={closePopup}
                                resetDefaultOrder={resetUserSelectedColumns}
                                showSelectedColumns={storeUserSelectedColumns}
                                attributeProfilesColumnSections={attributeProfilesColumnSections}
                                columnListData={columnListData}
                                attributesColumnSection={attributesColumnSection}
                                metaAttributesColumnSection={metaAttributesColumnSection}
                            />
                        )
                    }}
                />
                <SimpleSelect
                    className={styles.selectGroup}
                    label={t('actionOverTable.view')}
                    id={pagingSelectId}
                    options={pagingOptions ?? defaultPagingOptions}
                    onChange={(event) => handleFilterChange?.({ pageSize: parseInt(event?.target?.value) ?? BASE_PAGE_SIZE })}
                />
            </div>
        </div>
    )
}
