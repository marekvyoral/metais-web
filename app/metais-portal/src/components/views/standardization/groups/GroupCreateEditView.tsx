import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, IOption, Input, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useFindRelatedOrganizationsHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { GroupFormEnum, createGroupSchema, editGroupSchema } from './groupSchema'

import { IdentitySelect } from '@/components/identity-lazy-select/IdentitySelect'
import { IGroupEditViewParams } from '@/components/containers/standardization/groups/GroupEditContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const GroupCreateEditView: React.FC<IGroupEditViewParams> = ({ onSubmit, goBack, infoData, isEdit, resultApiCall, isLoading }) => {
    const { t } = useTranslation()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(isEdit ? editGroupSchema(t) : createGroupSchema(t)),
        defaultValues: {
            name: infoData?.name ?? '',
            short_name: infoData?.shortName ?? '',
            description: infoData?.description || '',
            organization: '',
            user: '',
        },
    })
    useEffect(() => {
        reset({
            name: infoData?.name ?? '',
            short_name: infoData?.shortName ?? '',
            description: infoData?.description || '',
            organization: '',
            user: '',
        })
    }, [infoData?.description, infoData?.name, infoData?.shortName, reset])

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    const orgOptionsHook = useFindRelatedOrganizationsHook()

    const [selectedIdentity, setSelectedIdentity] = useState<string | undefined>(undefined)
    const [organizationOptions, setOrganizationOptions] = useState<IOption<string>[] | undefined>(undefined)

    const watchUser = watch([GroupFormEnum.USER])

    const loadOrgs = useCallback(async (selectedIdentityUuid: string) => {
        await orgOptionsHook(selectedIdentityUuid).then((res) => {
            setOrganizationOptions(
                res.map((org) => {
                    const option: IOption<string> = { value: org.cmdbId ?? '', label: org.attributes?.Gen_Profil_nazov ?? '' }
                    return option
                }),
            )
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (resultApiCall?.message) {
            scrollToMutationFeedback()
        }
    }, [resultApiCall?.message, scrollToMutationFeedback])

    useEffect(() => {
        selectedIdentity && loadOrgs(selectedIdentity)
    }, [loadOrgs, selectedIdentity])

    useEffect(() => {
        if (watchUser[0]) {
            setSelectedIdentity(watchUser[0])
        }
    }, [watchUser])

    return (
        <>
            {!isEdit && (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                        { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                        { href: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE, label: t('navMenu.lists.groups') },
                        { href: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE, label: t('groups.groupList') },
                        {
                            href: NavigationSubRoutes.PRACOVNA_SKUPINA_CREATE,
                            label: t('groups.addNewGroup'),
                        },
                    ]}
                />
            )}
            {isEdit && (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                            { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                            { href: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE, label: t('navMenu.lists.groups') },
                            { href: `${NavigationSubRoutes.PRACOVNA_SKUPINA_DETAIL}/${infoData?.uuid}`, label: infoData?.name ?? '' },
                            {
                                href: `${NavigationSubRoutes.PRACOVNA_SKUPINA_EDIT}/${infoData?.uuid}/edit`,
                                label: t('groups.editGroup'),
                            },
                        ]}
                    />
                </>
            )}
            <MainContentWrapper>
                <FlexColumnReverseWrapper>
                    <TextHeading size="XL">{isEdit ? `${t('groups.editGroup')} - ${infoData?.name}` : t('groups.addNewGroup')}</TextHeading>
                    {(resultApiCall?.isError || resultApiCall?.isSuccess) && (
                        <div ref={wrapperRef}>
                            <MutationFeedback error={resultApiCall.message} success={resultApiCall.isSuccess} />
                        </div>
                    )}
                </FlexColumnReverseWrapper>
                <QueryFeedback
                    loading={isLoading}
                    indicatorProps={{ label: isEdit ? t('groups.editingGroup') : t('groups.creatingGroup') }}
                    withChildren
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label={`${t('groups.groupName')} (${t('groups.mandatory')}):`}
                            id={GroupFormEnum.NAME}
                            {...register(GroupFormEnum.NAME, { value: infoData?.name })}
                            error={errors[GroupFormEnum.NAME]?.message}
                        />
                        <Input
                            label={`${t('groups.shortGroupName')} (${t('groups.mandatory')}):`}
                            id={GroupFormEnum.SHORT_NAME}
                            {...register(GroupFormEnum.SHORT_NAME, { value: infoData?.shortName })}
                            error={errors[GroupFormEnum.SHORT_NAME]?.message}
                        />
                        <RichTextQuill
                            label={`${t('groups.description')} (${t('groups.mandatory')}):`}
                            id={GroupFormEnum.DESCRIPTION}
                            name={GroupFormEnum.DESCRIPTION}
                            value={watch(GroupFormEnum.DESCRIPTION)}
                            defaultValue={infoData?.description}
                            error={errors[GroupFormEnum.DESCRIPTION]?.message}
                            onChange={(text) => setValue(GroupFormEnum.DESCRIPTION, text)}
                        />

                        {!isEdit && (
                            <>
                                <IdentitySelect
                                    label={`${t('groups.master')} (${t('groups.mandatory')})`}
                                    name={GroupFormEnum.USER}
                                    setValue={setValue}
                                    clearErrors={clearErrors}
                                    error={errors[GroupFormEnum.USER]?.message}
                                />
                                <SimpleSelect
                                    label={`${t('groups.organization')} (${t('groups.mandatory')}):`}
                                    id={GroupFormEnum.ORGANIZATION}
                                    name={GroupFormEnum.ORGANIZATION}
                                    options={organizationOptions ?? []}
                                    setValue={setValue}
                                    error={errors[GroupFormEnum.ORGANIZATION]?.message}
                                />
                            </>
                        )}
                        <ButtonGroupRow>
                            <Button label={t('form.cancel')} type="reset" variant="secondary" onClick={goBack} />
                            <Button label={t('form.submit')} type="submit" />
                        </ButtonGroupRow>
                    </form>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
