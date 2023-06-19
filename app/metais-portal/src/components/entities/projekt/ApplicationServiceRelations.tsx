import React from 'react'
import { useTranslation } from 'react-i18next'
import { TextLinkExternal } from '@isdd/idsk-ui-kit/typography/TextLinkExternal'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

import { RelationCard } from './cards/RelationCard'
import { CardColumnList } from './cards/CardColumnList'
import { ListActions } from './lists/ListActions'
import styles from './applicationServiceRelations.module.scss'

import { useReadCiNeighboursWithAllRelsUsingGET } from '@/api'

interface ApplicationServiceRelationsProps {
    entityId: string
    ciType: string
}

export const ApplicationServiceRelations: React.FC<ApplicationServiceRelationsProps> = ({ entityId, ciType }) => {
    const { isLoading, isError, data } = useReadCiNeighboursWithAllRelsUsingGET(entityId, { ciTypes: [ciType] })
    const { t } = useTranslation()
    return (
        <>
            <ListActions>
                <Button
                    className={styles.buttonWithoutMarginBottom}
                    label={t('applicationServiceRelations.buttonAddNewRelation')}
                    variant="secondary"
                />
                <Button
                    className={styles.buttonWithoutMarginBottom}
                    label={t('applicationServiceRelations.buttonAddNewRelationCard')}
                    variant="secondary"
                />
            </ListActions>
            <CardColumnList>
                {data?.ciWithRels?.map((rel, index) => (
                    <RelationCard
                        key={index}
                        status={'Vytvorené'}
                        codeMetaIS={'as_97125'}
                        label={<TextLinkExternal title={'ISVS Matka'} href={'#'} textLink={'ISVS Matka'} />}
                        name={'Administračné služby API'}
                        admin={'Publikovanie informácií na webovom sídle'}
                        relations={
                            <TextLinkExternal
                                title={'ISVS modul patrí pod materský ISVS : Vytvorené'}
                                href={'#'}
                                textLink={'ISVS modul patrí pod materský ISVS : Vytvorené'}
                            />
                        }
                    />
                ))}
            </CardColumnList>
        </>
    )
}
