import { yupResolver } from '@hookform/resolvers/yup'
import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, Input, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { useTrainingInviteSchema } from './useTrainingInviteSchemas'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { ITrainingInviteForm, TrainingInviteContainerViewProps } from '@/components/containers/TrainingInviteContainer'
import styles from '@/components/views/codeLists/codeList.module.scss'
import { useCiListPageHeading } from '@/componentHelpers/ci'

export enum RequestFormEnum {
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    ORGANIZATION = 'organization',
    PHONE = 'phone',
    EMAIL = 'email',
}

export const TrainingInviteView: React.FC<TrainingInviteContainerViewProps> = ({
    user,
    entityId,
    ciTypeData,
    ciItemData,
    entityName,
    isError,
    errorMessages,
    isLoading,
    isLoadingMutation,
    handleInvite,
}) => {
    const { t } = useTranslation()
    const { schema } = useTrainingInviteSchema()
    const navigate = useNavigate()

    const { register, handleSubmit, formState, reset } = useForm<ITrainingInviteForm>({
        resolver: yupResolver(schema),
        defaultValues: { firstName: user?.name, lastName: user?.lastName, organization: '', phone: user?.phone, email: user?.email },
    })

    useEffect(() => {
        reset({ firstName: user?.name, lastName: user?.lastName, organization: '', phone: user?.phone, email: user?.email })
    }, [user, reset])

    const onHandleSubmit = (formData: ITrainingInviteForm) => {
        handleInvite(formData)
    }

    const { getHeading } = useCiListPageHeading(ciTypeData?.name ?? '', t)
    document.title = `${t('breadcrumbs.registerForTraining')} ${META_IS_TITLE}`
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: getHeading(), href: `/ci/${entityName}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                    {
                        label: t('breadcrumbs.registerForTraining'),
                        href: `/ci/${entityName}/${entityId}/invite`,
                    },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={isError} withChildren>
                    {isLoadingMutation && <LoadingIndicator label={t('feedback.saving')} />}
                    <TextHeading size="XL">{t('trainings.invitedTitle')}</TextHeading>
                    <form onSubmit={handleSubmit(onHandleSubmit)}>
                        <Input
                            required
                            label={t('trainings.table.firstName')}
                            id={RequestFormEnum.FIRST_NAME}
                            {...register(RequestFormEnum.FIRST_NAME)}
                            error={formState.errors[RequestFormEnum.FIRST_NAME]?.message}
                        />

                        <Input
                            required
                            label={t('trainings.table.lastName')}
                            id={RequestFormEnum.LAST_NAME}
                            {...register(RequestFormEnum.LAST_NAME)}
                            error={formState.errors[RequestFormEnum.LAST_NAME]?.message}
                        />
                        <Input
                            required
                            label={t('trainings.table.organization')}
                            id={RequestFormEnum.ORGANIZATION}
                            {...register(RequestFormEnum.ORGANIZATION)}
                            error={formState.errors[RequestFormEnum.ORGANIZATION]?.message}
                        />
                        <Input
                            required
                            label={t('trainings.table.email')}
                            id={RequestFormEnum.EMAIL}
                            {...register(RequestFormEnum.EMAIL)}
                            error={formState.errors[RequestFormEnum.EMAIL]?.message}
                        />

                        <Input
                            required
                            label={t('trainings.table.phone')}
                            id={RequestFormEnum.PHONE}
                            {...register(RequestFormEnum.PHONE)}
                            error={formState.errors[RequestFormEnum.PHONE]?.message}
                        />

                        {errorMessages.map((errorMessage, index) => (
                            <MutationFeedback success={false} key={index} error={t([errorMessage, 'feedback.mutationErrorMessage'])} />
                        ))}

                        <ButtonGroupRow className={styles.buttonGroupEdit}>
                            <Button
                                label={t('button.cancel')}
                                type="reset"
                                variant="secondary"
                                onClick={() => {
                                    reset()
                                    navigate(-1)
                                }}
                            />
                            <Button label={t('trainings.register')} type="submit" />
                        </ButtonGroupRow>
                    </form>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default TrainingInviteView
