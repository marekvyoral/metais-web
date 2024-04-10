import { BaseModal, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { GetAllLocale, GetAllUserInterface, TextConfDiff, useGetDiff } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { FC, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'

import { DiffLocalizationTable, DiffTableColumnsIDs } from './DiffLocalizationTable'

import { DataRecord, isObjectWithSkAndEn } from '@/componentHelpers/localization'

enum DiffLocalizationFormEnum {
    LANG = 'language',
}

type DiffLocalizationForm = {
    language: GetAllLocale
}

type Props = {
    isOpen: boolean
    close: () => void
    rowSelection: DataRecord
    userInterface: GetAllUserInterface
    filterLanguage: GetAllLocale | 'ALL'
}

type ApiSortType = { orderBy: DiffTableColumnsIDs; sortDirection: 'asc' | 'desc' }

export const DiffLocalizationModal: FC<Props> = ({ isOpen, close, rowSelection, userInterface, filterLanguage }) => {
    const { t } = useTranslation()
    const { setValue, watch } = useForm<DiffLocalizationForm>({
        defaultValues: {
            language: 'SK',
        },
    })
    const { language } = watch()
    const isAllLanguage = filterLanguage === 'ALL'

    const inputMap: { [key: string]: string } = useMemo(() => {
        return Object.keys(rowSelection).reduce((acc, curr) => {
            const current = rowSelection[curr]
            let currentLowerCaseLang: 'sk' | 'en'

            if (isAllLanguage) {
                currentLowerCaseLang = language.toLowerCase() as 'sk' | 'en'
                if (isObjectWithSkAndEn(current)) {
                    return { ...acc, [curr]: current[currentLowerCaseLang] }
                }
            }

            return { ...acc, [curr]: current }
        }, {})
    }, [isAllLanguage, language, rowSelection])

    const { mutateAsync, isLoading, isError } = useGetDiff()
    const [data, setData] = useState<TextConfDiff[]>([])
    const [apiSort, setApiSort] = useState<ApiSortType>({
        orderBy: DiffTableColumnsIDs.KEY,
        sortDirection: 'asc',
    })

    const getSortForTable = (): ColumnSort[] => {
        let newDirection: SortType
        switch (apiSort.sortDirection) {
            case 'desc': {
                newDirection = SortType.DESC
                break
            }
            default: {
                newDirection = SortType.ASC
                break
            }
        }
        return [{ orderBy: apiSort.orderBy, sortDirection: newDirection }]
    }

    const getSortForApi = (tableSort: ColumnSort[]): ApiSortType => {
        let newDirection: 'asc' | 'desc'
        switch (tableSort?.[0]?.sortDirection) {
            case SortType.DESC: {
                newDirection = 'desc'
                break
            }
            default: {
                newDirection = 'asc'
                break
            }
        }
        return { orderBy: tableSort?.[0]?.orderBy as DiffTableColumnsIDs, sortDirection: newDirection }
    }

    useEffect(() => {
        if (isOpen) {
            const setDiffData = async () => {
                const result = await mutateAsync({
                    data: inputMap,
                    params: { locale: isAllLanguage ? language : filterLanguage, userInterface, sort: [apiSort.orderBy, apiSort.sortDirection] },
                })
                setData(result)
            }
            setDiffData()
        }
    }, [inputMap, isOpen, language, mutateAsync, apiSort.orderBy, apiSort.sortDirection, userInterface, isAllLanguage, filterLanguage])

    return (
        <BaseModal isOpen={isOpen} close={close}>
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <TextHeading size="XL">{t('localization.diffModal.heading')}</TextHeading>
                {isAllLanguage && (
                    <SimpleSelect
                        isClearable={false}
                        label={t('localization.filter.lang')}
                        name={DiffLocalizationFormEnum.LANG}
                        options={[
                            { label: t('localization.filter.sk'), value: GetAllLocale.SK },
                            { label: t('localization.filter.en'), value: GetAllLocale.EN },
                        ]}
                        setValue={setValue}
                        value={language}
                    />
                )}
                <DiffLocalizationTable data={data} sort={getSortForTable()} onSortingChange={(sort) => setApiSort(getSortForApi(sort))} />
            </QueryFeedback>
        </BaseModal>
    )
}
