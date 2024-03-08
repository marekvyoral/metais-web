import { BreadCrumbs, Button, ButtonGroupRow, ErrorBlock, HomeIcon, Input, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { RelatedRoleType } from '@isdd/metais-common/api/generated/iam-swagger'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { ICreateRoleViewParams } from '@/components/containers/Egov/Roles/CreateRoleContainer'
import { findInputError, getGroupRoles } from '@/components/views/egov/roles-detail-views/formUtils'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const RoleCreateView: React.FC<ICreateRoleViewParams> = ({ roleGroups, createRole, isError, isLoading }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
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
                withWidthContainer
                links={[
                    { label: t('navbar.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                    { label: t('adminRolesPage.newRole'), href: AdminRouteNames.ROLE_NEW },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} withChildren error={false}>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="L">{t('adminRolesPage.newRole')}</TextHeading>
                        {isError && <QueryFeedback error loading={false} />}
                    </FlexColumnReverseWrapper>

                    {methods.formState.isSubmitted && !methods.formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

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
                            <ButtonGroupRow>
                                <Button label={t('adminRolesPage.submit')} onClick={onSubmit} />
                                <Button
                                    label={t('adminRolesPage.cancel')}
                                    onClick={() => navigate(AdminRouteNames.ROLES + '?system=all&group=all', { state: { from: location } })}
                                    variant="secondary"
                                />
                            </ButtonGroupRow>
                        </form>
                    </FormProvider>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
