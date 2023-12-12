import { Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MutationFeedback, QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { FilterMetaAttributesUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { yupResolver } from '@hookform/resolvers/yup'
import { mixed, object, string } from 'yup'
import { TFunction } from 'i18next'
import { useRegisterUser } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { useNavigate } from 'react-router-dom'
import { RegistrationRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useStripAccentsHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { LOWER_CASE_NUMBER_DOT_REGEX, SPACES_REGEX, phoneOrEmptyStringRegex } from '@isdd/metais-common/constants'

import styles from './registration.module.scss'

interface Props {
    isError: boolean
    isFetching: boolean
}

export enum InputNames {
    FIRST_NAME = 'identityFirstName',
    LAST_NAME = 'identityLastName',
    EMAIL = 'email',
    PHONE = 'telephone',
    PO = 'po',
    LOGIN = 'identityLogin',
}

const getRegistrationSchema = (t: TFunction) => {
    const registrationFormSchema = object().shape({
        [InputNames.FIRST_NAME]: string().required(t('registration.required.firstName')),
        [InputNames.LAST_NAME]: string().required(t('registration.required.lastName')),
        [InputNames.EMAIL]: string().email(t('registration.format.email')).required(t('registration.required.email')),
        [InputNames.PHONE]: string().matches(phoneOrEmptyStringRegex, t('registration.format.phone')).required(t('registration.required.phone')),
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
                    <MutationFeedback error={errorFromBE === CHYBA_BE ? t('registration.error') : getTranslatedError(errorFromBE)} success={false} />
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
                        type="text"
                    />
                    <Input
                        error={errors[InputNames.LAST_NAME]?.message?.toString()}
                        label={t('registration.lastName')}
                        correct={!errors[InputNames.LAST_NAME] && isSubmitted}
                        {...register(InputNames.LAST_NAME)}
                        type="text"
                    />
                    <Input
                        error={errors[InputNames.LOGIN]?.message?.toString()}
                        label={t('registration.login')}
                        correct={!errors[InputNames.LOGIN] && isSubmitted}
                        {...register(InputNames.LOGIN)}
                        type="text"
                    />
                    <Input
                        error={errors[InputNames.EMAIL]?.message?.toString()}
                        label={t('registration.email')}
                        correct={!errors[InputNames.EMAIL] && isSubmitted}
                        {...register(InputNames.EMAIL)}
                        type="email"
                    />
                    <Input
                        error={errors[InputNames.PHONE]?.message?.toString()}
                        correct={!errors[InputNames.PHONE] && isSubmitted}
                        label={t('registration.phone')}
                        {...register(InputNames.PHONE)}
                        hint={t('registration.phoneHint')}
                        type="tel"
                        inputClassName={styles.halfWidth}
                    />
                    <CiLazySelect
                        ciType="PO"
                        label={t('registration.po')}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        name={InputNames.PO}
                        metaAttributes={metaAttributesForRegistrationCiSelect}
                        error={errors[InputNames.PO]?.message?.toString()}
                    />
                    <SubmitWithFeedback submitButtonLabel={t('registration.submit')} loading={isRegisterLoading || isSubmitting || isValidating} />
                </form>
            </QueryFeedback>
        </>
    )
}
