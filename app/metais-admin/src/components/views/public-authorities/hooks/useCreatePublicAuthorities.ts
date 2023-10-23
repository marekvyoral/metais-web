import { yupResolver } from '@hookform/resolvers/yup'
import { IOption } from '@isdd/idsk-ui-kit'
import { useGetUuidHook } from '@isdd/metais-common/api'
import { useFindEaGarpoAdminHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useCallback } from 'react'
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ICreatePublicAuthoritiesView } from '@/components/containers/public-authorities/CreatePublicAuthoritiesContainer'
import { createNewPOElement, removeEmptyAttributes } from '@/components/views/public-authorities/helpers/formatting'
import { generateCreatePublicAuthoritiesSchema } from '@/components/views/public-authorities/schemas/createPublicAuthoritiesSchema'

interface iUseCreatePublicAuthoritiesOutput {
    personCategoriesOptions: IOption[]
    personTypesOptions: IOption[]
    sourcesOptions: IOption[]
    replicationTypesOptions: IOption[]
    isTypePersonDisabled: boolean
    onSubmit: (formValues: FieldValues) => Promise<void>
    formMethods: UseFormReturn<
        {
            Gen_Profil_nazov: string
            EA_Profil_PO_kategoria_osoby: string
            EA_Profil_PO_typ_osoby: string
            Gen_Profil_anglicky_nazov: string | undefined
            Gen_Profil_popis: string | undefined
            Gen_Profil_anglicky_popis: string | undefined
            Gen_Profil_zdroj: string | undefined
            Gen_Profil_kod_metais: string | undefined
            Gen_Profil_ref_id: string | undefined
            EA_Profil_PO_webove_sidlo: string | undefined
            Gen_Profil_poznamka: string | undefined
            EA_Profil_PO_ico: string | undefined
            EA_Profil_PO_psc: string | undefined
            EA_Profil_PO_obec: string | undefined
            EA_Profil_PO_ulica: string | undefined
            EA_Profil_PO_cislo: string | undefined
            EA_Profil_PO_okres: string | undefined
            EA_Profil_PO_je_kapitola: boolean | undefined
            Gen_Profil_EA_skrateny_nazov: string | undefined
            Gen_Profil_EA_popis_referencie: string | undefined
            Gen_Profil_EA_odkaz_na_referenciu: string | undefined
            Gen_Profil_EA_typ_replikacie: string | undefined
            Gen_Profil_EA_pocet_replikacii: string | undefined
            Profil_PO_statutar_titul_pred_menom: string | undefined
            Profil_PO_statutar_meno: string | undefined
            Profil_PO_statutar_priezvisko: string | undefined
            Profil_PO_statutar_titul_za_menom: string | undefined
        },
        unknown,
        undefined
    >
}

export const useCreatePublicAuthorities = (
    { data: { personCategories, personTypes, sources, organizationData, replications }, storePO, updatePO }: ICreatePublicAuthoritiesView,
    setSubmit: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitLoading: React.Dispatch<React.SetStateAction<boolean>>,
): iUseCreatePublicAuthoritiesOutput => {
    const { ico, entityId } = useParams()
    const { t } = useTranslation()
    const generatedFormSchema = generateCreatePublicAuthoritiesSchema(t)
    const roleOrgGroup = useFindEaGarpoAdminHook()
    const getUUID = useGetUuidHook()

    const formMethods = useForm({
        resolver: yupResolver(generatedFormSchema),
        defaultValues: {
            EA_Profil_PO_ico: ico,
            Gen_Profil_kod_metais: ico,
            Gen_Profil_ref_id: `https://data.gov.sk/id/legal-subject/${ico}`,
            ...organizationData?.attributes,
        },
        mode: 'onChange',
    })

    const onSubmit = useCallback(
        async (formValues: FieldValues) => {
            setSubmit(true)
            setSubmitLoading(true)
            const sanitizedAttributes = removeEmptyAttributes(formValues)
            if (!ico && entityId) {
                setSubmitLoading(false)
                await updatePO(entityId, {
                    type: 'PO',
                    uuid: entityId,
                    attributes: sanitizedAttributes,
                })
            } else {
                const newGroup = await roleOrgGroup()
                const relId = await getUUID()
                const poID = await getUUID()
                const newPOElement = createNewPOElement(relId, poID, newGroup, sanitizedAttributes)
                setSubmitLoading(false)
                await storePO(newPOElement, poID, relId)
            }
        },
        [setSubmit, setSubmitLoading, ico, entityId, updatePO, roleOrgGroup, getUUID, storePO],
    )

    const personCategoriesOptions = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(personCategories?.enumItems?.map((enumItem) => ({
            value: enumItem?.code ?? '',
            label: `${enumItem?.value} (${enumItem?.code})`,
        })) ?? []),
    ]

    const personTypesOptions = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(personTypes?.enumItems?.map((enumItem) => ({
            value: enumItem?.code ?? '',
            label: `${enumItem?.value} (${enumItem?.code})`,
        })) ?? []),
    ]

    const sourcesOptions = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(sources?.enumItems?.map((enumItem) => ({
            value: enumItem?.code ?? '',
            label: `${enumItem?.value} (${enumItem?.code})`,
        })) ?? []),
    ]

    const replicationTypesOptions = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(replications?.enumItems?.map((enumItem) => ({
            value: enumItem?.code ?? '',
            label: `${enumItem?.value} (${enumItem?.code})`,
        })) ?? []),
    ]
    const isTypePersonDisabled = formMethods?.watch('EA_Profil_PO_kategoria_osoby') !== 'c_kategoria_osoba.2'

    return {
        personCategoriesOptions,
        personTypesOptions,
        sourcesOptions,
        replicationTypesOptions,
        isTypePersonDisabled,
        onSubmit,
        formMethods,
    }
}
