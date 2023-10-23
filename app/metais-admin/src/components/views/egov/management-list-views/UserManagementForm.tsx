import React, { useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUpdateOrCreateWithGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'

import { InputNames, UserDetailForm } from './UserDetailForm'
import { OrgData, UserRolesForm } from './UserRolesForm'
import { UserManagementFormButtons } from './UserManagementFormButtons'
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
    const managementListPath = '/managementList'
    const detailPath = '/detail'
    const userIdPath = `/${detailData?.userData?.uuid}`

    const methods = useForm({ resolver: yupResolver(getUserManagementFormSchema(t)) })

    const [editedUserOrgAndRoles, setEditedUserOrgAndRoles] = useState<Record<string, OrgData>>({})
    const [loginValue, setLoginValue] = useState<string>('')
    const [shouldReset, setShouldReset] = useState(false)

    const values = methods.watch()
    const loginString = `${values[InputNames.FIRST_NAME]}${values[InputNames.LAST_NAME] ? '.' + values[InputNames.LAST_NAME] : ''}`

    const { isError: availableLoginError, isFetching } = useGetAvailableLogin(loginString, setLoginValue, 500, isCreate)

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

    const updateOrCreate = useUpdateOrCreateWithGid({
        mutation: {
            onSuccess() {
                if (isCreate) {
                    navigate(managementListPath, { state: { from: location } })
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
                  login: userData?.login,
                  authResourceLP: userData?.authResourceLP,
                  authResourceEid: userData?.authResourceEid,
                  authResourceKrb: userData?.authResourceKrb,
                  authResourceClar: userData?.authResourceClar,
                  authenticationResource: userData?.authenticationResource,
              }

        const gids = formatGidsData(editedUserOrgAndRoles)

        updateOrCreate.mutateAsync({ data: { identity: identity, gids: gids } })
    }

    return (
        <FormProvider {...methods}>
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
                    {(updateOrCreate.isError || updateOrCreate.isSuccess) && (
                        <MutationFeedback error={t('managementList.mutationError')} success={updateOrCreate.isSuccess} />
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
