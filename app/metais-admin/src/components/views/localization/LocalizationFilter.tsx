import { Filter } from '@isdd/idsk-ui-kit/filter'
import { SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { LocalizationFilterEnum, LocalizationFilterMap } from '@/componentHelpers/localization'

type Props = {
    defaultFilterValues: LocalizationFilterMap
}

export const LocalizationFilter: FC<Props> = ({ defaultFilterValues }) => {
    const { t } = useTranslation()
    return (
        <Filter
            defaultFilterValues={defaultFilterValues}
            form={({ setValue, watch }) => {
                const { language, type } = watch()
                return (
                    <>
                        <SimpleSelect
                            isClearable={false}
                            label={t('localization.filter.lang')}
                            name={LocalizationFilterEnum.LANG}
                            options={[
                                { label: t('localization.filter.sk'), value: 'SK' },
                                { label: t('localization.filter.en'), value: 'EN' },
                                { label: t('localization.filter.allLanguages'), value: 'ALL' },
                            ]}
                            setValue={setValue}
                            value={language}
                        />
                        <SimpleSelect
                            isClearable={false}
                            label={t('localization.filter.type')}
                            name={LocalizationFilterEnum.TYPE}
                            options={[
                                { label: t('localization.portal'), value: 'PORTAL' },
                                { label: t('localization.admin'), value: 'ADMIN' },
                            ]}
                            setValue={setValue}
                            value={type}
                        />
                    </>
                )
            }}
        />
    )
}
