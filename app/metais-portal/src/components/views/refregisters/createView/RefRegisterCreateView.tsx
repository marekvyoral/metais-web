import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ButtonGroupRow, TextArea } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
    ApiContact,
    ApiDescription,
    ApiReferenceRegister,
    ApiReferenceRegisterState,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { EDIT_CONTACT } from '@isdd/metais-common/navigation/searchKeys'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'

import { IRefRegisterCreateFormData, createRefRegisterSchema } from '@/components/views/refregisters/schema'
import { RefRegisterCreateRegistrarContactSection } from '@/components/views/refregisters/createView/RefRegisterCreateRegistrarContactSection'
import { RefRegisterCreateMetaSection } from '@/components/views/refregisters/createView/RefRegisterCreateMetaSection'
import { RefRegisterCreateManagerContactSection } from '@/components/views/refregisters/createView/RefRegisterCreateManagerContactSection'
import {
    getInfoRR,
    getLabelRR,
    getUserGroupOptions,
    isRRFieldEditable,
    mapDefaultDataToFormDataRR,
    mapFormDataToApiReferenceRegister,
    showCreatorForm,
    showSourceRegisterForm,
} from '@/componentHelpers/refregisters/helpers'
import { RefRegisterViewItems } from '@/types/views'

export interface IRefRegisterCreateView {
    defaultData?: ApiReferenceRegister
    userGroupData?: ConfigurationItemSetUi
    POData?: ConfigurationItemSetUi
    saveRefRegister?: (formData: ApiReferenceRegister) => void
    updateRefRegister?: (referenceRegisterUuid: string, data: ApiReferenceRegister) => void
    updateContact?: (referenceRegisterUuid: string, data: ApiContact) => void
    updateAccessData?: (referenceRegisterUuid: string, data: ApiDescription) => void
    renamedAttributes?: Attribute[]
}

export const RefRegisterCreateView: React.FC<IRefRegisterCreateView> = ({
    defaultData,
    userGroupData,
    POData,
    saveRefRegister,
    updateRefRegister,
    updateContact,
    updateAccessData,
    renamedAttributes,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [urlParams] = useSearchParams()
    const { entityId } = useParams()
    const isContact = urlParams.get(EDIT_CONTACT) === 'true' ? true : false

    const [userGroupId, setUserGroupId] = useState<string>()
    useEffect(() => {
        if (userGroupData?.configurationItemSet?.length === 1) setUserGroupId(userGroupData.configurationItemSet[0].uuid)
    }, [userGroupData])

    const userGroupOptions = getUserGroupOptions(userGroupData)
    const defaultUserGroup = userGroupOptions?.length === 1 ? userGroupOptions[0] : undefined

    const { register, handleSubmit, setValue, clearErrors, formState, control } = useForm({
        resolver: yupResolver(createRefRegisterSchema(t, showCreatorForm(defaultUserGroup, defaultData), showSourceRegisterForm(defaultData))),
        defaultValues: mapDefaultDataToFormDataRR(defaultData),
    })

    const onSubmit = useCallback(
        async (formData: IRefRegisterCreateFormData) => {
            if (isContact) await updateContact?.(entityId ?? '', mapFormDataToApiReferenceRegister(formData))
            else if (entityId && defaultData?.state === ApiReferenceRegisterState.IN_CONSTRUCTION)
                await updateRefRegister?.(entityId, mapFormDataToApiReferenceRegister(formData, entityId))
            else if (!defaultData?.state) await saveRefRegister?.(mapFormDataToApiReferenceRegister(formData))
            else await updateAccessData?.(entityId ?? '', { description: formData.refRegisters.additionalData })
            navigate(`${NavigationSubRoutes.REFERENCE_REGISTRE}`)
        },
        [defaultData?.state, entityId, isContact, navigate, saveRefRegister, updateAccessData, updateContact, updateRefRegister],
    )
    const creatorNotSet = userGroupId || !showCreatorForm(defaultUserGroup, defaultData) ? false : true
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <>
                    <RefRegisterCreateMetaSection
                        defaultData={defaultData}
                        renamedAttributes={renamedAttributes}
                        userGroupData={userGroupData}
                        setUserGroupId={setUserGroupId}
                        userGroupId={userGroupId}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        formState={formState}
                        register={register}
                        isContact={isContact}
                        creatorNotSet={creatorNotSet}
                        control={control}
                    />
                    <RefRegisterCreateManagerContactSection
                        defaultData={defaultData}
                        renamedAttributes={renamedAttributes}
                        userGroupOptions={userGroupOptions}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        formState={formState}
                        register={register}
                        isContact={isContact}
                        creatorNotSet={creatorNotSet}
                    />

                    <RefRegisterCreateRegistrarContactSection
                        defaultData={defaultData}
                        renamedAttributes={renamedAttributes}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        formState={formState}
                        register={register}
                        isContact={isContact}
                        POData={POData}
                        creatorNotSet={creatorNotSet}
                    />
                    <TextArea
                        label={getLabelRR(RefRegisterViewItems.ADDITIONAL_DATA, renamedAttributes) ?? ''}
                        info={getInfoRR(RefRegisterViewItems.ADDITIONAL_DATA, renamedAttributes)}
                        rows={3}
                        {...register('refRegisters.additionalData')}
                        disabled={!isRRFieldEditable(defaultData?.state, isContact, true) || isContact || creatorNotSet}
                        error={formState.errors?.refRegisters?.additionalData?.message}
                        required
                    />
                    <InformationGridRow
                        key={'state'}
                        label={getLabelRR(RefRegisterViewItems.STATE, renamedAttributes) ?? ''}
                        value={t(`refRegisters.table.state.${defaultData?.state ?? ApiReferenceRegisterState.IN_CONSTRUCTION}`)}
                        tooltip={getInfoRR(RefRegisterViewItems.STATE, renamedAttributes)}
                    />
                    <ButtonGroupRow>
                        <Button type="submit" label={t('refRegisters.create.save')} />
                        <Button
                            variant="secondary"
                            label={t('refRegisters.detail.items.cancel')}
                            onClick={() => navigate(`${NavigationSubRoutes.REFERENCE_REGISTRE}`)}
                        />
                    </ButtonGroupRow>
                </>
            </form>
        </>
    )
}
