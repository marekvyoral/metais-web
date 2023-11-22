import React, { useEffect, useState } from 'react'
import { TextHeading, TextBody, Button } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'

import styles from './crash.module.scss'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type FallbackProps = {
    error: Error
}

export const CrashFallback: React.FC<FallbackProps> = ({ error }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const [errorLog, setErrorLog] = useState('')

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.error('APP CRASH: ', error)
        const errorMessage = `${error?.name}: ${error?.message}`
        const errorStack = JSON.stringify(error?.stack)
        const errorTime = new Date().toISOString()
        const errorUrl = `${window.location}`
        const errorUser = JSON.stringify(user)

        setErrorLog(`
**************
TIME
${errorTime}

**************
LOCATION
${errorUrl}

**************
ERROR
${errorMessage}
${errorStack}

**************
USER
${errorUser}
**************`)
    }, [error, user])

    const copyErrorToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(errorLog)
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to copy error log: ', err)
        }
    }

    return (
        <div className={styles.centered}>
            <TextHeading size="XL">{t('crash.heading')}</TextHeading>
            <TextBody size="L">{t('crash.description')}</TextBody>
            <div className={styles.buttonDiv}>
                <Button
                    label={t('crash.reload')}
                    onClick={() => {
                        window.location.replace('/')
                    }}
                />
                <Button variant="secondary" label={t('crash.copyError')} onClick={copyErrorToClipboard} />
            </div>
        </div>
    )
}
