import { CheckBox, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi, useStoreConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useEffect, useState } from 'react'

import styles from './commitment.module.scss'

type Props = {
    ciItemData: ConfigurationItemUi | undefined
    isOwner: boolean
    isCiItemInvalidated: boolean
}

export const CommitmentToComplyingWithGoals: React.FC<Props> = ({ ciItemData, isOwner, isCiItemInvalidated }) => {
    const {
        state: { user },
    } = useAuth()

    const [checked, setChecked] = useState<boolean>(false)

    const hasCiData = !!ciItemData?.uuid
    const isLoggedIn = !!user?.uuid

    useEffect(() => {
        setChecked(ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_KRIS_Zavazok_ciele_principy_stav])
    }, [ciItemData?.attributes])

    const storeCiItem = useStoreConfigurationItem()

    const handleCheckboxChange = (boolValue: boolean) => {
        setChecked(boolValue)

        const formattedAttForUpdate = Object.keys(ciItemData?.attributes ?? {}).map((key) => ({ name: key, value: ciItemData?.attributes?.[key] }))

        storeCiItem.mutateAsync({
            data: {
                type: ciItemData?.type,
                uuid: ciItemData?.uuid,
                attributes: [...formattedAttForUpdate, { name: ATTRIBUTE_NAME.Profil_KRIS_Zavazok_ciele_principy_stav, value: boolValue }],
            },
        })
    }

    return (
        <div className={styles.marginBottom}>
            <TextHeading size="S">{'Záväzok dodržiavania cieľov a princípov Národnej koncepcie informatizácie verejnej správy'}</TextHeading>
            <CheckBox
                disabled={!hasCiData || !isLoggedIn || !isOwner || isCiItemInvalidated}
                id="commitment"
                label="Týmto prehlasujeme, že pri budovaní a rozvoji ISVS budeme napĺňať nami definované ciele, podciele a dodržiavať princípy Národnej koncepcie informatizácie verejnej správy."
                name="commitment"
                onChange={(e) => handleCheckboxChange(e.target.checked)}
                checked={checked}
            />
        </div>
    )
}
