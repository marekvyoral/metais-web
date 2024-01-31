import { BaseModal, SelectLazyLoading, TextHeading, TextWarning } from '@isdd/idsk-ui-kit'
import { CiListFilterContainerUi, ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ModalButtons, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'

export interface IGeneratePdfFormData {
    project?: ConfigurationItemUi[]
    isvs?: ConfigurationItemUi[]
}
export interface IGeneratePdfModalProps {
    open: boolean
    orgId?: string
    onClose: () => void
    onSend: (formData: IGeneratePdfFormData) => void
}
export const GeneratePdfModal: React.FC<IGeneratePdfModalProps> = ({ open, orgId, onClose, onSend }) => {
    const { t } = useTranslation()
    const maxItemsToGenerate = 200
    const readCiList = useReadCiList1Hook()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [totalIsvsCount, setTotalIsvsCount] = useState<number>(0)
    const [totalProjktCount, setTotalProjktCount] = useState<number>(0)
    const [showWarning, setShowWarning] = useState<boolean>(false)
    const { register, handleSubmit, reset, setValue } = useForm<IGeneratePdfFormData>()

    const defaultFilterIsvs = { type: ['ISVS'], metaAttributes: { liableEntityByHierarchy: true, liableEntity: [orgId], state: ['DRAFT'] } }

    const defaultFilterProject = { type: ['Projekt'], metaAttributes: { liableEntityByHierarchy: true, liableEntity: [orgId], state: ['DRAFT'] } }

    const loadOptionsIsvs = async (additional: { page: number } | undefined) => {
        setIsLoading(true)
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await readCiList({ filter: { ...defaultFilterIsvs }, page: page, perpage: 50 } as CiListFilterContainerUi)
        setTotalIsvsCount(options.pagination?.totaltems || 0)
        setIsLoading(false)
        return {
            options: options.configurationItemSet || [],
            hasMore: options.configurationItemSet?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const loadOptionsProjekt = async (additional: { page: number } | undefined) => {
        setIsLoading(true)
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await readCiList({ filter: { ...defaultFilterProject }, page: page, perpage: 50 } as CiListFilterContainerUi)
        setTotalProjktCount(options.pagination?.totaltems || 0)
        setIsLoading(false)
        return {
            options: options.configurationItemSet || [],
            hasMore: options.configurationItemSet?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const generate = (form: IGeneratePdfFormData) => {
        if ((form?.project && form?.project?.length > maxItemsToGenerate) || (form?.isvs && form?.isvs?.length > maxItemsToGenerate)) {
            setShowWarning(true)
            return
        }
        if ((!form?.project && totalProjktCount > maxItemsToGenerate) || (!form?.isvs && totalIsvsCount > maxItemsToGenerate)) {
            setShowWarning(true)
            return
        }

        setShowWarning(false)
        onSend(form)
    }

    useEffect(() => {
        loadOptionsIsvs({ page: 1 })
        loadOptionsProjekt({ page: 1 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <BaseModal isOpen={open} close={onClose}>
            <QueryFeedback loading={isLoading} withChildren>
                <form onSubmit={handleSubmit(generate)}>
                    <TextHeading size="L">{t('ciType.pdfGenerateFuture')}</TextHeading>
                    {showWarning && <TextWarning>{t('modalKris.generatePdf.tooBigToGenerate')}</TextWarning>}
                    <SelectLazyLoading<ConfigurationItemUi>
                        isMulti
                        key="project"
                        id="project"
                        {...register('project')}
                        label={t('modalKris.generatePdf.project')}
                        placeholder={t('modalKris.generatePdf.allProjects')}
                        loadOptions={(a, b, additional) => loadOptionsProjekt(additional)}
                        getOptionLabel={(item) =>
                            `${item?.attributes?.['Gen_Profil_kod_metais'] ?? ''} - ${item?.attributes?.['Gen_Profil_nazov'] ?? ''}`
                        }
                        getOptionValue={(item) => item?.attributes?.['Gen_Profil_nazov'] ?? ''}
                        onChange={(val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) =>
                            setValue('project', val as ConfigurationItemUi[])
                        }
                        setValue={setValue}
                    />

                    <SelectLazyLoading<ConfigurationItemUi>
                        isMulti
                        key="isvs"
                        id="isvs"
                        {...register('isvs')}
                        label={t('modalKris.generatePdf.isvs')}
                        placeholder={t('modalKris.generatePdf.allISVS')}
                        loadOptions={(a, b, additional) => loadOptionsIsvs(additional)}
                        getOptionLabel={(item) =>
                            `${item?.attributes?.['Gen_Profil_kod_metais'] ?? ''} - ${item?.attributes?.['Gen_Profil_nazov'] ?? ''}`
                        }
                        getOptionValue={(item) => item?.attributes?.['Gen_Profil_nazov'] ?? ''}
                        onChange={(val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) =>
                            setValue('isvs', val as ConfigurationItemUi[])
                        }
                        setValue={setValue}
                    />

                    <ModalButtons
                        submitButtonLabel={t('ciType.pdfGenerateFuture')}
                        closeButtonLabel={t('evaluation.cancelBtn')}
                        onClose={() => {
                            reset()
                            onClose()
                        }}
                    />
                </form>
            </QueryFeedback>
        </BaseModal>
    )
}
