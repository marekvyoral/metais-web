import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

import { useLogin } from '@/hooks/useLogin'

export const Login = () => {
    const { t } = useTranslation()
    const { mutateAuthorize } = useLogin()
    return (
        <div>
            <Button label={t('form.login.submit')} onClick={() => mutateAuthorize()} />
        </div>
    )
}
