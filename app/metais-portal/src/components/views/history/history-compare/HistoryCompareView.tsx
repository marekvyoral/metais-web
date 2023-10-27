import { Stepper } from '@isdd/idsk-ui-kit/src/stepper/Stepper'
import { ISection, IStepLabel } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { ConfigurationItemUiAttributes, EnumType, HistoryVersionUiConfigurationItemUi } from '@isdd/metais-common/api'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { CheckBox } from '@isdd/idsk-ui-kit/index'
import { CiType, AttributeConstraintEnumAllOf, Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { HistoryCompareItemView } from './HistoryCompareItemView'

export interface AttributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType | undefined
}
export interface IHistoryCompareViewProps {
    ciTypeData: CiType | undefined
    dataFirst: HistoryVersionUiConfigurationItemUi | undefined
    dataSec: HistoryVersionUiConfigurationItemUi | undefined
    attributesData?: AttributesData
    isSimple?: boolean
}

enum AttributeType {
    STRING = 'STRING',
    BOOLEAN = 'BOOLEAN',
    STRING_PAIR = 'STRING_PAIR',
    DATE = 'DATE',
    ENUM = 'enum',
}

export const HistoryCompareView: React.FC<IHistoryCompareViewProps> = ({ ciTypeData, dataFirst, dataSec, attributesData, isSimple }) => {
    const { t, i18n } = useTranslation()
    const [showOnlyChanges, setShowOnlyChanges] = useState<boolean>(false)
    const languageEn = 'en'
    const attProfiles = ciTypeData?.attributeProfiles?.map((profile) => profile) ?? []

    const getEnumValue = (enumAttribute: AttributeConstraintEnumAllOf, value: string): string => {
        if (!enumAttribute) {
            return value ?? ''
        }

        const numValue = attributesData?.constraintsData.find((i) => i?.code === enumAttribute.enumCode)?.enumItems?.find((i) => i?.code === value)
        if (i18n.language === languageEn) {
            return numValue?.engValue ?? ''
        }

        return numValue?.value ?? value
    }

    const getAttributeValue = (attribute: Attribute, data?: HistoryVersionUiConfigurationItemUi): string => {
        if (!attribute.technicalName) return ''
        const item = data?.item?.attributes?.find((i: ConfigurationItemUiAttributes) => i.name === attribute.technicalName)
        if (item) {
            if (attribute.array) {
                return item?.value?.length
                    ? item?.value.map(
                          (i: string) =>
                              getEnumValue(attribute.constraints?.find((o) => o.type === AttributeType.ENUM) as AttributeConstraintEnumAllOf, i) +
                              ', ',
                      )
                    : ''
            }
            if (attribute.type === AttributeType.DATE) {
                return item?.value && new Date(item?.value).toLocaleString(i18n.language)
            }
            if (attribute.type === AttributeType.BOOLEAN) {
                return item?.value ? t('radioButton.yes') : t('radioButton.no')
            }
            if (attribute.type === AttributeType.STRING_PAIR) {
                return item?.value?.length ? item?.value?.split('|')[0] ?? '' : ''
            }

            return item?.value && attribute.constraints?.length && attribute.constraints?.find((i) => i.type === AttributeType.ENUM)
                ? getEnumValue(attribute.constraints?.find((i) => i.type === AttributeType.ENUM) as AttributeConstraintEnumAllOf, item?.value)
                : item?.value ?? ''
        }
        return item?.value ?? ''
    }

    const haveDiff = (attributes: Attribute[]): boolean => {
        let diff = false
        attributes.forEach((attribute) => {
            const itemFirst = dataFirst?.item?.attributes?.find((i: ConfigurationItemUiAttributes) => i.name === attribute.technicalName)?.value
            const itemSec = dataSec?.item?.attributes?.find((i: ConfigurationItemUiAttributes) => i.name === attribute.technicalName)?.value

            if (itemFirst !== itemSec) {
                if (Array.isArray(itemFirst)) {
                    if (itemFirst.length !== itemSec?.length) {
                        diff = true
                        return
                    }
                    itemFirst.forEach((item, index) => {
                        if (item !== itemSec?.[index]) {
                            diff = true
                            return
                        }
                    })
                    return
                }
                diff = true
                return
            }
        })
        return diff
    }

    let firstIsOpen = false
    const setOpenProfile = () => {
        if (!firstIsOpen && !isSimple && haveDiff(ciTypeData?.attributes || [])) {
            firstIsOpen = true
            return true
        }
        return false
    }

    const sections: ISection[] =
        [
            {
                title: t('ciInformationAccordion.basicInformation'),
                change: !isSimple && haveDiff(ciTypeData?.attributes || []),
                isOpen: setOpenProfile(),
                hide: showOnlyChanges && !isSimple && !haveDiff(ciTypeData?.attributes || []),
                stepLabel: { label: '1', variant: 'circle' },
                content: (
                    <DefinitionList>
                        <HistoryCompareItemView
                            key={'attribute.technicalName'}
                            label={''}
                            tooltip={''}
                            isSimple={isSimple}
                            valueFirst={`${t('history.ACTIONS.' + dataFirst?.actions ?? '')}:  ${
                                dataFirst?.actionTime && new Date(dataFirst?.actionTime).toLocaleString(i18n.language)
                            }`}
                            valueSec={`${t('history.ACTIONS.' + dataSec?.actions ?? '')}:  ${
                                dataSec?.actionTime && new Date(dataSec?.actionTime).toLocaleString(i18n.language)
                            }`}
                            withoutCompare
                        />
                        {ciTypeData?.attributes
                            ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                            .map((attribute) => {
                                return (
                                    <HistoryCompareItemView
                                        key={attribute.technicalName}
                                        label={attribute.name || ''}
                                        tooltip={attribute.description || ''}
                                        isSimple={isSimple}
                                        showOnlyChanges={showOnlyChanges}
                                        valueFirst={getAttributeValue(attribute, dataFirst)}
                                        valueSec={getAttributeValue(attribute, dataSec)}
                                    />
                                )
                            })}
                    </DefinitionList>
                ),
            },
            ...attProfiles.map((profile, index) => {
                return {
                    title: profile.description ?? '',
                    change: !isSimple && haveDiff(profile.attributes || []),
                    isOpen: setOpenProfile(),
                    hide: showOnlyChanges && !isSimple && !haveDiff(profile.attributes || []),
                    stepLabel: { label: (index + 2).toString(), variant: 'circle' } as IStepLabel,
                    last: attProfiles.length === index + 1 ? true : false,
                    content: (
                        <DefinitionList>
                            {profile.attributes &&
                                profile.attributes.map((attribute) => {
                                    return (
                                        <HistoryCompareItemView
                                            key={attribute.technicalName}
                                            label={attribute.name || ''}
                                            tooltip={attribute.description || ''}
                                            isSimple={isSimple}
                                            showOnlyChanges={showOnlyChanges}
                                            valueFirst={getAttributeValue(attribute, dataFirst)}
                                            valueSec={getAttributeValue(attribute, dataSec)}
                                        />
                                    )
                                })}
                        </DefinitionList>
                    ),
                }
            }),
        ] ?? []

    return (
        <>
            {!isSimple && (
                <CheckBox
                    label={t('historyTab.hideCheckButtonLabel')}
                    name={'hideCheckButtonLabel'}
                    id={'hideCheckButtonLabel'}
                    onChange={() => setShowOnlyChanges(!showOnlyChanges)}
                />
            )}
            <Stepper subtitleTitle="" stepperList={sections} />
        </>
    )
}
