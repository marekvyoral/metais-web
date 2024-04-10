import { CheckBox, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Stepper } from '@isdd/idsk-ui-kit/src/stepper/Stepper'
import { ISection, IStepLabel } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { ConfigurationItemUiAttributes, HistoryVersionUiConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute, AttributeConstraintEnumAllOf } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { HistoryCompareItemView } from './HistoryCompareItemView'
import { RelationCompareItemView } from './RelationCompareItemView'

import { IHistoryItemsCompareContainerView } from '@/components/containers/HistoryItemsCompareContainer'

enum AttributeType {
    STRING = 'STRING',
    BOOLEAN = 'BOOLEAN',
    STRING_PAIR = 'STRING_PAIR',
    DATE = 'DATE',
    ENUM = 'enum',
}

export const HistoryCompareView: React.FC<IHistoryItemsCompareContainerView> = ({
    ciTypeData,
    dataFirst,
    dataSec,
    constraintsData,
    dataRelationFirst,
    dataRelationSecond,
    isSimple,
}) => {
    const { t, i18n } = useTranslation()
    const [showOnlyChanges, setShowOnlyChanges] = useState<boolean>(false)
    const [sections, setSections] = useState<ISection[]>([])

    const languageEn = 'en'
    const attProfiles = useMemo(() => ciTypeData?.attributeProfiles?.map((profile) => profile) ?? [], [ciTypeData?.attributeProfiles])

    const heading = t('historyTab.comparingHistory', {
        itemName: dataFirst?.item?.attributes?.find((att: { name: string; value: string }) => att?.name == ATTRIBUTE_NAME.Gen_Profil_nazov)?.value,
    })
    document.title = `${heading} ${META_IS_TITLE}`

    const getEnumValue = useCallback(
        (enumAttribute: AttributeConstraintEnumAllOf, value: string): string => {
            if (!enumAttribute) {
                return value ?? ''
            }

            const numValue = constraintsData.find((i) => i?.code === enumAttribute.enumCode)?.enumItems?.find((i) => i?.code === value)
            if (i18n.language === languageEn) {
                return numValue?.engValue ?? ''
            }

            return numValue?.value ?? value
        },
        [constraintsData, i18n.language],
    )

    const getAttributeValue = useCallback(
        (attribute: Attribute, data?: HistoryVersionUiConfigurationItemUi): string => {
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
        },
        [getEnumValue, i18n.language, t],
    )

    const haveDiff = useCallback(
        (attributes: Attribute[]): boolean => {
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
        },
        [dataFirst?.item?.attributes, dataSec?.item?.attributes],
    )

    let firstIsOpen = false
    const setOpenProfile = () => {
        if (!firstIsOpen && !isSimple && haveDiff(ciTypeData?.attributes || [])) {
            firstIsOpen = true
            return true
        }
        return false
    }

    useEffect(() => {
        setSections(
            [
                {
                    title: t('ciInformationAccordion.basicInformation'),
                    change: !isSimple && haveDiff(ciTypeData?.attributes || []),
                    isOpen: setOpenProfile(),
                    hide: showOnlyChanges && !isSimple && !haveDiff(ciTypeData?.attributes || []),
                    stepLabel: { label: '1', variant: 'circle' },
                    id: 'attribute.technicalName',
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
                                valueSec={`${dataSec && t('history.ACTIONS.' + dataSec?.actions ?? '')}:  ${
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
                        id: profile.technicalName ?? '',
                        change: !isSimple && haveDiff(profile.attributes || []),
                        isOpen: setOpenProfile(),
                        hide: showOnlyChanges && !isSimple && !haveDiff(profile.attributes || []),
                        stepLabel: { label: (index + 2).toString(), variant: 'circle' } as IStepLabel,
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
                {
                    title: t('ciInformationAccordion.relations'),
                    id: 'ciInformationAccordion.relations',
                    change: !isSimple && haveDiff(ciTypeData?.attributes || []),
                    isOpen: setOpenProfile(),
                    hide: showOnlyChanges && !isSimple && !haveDiff(ciTypeData?.attributes || []),
                    stepLabel: { label: (attProfiles.length + 2).toString(), variant: 'circle' },
                    last: true,
                    content: (
                        <RelationCompareItemView
                            label={t('ciInformationAccordion.relations')}
                            tooltip={''}
                            dataRelationFirst={dataRelationFirst}
                            dataRelationSecond={dataRelationSecond}
                        />
                    ),
                },
            ] ?? [],
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        attProfiles,
        ciTypeData?.attributes,
        dataFirst,
        dataRelationFirst,
        dataRelationSecond,
        dataSec,
        getAttributeValue,
        haveDiff,
        i18n.language,
        isSimple,
        showOnlyChanges,
        t,
    ])

    const handleSectionOpen = (id: string) => {
        setSections((prev) => prev.map((item) => (item.id === id ? { ...item, isOpen: !item.isOpen } : item)))
    }

    const openOrCloseAllSections = () => {
        setSections((prev) => {
            const allOpen = prev.every((item) => item.isOpen)
            return prev.map((item) => ({ ...item, isOpen: !allOpen }))
        })
    }

    return (
        <>
            <TextHeading size="XL">{heading}</TextHeading>
            {!isSimple && (
                <CheckBox
                    label={t('historyTab.hideCheckButtonLabel')}
                    name={'hideCheckButtonLabel'}
                    id={'hideCheckButtonLabel'}
                    onChange={() => setShowOnlyChanges(!showOnlyChanges)}
                />
            )}
            <Stepper subtitleTitle="" stepperList={sections} handleSectionOpen={handleSectionOpen} openOrCloseAllSections={openOrCloseAllSections} />
        </>
    )
}
