import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'

import styles from './basicInformationSection.module.scss'
import { InformationGridRow } from './InformationGridRow'

import { ICiContainerView } from '@/components/containers/CiContainer'
import { pairEnumsToEnumValues } from '@/componentHelpers'

export const ProjectInformationAccordion: React.FC<ICiContainerView> = ({ data: { ciItemData, ciTypeData, constraintsData } }) => {
    const { t } = useTranslation()
    return (
        <>
            <AccordionContainer
                sections={[
                    {
                        title: t('projectInformationAccordion.basicInformation'),
                        content: (
                            <div className={styles.attributeGridRowBox}>
                                {ciTypeData?.attributes?.map((attribute) => (
                                    <InformationGridRow
                                        key={attribute?.technicalName}
                                        label={attribute.name ?? ''}
                                        value={pairEnumsToEnumValues(attribute, ciItemData, constraintsData, t)}
                                    />
                                ))}
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
                                            const rowValue = pairEnumsToEnumValues(attribute, ciItemData, constraintsData, t)
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
