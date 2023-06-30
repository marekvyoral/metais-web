import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { InformationGridRow } from '@isdd/metais-common/info-grid-row/InformationGridRow'

import styles from './basicInformationSection.module.scss'

import { pairEnumsToEnumValues } from '@/componentHelpers'
import { CiType, ConfigurationItemUi, EnumType } from '@/api'

interface ProjectInformationData {
    data: {
        ciItemData: ConfigurationItemUi | undefined
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
    }
}

export const ProjectInformationAccordion: React.FC<ProjectInformationData> = ({ data: { ciItemData, ciTypeData, constraintsData } }) => {
    const { t } = useTranslation()
    return (
        <>
            <AccordionContainer
                sections={[
                    {
                        title: t('projectInformationAccordion.basicInformation'),
                        content: (
                            <div className={styles.attributeGridRowBox}>
                                {ciTypeData?.attributes?.map((attribute) => {
                                    const withDescription = true
                                    return (
                                        <InformationGridRow
                                            key={attribute?.technicalName}
                                            label={attribute.name ?? ''}
                                            value={pairEnumsToEnumValues(attribute, ciItemData, constraintsData, t, withDescription)}
                                        />
                                    )
                                })}
                            </div>
                        ),
                    },
                ]}
            />
            {ciTypeData?.attributeProfiles?.map((attributesProfile) => {
                return (
                    <AccordionContainer
                        key={attributesProfile?.description}
                        sections={[
                            {
                                title: attributesProfile?.description ?? '',
                                content: (
                                    <div className={styles.attributeGridRowBox}>
                                        {attributesProfile?.attributes?.map((attribute) => {
                                            const withDescription = true
                                            const rowValue = pairEnumsToEnumValues(attribute, ciItemData, constraintsData, t, withDescription)
                                            return (
                                                !attribute?.invisible && (
                                                    <InformationGridRow
                                                        key={attribute?.technicalName}
                                                        label={attribute.name ?? ''}
                                                        value={rowValue}
                                                    />
                                                )
                                            )
                                        })}
                                    </div>
                                ),
                            },
                        ]}
                    />
                )
            })}
        </>
    )
}
