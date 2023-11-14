import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import React, { useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { OptionProps } from 'react-select'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { ApiReferenceRegisterItem, ApiReferenceRegisterItemSourceReference } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { CloseIcon } from '@isdd/metais-common/assets/images'
import { Button } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import styles from './refRegisterItemViewItems.module.scss'

import { RefRegisterItemItemsFieldNames } from '@/types/filters'

interface iRefRegisterItemViewItemLazySelects {
    isChangeMode: boolean
    tooltip?: string
    value: ApiReferenceRegisterItemSourceReference[] | undefined
    name: string
    setValue: UseFormSetValue<ApiReferenceRegisterItem>
    label: string
    formValue: ApiReferenceRegisterItemSourceReference[] | undefined
}

const selectLazyLoadingCiOption = (props: OptionProps<ConfigurationItemUi>) => {
    const attributes = props.data.attributes
    return (
        <Option {...props}>
            <div>
                <span>{attributes?.Gen_Profil_nazov}</span>
            </div>
            <span>
                <small>
                    {(attributes?.EA_Profil_PO_ulica ?? '') +
                        ' ' +
                        (attributes?.EA_Profil_PO_cislo ?? '') +
                        ', ' +
                        (attributes?.EA_Profil_PO_psc ?? '') +
                        ' ' +
                        (attributes?.EA_Profil_PO_obec ?? '')}
                </small>
            </span>
        </Option>
    )
}

export const RefRegisterItemViewItemLazySelects = ({
    name,
    label,
    value,
    tooltip,
    isChangeMode,
    setValue,
    formValue,
}: iRefRegisterItemViewItemLazySelects) => {
    const { t } = useTranslation()
    const [selectedISVSCi, setSelectedISVSCi] = useState<ConfigurationItemUi>()
    const [selectedPOCi, setSelectedPOCi] = useState<ConfigurationItemUi>()

    const removeElementFromFormValues = (row: ApiReferenceRegisterItemSourceReference) => {
        const filteredValues =
            formValue?.filter((val) => val?.sourceIsvsUuid !== row?.sourceIsvsUuid && val?.sourceRegistratorUuid !== row?.sourceRegistratorUuid) ?? []
        setValue(RefRegisterItemItemsFieldNames.sourceReferenceHolders, filteredValues)
    }

    const getSourceElementHolders = () => {
        return value?.map((holder) => {
            return (
                <div key={holder?.sourceIsvsMetaisCode}>
                    {holder?.sourceIsvsMetaisCode + ' ' + holder?.sourceIsvsName + ' (' + holder?.sourceRegistratorName + ')'}
                </div>
            )
        })
    }

    if (isChangeMode)
        return (
            <div className={styles.inputPadding}>
                <CiLazySelect
                    ciType={'ISVS'}
                    label={label}
                    selectedCi={selectedISVSCi}
                    setSelectedCi={setSelectedISVSCi}
                    metaAttributes={{ state: ['DRAFT', 'APPROVED_BY_OWNER', 'AWAITING_APPROVAL'] }}
                />
                <CiLazySelect
                    ciType={'PO'}
                    label={t('refRegisters.detail.items.selectedPOCi')}
                    selectedCi={selectedPOCi}
                    setSelectedCi={setSelectedPOCi}
                    metaAttributes={{ state: ['DRAFT'] }}
                    option={selectLazyLoadingCiOption}
                />
                <Button
                    label={t('refRegisters.detail.items.addNewItem')}
                    disabled={!selectedISVSCi || !selectedPOCi}
                    onClick={() => {
                        setValue(RefRegisterItemItemsFieldNames.sourceReferenceHolders, [
                            ...(formValue ?? []),
                            {
                                sourceIsvsMetaisCode: selectedISVSCi?.attributes?.Gen_Profil_kod_metais,
                                sourceIsvsName: selectedISVSCi?.attributes?.Gen_Profil_nazov,
                                sourceIsvsUuid: selectedISVSCi?.uuid,
                                sourceRegistratorName: selectedPOCi?.attributes?.Gen_Profil_nazov,
                                sourceRegistratorUuid: selectedPOCi?.uuid,
                            },
                        ])
                        setSelectedISVSCi(undefined)
                        setSelectedPOCi(undefined)
                    }}
                />
                {formValue?.map((val) => (
                    <>
                        <div>
                            <img
                                src={CloseIcon}
                                alt="navigation-close"
                                className={styles.closeButton}
                                onClick={() => {
                                    removeElementFromFormValues(val)
                                }}
                            />
                            <span>{[val?.sourceIsvsMetaisCode, val?.sourceIsvsName, `(${val?.sourceRegistratorName})`]?.join(' ')}</span>
                        </div>
                    </>
                ))}
            </div>
        )
    return <InformationGridRow key={name} label={label} value={getSourceElementHolders()} tooltip={tooltip} />
}
