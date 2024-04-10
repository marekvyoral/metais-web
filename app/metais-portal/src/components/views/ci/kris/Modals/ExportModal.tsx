import { BaseModal, Button, ButtonGroupRow, GridCol, GridRow, RadioButton, RadioGroup, TextHeading } from '@isdd/idsk-ui-kit'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { useReadNeighboursConfigurationItemsHook } from '@isdd/metais-common/api/generated/cmdb-swagger'

import { EContainerType } from '@/components/containers/CiEvaluationContainer'

export interface IExportModalProps {
    open: boolean
    uuid: string
    type: EContainerType
    onClose: () => void
    onExport: (type: string, selectedPos: string[]) => void
}

export const ExportModal: React.FC<IExportModalProps> = ({ open, onClose, onExport, type, uuid }) => {
    const { t } = useTranslation()
    const [exportValue, setExportValue] = useState<string>('xml')
    const [pos, setPos] = useState<string[]>([])
    const [selectedPo, setSelectedPo] = useState<string[]>([])

    const getNeighbours = useReadNeighboursConfigurationItemsHook()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getNeighbours(uuid, { nodeType: 'PO', relationshipType: 'PO_predklada_KRIS', includeInvalidated: true })
            setPos(res?.toCiSet?.map((po) => po?.uuid ?? '') ?? [])
        }

        if (type === EContainerType.ISVS) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, uuid])

    const defaultFilterIsvs = useMemo(() => {
        return {
            type: ['ISVS'],
            metaAttributes: { liableEntityByHierarchy: true, liableEntity: [...pos], state: ['DRAFT'] },
        }
    }, [pos])

    return (
        <>
            <BaseModal isOpen={open} close={onClose}>
                <TextHeading size="L">{t('evaluation.exportBtn')}</TextHeading>
                {type === EContainerType.ISVS && (
                    <GridRow>
                        <GridCol setWidth="full">
                            <SelectPOForFilter
                                ciFilter={defaultFilterIsvs}
                                isMulti
                                ciType={EContainerType.ISVS}
                                label={t('modalKris.generatePdf.isvs')}
                                name="isvs"
                                onChange={(val) => {
                                    setSelectedPo(val?.map((item) => item?.uuid ?? '') ?? [])
                                }}
                                valuesAsUuids={[]}
                            />
                        </GridCol>
                    </GridRow>
                )}
                <GridRow>
                    <GridCol setWidth="full">
                        <RadioGroup label={t('evaluation.exportKrisLabel')} small inline>
                            <RadioButton
                                id={'xml'}
                                value={'RadioButton'}
                                defaultChecked
                                label={'XML'}
                                name={'RadioButton'}
                                onChange={() => setExportValue('xml')}
                            />
                            <RadioButton id={'csv'} value={'RadioButton'} label={'CSV'} name={'RadioButton'} onChange={() => setExportValue('csv')} />
                            <RadioButton
                                id={'xlsx'}
                                value={'RadioButton'}
                                label={'XLSX'}
                                name={'RadioButton'}
                                onChange={() => setExportValue('xlsx')}
                            />
                        </RadioGroup>
                    </GridCol>
                </GridRow>
                <ButtonGroupRow>
                    <Button label={t('evaluation.exportBtn')} onClick={() => onExport(exportValue, selectedPo)} type="submit" />
                    <Button
                        variant="secondary"
                        label={t('evaluation.cancelBtn')}
                        onClick={() => {
                            onClose()
                        }}
                    />
                </ButtonGroupRow>
            </BaseModal>
        </>
    )
}
