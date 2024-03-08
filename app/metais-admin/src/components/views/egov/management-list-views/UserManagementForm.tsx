import { yupResolver } from '@hookform/resolvers/yup'
import {
    getFindByUuid2QueryKey,
    getFindRelatedRoles1QueryKey,
    getFindRoleOrgRelationsQueryKey,
    useUpdateOrCreateWithGid,
} from '@isdd/metais-common/api/generated/iam-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { SPACES_REGEX } from '@isdd/metais-common/constants'
import { ErrorBlock } from '@isdd/idsk-ui-kit/index'

import { InputNames, UserDetailForm } from './UserDetailForm'
import { UserManagementFormButtons } from './UserManagementFormButtons'
import { OrgData, UserRolesForm } from './UserRolesForm'
import { formatGidsData } from './managementListHelpers'
import { getUserManagementFormSchema } from './userManagementFormSchema'

import { UserDetailData } from '@/components/containers/ManagementList/UserDetailContainer'
import { UserManagementData } from '@/components/containers/ManagementList/UserManagementContainer'
import { useGetAvailableLogin } from '@/hooks/useGetAvailableLogin'

interface Props {
    detailData: UserDetailData | undefined | null
    managementData: UserManagementData | undefined
    isCreate?: boolean
    isLoading: boolean
    isError: boolean
}

