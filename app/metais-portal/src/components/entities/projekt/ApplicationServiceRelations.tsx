import React from 'react'
import { useTranslation } from 'react-i18next'

import { RelationCard } from './cards/RelationCard'
import { CardColumnList } from './cards/CardColumnList'
import { ListActions } from './lists/ListActions'
import styles from './applicationServiceRelations.module.scss'

import { TextLinkExternal } from '@/components/typography/TextLinkExternal'
import { Button } from '@/components/button/Button'

export const ApplicationServiceRelations: React.FC = () => {
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
                <RelationCard
                    status={'Zneplatnené'}
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
                <RelationCard
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
            </CardColumnList>
        </>
    )
}
