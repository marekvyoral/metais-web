import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RelatedRoleType, useFindByUuid, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import { BreadCrumbs, Button, HomeIcon, Input, LoadingIndicator, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { FormProvider, useForm } from 'react-hook-form'
import { useGetValidEnum } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ROLES_GROUP } from '@isdd/metais-common/components/constants'

import { findInputError } from '@/components/views/egov/roles/formUtils'

const EditRole: React.FC = () => {
    const { id } = useParams()

    const { data: currentRole, isLoading } = useFindByUuid(id ?? '')
    const { t } = useTranslation()
    const navigate = useNavigate()
    const methods = useForm({
        defaultValues: {
            name: currentRole?.name,
            description: currentRole?.description,
            assignedGroup: currentRole?.assignedGroup,
            type: currentRole?.type,
        },
        values: currentRole,
    })
    const { mutate: updateRole } = useUpdateOrCreate()
    const register = methods.register
    const errors = methods.formState.errors
    const onSubmit = methods.handleSubmit((data) => {
        updateRole({
            data: {
                name: data['name'],
                description: data['description'],
                type: RelatedRoleType.NON_SYSTEM,
                assignedGroup: data['assignedGroup'],
                uuid: id,
            },
        })
    })
    const { data: roleGroups } = useGetValidEnum(ROLES_GROUP)
    const [tableRoleGroups, setTableRoleGroups] = useState(roleGroups)
    useEffect(() => {
        setTableRoleGroups(roleGroups)
    }, [roleGroups])

    const groups: { value: string; label: string }[] =
        tableRoleGroups?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.value ?? '' })) ?? []
    return (
        <>
            {isLoading && <LoadingIndicator fullscreen />}
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                    { label: t('adminRolesPage.newRole'), href: AdminRouteNames.ROLE_EDIT + '/' + id },
                ]}
            />
            <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()} noValidate className="container">
                    <Input
                        label={t('adminRolesPage.name')}
                        {...register('name', { required: { value: true, message: t('adminRolesPage.requiredName') } })}
                        error={findInputError(errors, 'name')?.error?.message?.toString()}
                    />
                    <Input
                        label={t('adminRolesPage.description')}
                        {...register('description', { required: { value: true, message: t('adminRolesPage.requiredDesc') } })}
                        error={findInputError(errors, 'description')?.error?.message?.toString()}
                    />
                    <SimpleSelect
                        {...register('assignedGroup')}
                        id="assignedGroup"
                        label={t('adminRolesPage.group')}
                        options={[{ value: '', label: t('adminRolesPage.none') }, ...groups]}
                    />
                    <SimpleSelect
                        {...register('type')}
                        label={t('adminRolesPage.systemRole')}
                        disabled
                        options={[
                            { value: RelatedRoleType.SYSTEM, label: t('adminRolesPage.yes') },
                            { value: RelatedRoleType.NON_SYSTEM, label: t('adminRolesPage.no') },
                        ]}
                    />
                    <Button label="Submit" onClick={onSubmit} />
                    <Button label="Cancel" onClick={() => navigate(AdminRouteNames.ROLES + '?system=all&group=all')} variant="secondary" />
                </form>
            </FormProvider>
        </>
    )
}

export default EditRole
