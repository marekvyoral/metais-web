import { yupResolver } from '@hookform/resolvers/yup'
import { CheckBox, Input, TextHeading, TextLink } from '@isdd/idsk-ui-kit/index'
import { useRegisterUser } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { FilterMetaAttributesUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useStripAccentsHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { LOWER_CASE_NUMBER_DOT_REGEX, REGEX_TEL, SPACES_REGEX } from '@isdd/metais-common/constants'
import { MutationFeedback, QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { FooterRouteNames, RegistrationRoutes } from '@isdd/metais-common/navigation/routeNames'
import { TFunction } from 'i18next'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { boolean, mixed, object, string } from 'yup'

import styles from './registration.module.scss'

interface Props {
    isError: boolean
    isFetching: boolean
}

export enum InputNames {
    FIRST_NAME = 'identityFirstName',
    LAST_NAME = 'identityLastName',
    EMAIL = 'email',
    MOBILE = 'mobile',
    PO = 'po',
    LOGIN = 'identityLogin',
    DATA_PROCESSING_CONSENT = 'dataProcessingConsent',
    TERMS_OF_USE_CONSENT = 'termsOfUseConsent',
}

const getRegistrationSchema = (t: TFunction) => {
    const registrationFormSchema = object().shape({
        [InputNames.DATA_PROCESSING_CONSENT]: boolean().oneOf([true], t('registration.required.default')),
        [InputNames.TERMS_OF_USE_CONSENT]: boolean().oneOf([true], t('registration.required.default')),
        [InputNames.FIRST_NAME]: string().required(t('registration.required.firstName')),
        [InputNames.LAST_NAME]: string().required(t('registration.required.lastName')),
        [InputNames.EMAIL]: string().email(t('registration.format.email')).required(t('registration.required.email')),
        [InputNames.MOBILE]: string().matches(REGEX_TEL, t('registration.format.phone')).required(t('registration.required.phone')),
        [InputNames.PO]: mixed().required(t('registration.required.default')),
        [InputNames.LOGIN]: string()
            .test('no-spaces', t('registration.format.noSpaces'), (value) => !/\s/.test(value ?? ''))
            .matches(LOWER_CASE_NUMBER_DOT_REGEX, t('managementList.loginFormat'))
            .required(t('registration.required.default')),
    })

    return registrationFormSchema
}

export const RegistrationForm: React.FC<Props> = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const CHYBA_BE = 'CHYBA_BE'
    const [errorFromBE, setErrorFromBE] = useState<string>('')

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, isSubmitted, isSubmitting, isValidating },
        trigger,
    } = useForm({ resolver: yupResolver(getRegistrationSchema(t)) })

    const formValues = watch()
    const hasLastName = !!formValues[InputNames.LAST_NAME]
    const loginString = `${formValues[InputNames.FIRST_NAME] ?? ''}${hasLastName ? '.' + formValues[InputNames.LAST_NAME] : ''}`

    const stripAccents = useStripAccentsHook()
    const {
        mutate,
        isLoading: isRegisterLoading,
        isError: isRegisterError,
    } = useRegisterUser({
        mutation: {
            onSuccess(data) {
                if (data.resultCode === 1 && data.message) {
                    setErrorFromBE(data.message)
                } else if (data.resultCode == 0) {
                    navigate(RegistrationRoutes.REGISTRATION_SUCCESS)
                } else {
                    setErrorFromBE(CHYBA_BE)
                }
            },
        },
    })

    const metaAttributesForRegistrationCiSelect: FilterMetaAttributesUi = {
        state: ['DRAFT', 'APPROVED_BY_OWNER'],
    }

    useEffect(() => {
        const setLoginWithStrippedAccent = async () => {
            if (loginString) {
                const strippedAccentLogin = await stripAccents(loginString.replace(SPACES_REGEX, '').toLocaleLowerCase())
                setValue(InputNames.LOGIN, strippedAccentLogin)
            } else {
                setValue(InputNames.LOGIN, '')
            }

            if (isSubmitted) {
                trigger(InputNames.LOGIN)
            }
        }
        setLoginWithStrippedAccent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitted, loginString])

    const onSubmit = async (formData: FieldValues) => {
        mutate({
            data: {
                type: 'REGISTER_USER_EVENT',
                claimUi: {
                    ...formData,
                },
            },
        })
    }

    const getTranslatedError = (errorMessage: string): string => {
        const uniqueLogin = 'Login name must be unique'
        const uniqueEmail = 'Email must be unique'

        if (errorMessage.includes(uniqueLogin)) {
            const loginRegex = /available login: (.+)$/
            const matches = errorMessage.match(loginRegex)
            const availableLogin = matches?.[1].trim()

            return t('registration.uniqueLogin', { available: availableLogin })
        } else if (errorMessage.includes(uniqueEmail)) {
            return t('registration.uniqueEmail')
        } else {
            return errorMessage
        }
    }

    return (
        <>
            <FlexColumnReverseWrapper>
                <TextHeading size="L">{t('registration.title')}</TextHeading>
                {errorFromBE && (
                    <MutationFeedback
                        error={errorFromBE === CHYBA_BE ? t('registration.error') : getTranslatedError(errorFromBE)}
                        showSupportEmail={errorFromBE === CHYBA_BE}
                        success={false}
                        onMessageClose={() => setErrorFromBE('')}
                    />
                )}
            </FlexColumnReverseWrapper>
            <QueryFeedback
                loading={isRegisterLoading}
                error={isRegisterError}
                errorProps={{ errorMessage: t('registration.formError') }}
                withChildren
            >
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input
                        label={t('registration.firstName')}
                        error={errors[InputNames.FIRST_NAME]?.message?.toString()}
                        correct={!errors[InputNames.FIRST_NAME] && isSubmitted}
                        {...register(InputNames.FIRST_NAME)}
                        required
                        type="text"
                        autoComplete="given-name"
                    />
                    <Input
                        error={errors[InputNames.LAST_NAME]?.message?.toString()}
                        label={t('registration.lastName')}
                        correct={!errors[InputNames.LAST_NAME] && isSubmitted}
                        {...register(InputNames.LAST_NAME)}
                        required
                        type="text"
                        autoComplete="family-name"
                    />
                    <Input
                        error={errors[InputNames.LOGIN]?.message?.toString()}
                        label={t('registration.login')}
                        correct={!errors[InputNames.LOGIN] && isSubmitted}
                        {...register(InputNames.LOGIN)}
                        required
                        type="text"
                    />
                    <Input
                        error={errors[InputNames.EMAIL]?.message?.toString()}
                        label={t('registration.email')}
                        correct={!errors[InputNames.EMAIL] && isSubmitted}
                        {...register(InputNames.EMAIL)}
                        required
                        type="email"
                        autoComplete="email"
                    />
                    <Input
                        error={errors[InputNames.MOBILE]?.message?.toString()}
                        correct={!errors[InputNames.MOBILE] && isSubmitted}
                        label={t('registration.phone')}
                        {...register(InputNames.MOBILE)}
                        hint={t('registration.phoneHint')}
                        type="tel"
                        required
                        inputClassName={styles.halfWidth}
                        autoComplete="tel"
                    />
                    <CiLazySelect
                        ciType="PO"
                        label={t('registration.po')}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        name={InputNames.PO}
                        metaAttributes={metaAttributesForRegistrationCiSelect}
                        required
                        error={errors[InputNames.PO]?.message?.toString()}
                    />
                    <CheckBox
                        containerClassName={styles.checkboxBottomPadding}
                        {...register(InputNames.DATA_PROCESSING_CONSENT)}
                        id="dataProcessingConsent"
                        label={
                            <div className={styles.flexRow}>
                                <span className={styles.flexNone}>{t('registration.consentWith')}</span>

                                <TextLink newTab to={FooterRouteNames.PERSONAL_DATA_PROTECTION} className={styles.flexNone}>
                                    {t('registration.dataProcessingConsent')}
                                </TextLink>
                            </div>
                        }
                        error={errors[InputNames.DATA_PROCESSING_CONSENT]?.message?.toString()}
                        required
                    />

                    <CheckBox
                        containerClassName={styles.checkboxBottomPadding}
                        id="termsOfUseConsent"
                        label={
                            <div className={styles.flexRow}>
                                <span className={styles.flexNone}>{t('registration.consentWith')}</span>

                                <TextLink newTab to={FooterRouteNames.TERMS_OF_USE} className={styles.flexNone}>
                                    {t('registration.termsOfUseConsent')}
                                </TextLink>
                            </div>
                        }
                        {...register(InputNames.TERMS_OF_USE_CONSENT)}
                        error={errors[InputNames.TERMS_OF_USE_CONSENT]?.message?.toString()}
                        required
                    />

                    <SubmitWithFeedback submitButtonLabel={t('registration.submit')} loading={isRegisterLoading || isSubmitting || isValidating} />
                </form>
            </QueryFeedback>
        </>
    )
}