export const UserManagementForm: React.FC<Props> = ({ detailData, managementData, isCreate = false, isLoading, isError }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const managedUserUuid = detailData?.userData?.uuid
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    const managementListPath = '/managementList'
    const detailPath = '/detail'
    const userIdPath = `/${managedUserUuid}`
    const NO_CHANGES_DETECTED = 'NoChangesDetected'
    const UNIQUE_LOGIN = 'UniqueLogin'
    const UNIQUE_EMAIL = 'UniqueEmail'

    const methods = useForm({
        resolver: yupResolver(getUserManagementFormSchema(t)),
    })

    const [editedUserOrgAndRoles, setEditedUserOrgAndRoles] = useState<Record<string, OrgData>>({})
    const [loginValue, setLoginValue] = useState<string>('')
    const [shouldReset, setShouldReset] = useState(false)

    const [errorType, setErrorType] = useState<string>('')

    const values = methods.watch()
    const loginString = `${values[InputNames.FIRST_NAME]?.trim()}${values[InputNames.LAST_NAME] ? '.' + values[InputNames.LAST_NAME]?.trim() : ''}`

    useEffect(() => {
        methods.setValue(InputNames.LOGIN, loginValue ? loginValue.replace(SPACES_REGEX, '') : '')
    }, [loginValue, methods])

    const { isError: availableLoginError, isFetching } = useGetAvailableLogin(loginString, setLoginValue, 500, isCreate)

    useEffect(() => {
        methods.reset(detailData?.userData)
    }, [detailData, methods])

    const handleBackNavigate = () => {
        if (isCreate) {
            navigate(-1)
        } else {
            navigate(managementListPath + detailPath + userIdPath, { state: { from: location } })
        }
    }

    const handleResetForm = () => {
        setShouldReset((prev) => !prev)
        methods.reset()
    }

    const userDataQueryKey = getFindByUuid2QueryKey(managedUserUuid ?? '')
    const userRolesQueryKey = getFindRelatedRoles1QueryKey(managedUserUuid ?? '')
    const userOrgRelationsQueryKey = getFindRoleOrgRelationsQueryKey(managedUserUuid ?? '')

    const queryClient = useQueryClient()

    const updateOrCreate = useUpdateOrCreateWithGid({
        mutation: {
            onSuccess() {
                if (isCreate) {
                    navigate(managementListPath, { state: { from: location } })
                    setIsActionSuccess({ value: true, path: managementListPath })
                } else {
                    navigate(`${AdminRouteNames.USER_MANAGEMENT}/detail/${managedUserUuid}`)
                    setIsActionSuccess({ value: true, path: `${AdminRouteNames.USER_MANAGEMENT}/detail/${managedUserUuid}` })

                    queryClient.invalidateQueries({ queryKey: userDataQueryKey })
                    queryClient.invalidateQueries({ queryKey: userRolesQueryKey })
                    queryClient.invalidateQueries({ queryKey: userOrgRelationsQueryKey })
                }
            },
            onError(error) {
                if (error instanceof Error && typeof error.message === 'string') {
                    const errorData = JSON.parse(error.message)
                    if (errorData.type === NO_CHANGES_DETECTED) {
                        setErrorType(NO_CHANGES_DETECTED)
                    }
                    if (errorData.type === 'UniqueConstraintException' && errorData.property === 'login') {
                        setErrorType(UNIQUE_LOGIN)
                    }
                    if (errorData.type === 'UniqueConstraintException' && errorData.property === 'email') {
                        setErrorType(UNIQUE_EMAIL)
                    }
                }
            },
        },
    })

    const handleFormSubmit = (formData: FieldValues) => {
        const userData = detailData?.userData
        const identity = isCreate
            ? formData
            : {
                  ...formData,
                  uuid: userData?.uuid,
                  state: userData?.state,
                  type: userData?.type,
                  authResourceLP: userData?.authResourceLP,
                  authResourceEid: userData?.authResourceEid,
                  authResourceKrb: userData?.authResourceKrb,
                  authResourceClar: userData?.authResourceClar,
                  authenticationResource: userData?.authenticationResource,
              }

        const gids = formatGidsData(editedUserOrgAndRoles)
        updateOrCreate.mutateAsync({ data: { identity: identity, gids: gids } })
    }

    useEffect(() => {
        scrollToMutationFeedback()
    }, [updateOrCreate.isError, updateOrCreate.isSuccess, scrollToMutationFeedback])

    return (
        <FormProvider {...methods}>
            <QueryFeedback
                loading={isLoading || updateOrCreate.isLoading}
                error={isError}
                withChildren
                indicatorProps={{
                    label: updateOrCreate.isLoading ? (isCreate ? t('userManagement.creationLoading') : t('userManagement.editLoading')) : undefined,
                }}
            >
                {methods.formState.isSubmitted && !methods.formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

                <form onSubmit={methods.handleSubmit(handleFormSubmit)} noValidate>
                    {(updateOrCreate.isError || updateOrCreate.isSuccess) && (
                        <div ref={wrapperRef}>
                            <MutationFeedback
                                error={
                                    !updateOrCreate.isSuccess &&
                                    (errorType === NO_CHANGES_DETECTED
                                        ? t('managementList.noChangesDetected')
                                        : errorType === UNIQUE_LOGIN
                                        ? t('userManagement.error.uniqueLogin')
                                        : errorType === UNIQUE_EMAIL
                                        ? t('userProfile.uniqueEmail')
                                        : t('managementList.mutationError'))
                                }
                                success={updateOrCreate.isSuccess}
                            />
                        </div>
                    )}
                    <UserDetailForm
                        isCreate={isCreate}
                        userData={detailData?.userData}
                        handleBackNavigate={handleBackNavigate}
                        handleResetForm={handleResetForm}
                        isError={availableLoginError}
                        isFetching={isFetching}
                        loginValue={loginValue}
                    />
                    <UserRolesForm
                        isCreate={isCreate}
                        shouldReset={shouldReset}
                        detailData={detailData}
                        managementData={managementData}
                        editedUserOrgAndRoles={editedUserOrgAndRoles}
                        setEditedUserOrgAndRoles={setEditedUserOrgAndRoles}
                        handleBackNavigate={handleBackNavigate}
                    />
                    <UserManagementFormButtons
                        handleBackNavigate={handleBackNavigate}
                        handleResetForm={handleResetForm}
                        isError={availableLoginError}
                        hideCancelButton={!isCreate}
                    />
                </form>
            </QueryFeedback>
        </FormProvider>
    )
}
