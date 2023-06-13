import React from 'react'

import styles from './basicInformationSection.module.scss'
import { InformationGridRow } from './InformationGridRow'

import { AccordionContainer } from '@/components/Accordion'
import { ICiContainerView } from '@/components/containers/CiContainer'

export const ProjectInformationAccordion: React.FC<ICiContainerView> = ({ data: { ciItemData, ciTypeData } }) => {
    const getItemAttributeValueByTechnicalName = (name: string) => {
        return ciItemData?.attributes?.[name]
    }

    const mapCiTypesAttributes = () => {
        return ciTypeData?.attributes?.map((attribute) => (
            <InformationGridRow
                key={attribute?.technicalName}
                label={attribute.name ?? ''}
                value={getItemAttributeValueByTechnicalName(attribute?.technicalName ?? '')}
            />
        ))
    }

    return (
        <>
            <AccordionContainer
                sections={[
                    {
                        title: 'Základné informácie',

                        content: (
                            <div className={styles.attributeGridRowBox}>{mapCiTypesAttributes()}</div>
                            // <BasicInformationSection
                            //     codeMetaIS={ciItemData?.attributes?.Gen_Profil_kod_metais}
                            //     admin={
                            //         <TextLinkExternal
                            //             title={''} //participantAttributes?.Gen_Profil_nazov ?? ''}
                            //             href={'#'}
                            //             textLink={''} //participantAttributes?.Gen_Profil_nazov ?? ''}
                            //         />
                            //     }
                            //     informationSystemName={ciItemData?.attributes?.Gen_Profil_nazov}
                            //     referenceIdentifier={
                            //         <TextLinkExternal
                            //             title={ciItemData?.attributes?.Gen_Profil_ref_id}
                            //             href={ciItemData?.attributes?.Gen_Profil_ref_id}
                            //             textLink={ciItemData?.attributes?.Gen_Profil_ref_id}
                            //         />
                            //     }
                            //     note={ciItemData?.attributes?.Gen_Profil_poznamka}
                            //     description={ciItemData?.attributes?.Gen_Profil_popis}
                            //     ciItemsData={ciItemData}
                            //     ciTypesData={ciTypeData}
                            // />
                        ),
                    },
                ]}
            />
        </>
    )
}
