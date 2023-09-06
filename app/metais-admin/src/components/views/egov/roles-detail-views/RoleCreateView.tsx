import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { RelatedRoleType } from '@isdd/metais-common/api/generated/iam-swagger'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ICreateRoleViewParams } from '@/components/containers/Egov/Roles/CreateRoleContainer'
import { findInputError, getGroupRoles } from '@/components/views/egov/roles-detail-views/formUtils'

export const RoleCreateView: React.FC<ICreateRoleViewParams> = ({ roleGroups, createRole }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const methods = useForm()
    const register = methods.register
    const errors = methods.formState.errors

    const onSubmit = methods.handleSubmit((data) => {
        createRole({
            data: { name: data['name'], description: data['description'], type: RelatedRoleType.NON_SYSTEM, assignedGroup: data['assignedGroup'] },
        })
    })

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('navbar.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                    { label: t('adminRolesPage.newRole'), href: AdminRouteNames.ROLE_NEW },
                ]}
            />
            <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()} noValidate className="container">
                    <Input
                        label={t('adminRolesPage.name')}
                        {...register('name', { required: { value: true, message: 'Required Name' } })}
                        error={findInputError(errors, 'name')?.error?.message?.toString()}
                    />
                    <Input
                        label={t('adminRolesPage.description')}
                        {...register('description', { required: { value: true, message: 'Required description' } })}
                        error={findInputError(errors, 'description')?.error?.message?.toString()}
                    />
                    <SimpleSelect
                        setValue={methods.setValue}
                        id="assignedGroup"
                        name="assignedGroup"
                        label={t('adminRolesPage.group')}
                        options={[{ value: '', label: t('adminRolesPage.none') }, ...getGroupRoles(roleGroups)]}
                    />
                    <SimpleSelect
                        label={t('adminRolesPage.systemRole')}
                        setValue={methods.setValue}
                        name="systemRole"
                        disabled
                        options={[
                            { value: RelatedRoleType.NON_SYSTEM, label: t('adminRolesPage.no') },
                            { value: RelatedRoleType.SYSTEM, label: t('adminRolesPage.yes') },
                        ]}
                        defaultValue={RelatedRoleType.NON_SYSTEM}
                    />
                    <ButtonGroupRow>
                        <Button label="Submit" onClick={onSubmit} />
                        <Button
                            label="Cancel"
                            onClick={() => navigate(AdminRouteNames.ROLES + '?system=all&group=all', { state: { from: location } })}
                            variant="secondary"
                        />
                    </ButtonGroupRow>
                </form>
            </FormProvider>
        </>
    )
}
