import { ButtonLink, ButtonPopup } from '@isdd/idsk-ui-kit'
import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'
import { ENTITY_AS, ENTITY_INFRA_SLUZBA, ENTITY_ISVS, ENTITY_KRIS, ENTITY_KS, ENTITY_PROJECT, ENTITY_TRAINING } from '@isdd/metais-common/constants'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

type NewItemPopupList = {
    title: string
    href: string
}

export const NewItemButtonPopup = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const newItemPopupListConfig: NewItemPopupList[] = [
        {
            title: t(`ciType.${ENTITY_AS}`),
            href: `/ci/${ENTITY_AS}/create`,
        },
        {
            title: t(`ciType.${ENTITY_KS}`),
            href: `/ci/${ENTITY_KS}/create`,
        },
        {
            title: t(`ciType.${ENTITY_ISVS}`),
            href: `/ci/${ENTITY_ISVS}/create`,
        },
        {
            title: t(`ciType.${ENTITY_PROJECT}`),
            href: `/ci/${ENTITY_PROJECT}/create`,
        },
        {
            title: t(`ciType.${ENTITY_INFRA_SLUZBA}`),
            href: `/ci/${ENTITY_INFRA_SLUZBA}/create`,
        },
        {
            title: t(`ciType.${ENTITY_KRIS}`),
            href: `/ci/${ENTITY_KRIS}/create`,
        },
        {
            title: t(`ciType.${ENTITY_TRAINING}`),
            href: `/ci/${ENTITY_TRAINING}/create`,
        },
        {
            title: t('codeListList.requestTitle'),
            href: RouterRoutes.DATA_OBJECT_REQUESTS_CREATE,
        },
    ]

    return (
        <ButtonPopup
            buttonClassName={classnames('idsk-button idsk-button--secondary', styles.noWrap)}
            buttonLabel={`+ ${t('navbar.newItem')}`}
            buttonAriaLabel={t('navbar.newItem')}
            popupPosition="right"
            popupContent={(closePopup) => {
                return (
                    <div className={styles.popupList}>
                        {newItemPopupListConfig.map((item, index) => {
                            return (
                                <ButtonLink
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        navigate(item.href)
                                        closePopup()
                                    }}
                                    label={item.title}
                                />
                            )
                        })}
                    </div>
                )
            }}
        />
    )
}
