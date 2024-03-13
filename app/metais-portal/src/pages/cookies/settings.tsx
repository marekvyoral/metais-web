import { BreadCrumbs, Button, CheckBox, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldValues, useForm } from 'react-hook-form'
import Cookies from 'universal-cookie'
import { COOKIES_TYPES } from '@isdd/metais-common/api/constants'
import { MutationFeedback } from '@isdd/metais-common/index'
import { setCookiesConsent } from '@isdd/metais-common/components/cookies-popup/CookiesPopup'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const CookiesSettings = () => {
    const { t } = useTranslation()
    const cookies = new Cookies()
    const [saved, setIsSaved] = useState(false)
    const { register, handleSubmit } = useForm({
        defaultValues: {
            analytically: cookies.get(COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT),
            preferential: cookies.get(COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT),
        },
    })

    const onSubmit = (formData: FieldValues) => {
        setCookiesConsent(
            cookies,
            {
                [COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT]: true,
                [COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT]: formData.analytically,
                [COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT]: formData.preferential,
            },
            () => setIsSaved(true),
        )
    }

    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <MutationFeedback success={saved} onMessageClose={() => setIsSaved(false)} />
                <TextHeading size="XL">{t('cookies.settings.heading')}</TextHeading>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CheckBox label={t('cookies.settings.necessarily')} id="necessarily" name="necessarily" value="true" checked disabled />
                    <TextBody size="L">{t('cookies.settings.necessarilyDescription')}</TextBody>
                    <CheckBox {...register('analytically')} label={t('cookies.settings.analytically')} id="analytically" name="analytically" />
                    <TextBody size="L">{t('cookies.settings.analyticallyDescription')}</TextBody>
                    <CheckBox {...register('preferential')} label={t('cookies.settings.preferential')} id="preferential" name="preferential" />
                    <TextBody size="L">{t('cookies.settings.preferentialDescription')}</TextBody>
                    <Button label={t('cookies.settings.save')} type="submit" />
                </form>
            </MainContentWrapper>
        </>
    )
}

export default CookiesSettings
