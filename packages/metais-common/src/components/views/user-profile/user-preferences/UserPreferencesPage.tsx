import { CheckBox, GridCol, GridRow, SelectLazyLoading, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { SortType } from '@isdd/idsk-ui-kit/src/types'

import styles from './userPreferences.module.scss'

import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import {
    UpdatePreferencesReturnEnum,
    UserPreferencesFormNamesEnum,
    useUserPreferences,
} from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { MutationFeedback, QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { ConfigurationItemUi, useReadCiList1, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const UserPreferencesPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const {
        state: { user },
    } = useAuth()

    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()
    const { currentPreferences, updateUserPreferences } = useUserPreferences()

    const ciOptionsHook = useReadCiList1Hook()

    const [hasError, setHasError] = useState(false)
    const [isMyPOEnabled, setIsMyPOEnabled] = useState(false)

    const [showInvalidated, setShowInvalidated] = useState(false)
    const [defaultPerPage, setDefaultPerPage] = useState('')
    const [myPO, setMyPO] = useState<ConfigurationItemUi>()
    const [defaultLang, setDefaultLang] = useState('')

    const DEFAULT_LANGUAGE_OPTIONS = [
        { value: Languages.SLOVAK, label: t(`language.${Languages.SLOVAK}`) },
        { value: Languages.ENGLISH, label: t(`language.${Languages.ENGLISH}`) },
    ]

    useEffect(() => {
        setShowInvalidated(currentPreferences.showInvalidatedItems)
        setDefaultPerPage(currentPreferences.defaultPerPage)
        setDefaultLang(currentPreferences.defaultLanguage)
        setIsMyPOEnabled(!!currentPreferences.myPO)
    }, [currentPreferences.defaultLanguage, currentPreferences.showInvalidatedItems, currentPreferences.myPO, currentPreferences.defaultPerPage])

    const {
        data: defaultMyPOData,
        isLoading,
        isError,
    } = useReadCiList1(
        {
            filter: { type: ['PO'], uuid: [currentPreferences.myPO] },
        },
        { query: { enabled: !!currentPreferences.myPO } },
    )

    const defaultValueForMyPOLazySelect = defaultMyPOData?.configurationItemSet?.[0]
    const [seed, setSeed] = useState(1)

    useEffect(() => {
        setSeed(Math.random())
    }, [defaultValueForMyPOLazySelect])

    const loadCiOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const userPoUuids = user?.groupData.map((po) => po.orgId) ?? []

            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const ciResponse = await ciOptionsHook({
                page,
                perpage: 20,
                sortBy: 'Gen_Profil_nazov',
                sortType: SortType.ASC,
                filter: { type: ['PO'], searchFields: ['Gen_Profil_nazov'], fullTextSearch: searchQuery, uuid: [...userPoUuids] },
            })

            return {
                options: ciResponse.configurationItemSet || [],
                hasMore: page < (ciResponse.pagination?.totalPages ?? 0),
                additional: {
                    page,
                },
            }
        },
        [ciOptionsHook, user?.groupData],
    )

    const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = {
            [UserPreferencesFormNamesEnum.MY_PO]: myPO?.uuid ?? '',
            [UserPreferencesFormNamesEnum.SHOW_INVALIDATED]: showInvalidated,
            [UserPreferencesFormNamesEnum.DEFAULT_PER_PAGE]: defaultPerPage,
            [UserPreferencesFormNamesEnum.DEFAULT_LANG]: defaultLang,
        }
        setHasError(false)
        i18n.changeLanguage(formData.defaultLanguage)
        const preferencesData = { ...formData, [UserPreferencesFormNamesEnum.MY_PO]: isMyPOEnabled ? formData.myPO : '' }

        const update = updateUserPreferences(preferencesData)
        if (update === UpdatePreferencesReturnEnum.SUCCESS) {
            setIsActionSuccess({ value: true, path: location.pathname })
        } else if (update === UpdatePreferencesReturnEnum.ERROR) {
            setHasError(true)
        }
    }

    return (
        <QueryFeedback loading={isLoading && !!currentPreferences.myPO} error={isError} withChildren>
            <form onSubmit={onSubmit}>
                <MutationFeedback success={isActionSuccess.value} error={hasError} successMessage={t('userProfile.userPreferencesSuccess')} />
                <GridRow>
                    <GridCol className={styles.withMargin} setWidth="one-third">
                        <CheckBox
                            label={t('userProfile.showInvalidated')}
                            id="show-invalidated"
                            name={UserPreferencesFormNamesEnum.SHOW_INVALIDATED}
                            onChange={() => setShowInvalidated((prev) => !prev)}
                            checked={showInvalidated}
                        />
                    </GridCol>
                </GridRow>
                <GridRow>
                    <GridCol setWidth="one-third">
                        <SimpleSelect
                            label={t('userProfile.defaultPerPage')}
                            name={UserPreferencesFormNamesEnum.DEFAULT_PER_PAGE}
                            options={DEFAULT_PAGESIZE_OPTIONS}
                            value={defaultPerPage}
                            onChange={(val) => setDefaultPerPage(val ?? '')}
                        />
                    </GridCol>
                </GridRow>
                <GridRow className={styles.myPODiv}>
                    <GridCol className={styles.marginAuto} setWidth="one-third">
                        <CheckBox
                            labelClassName={styles.noWrap}
                            label={t('userProfile.isMyPoEnabled')}
                            id="is-my-PO-enabled"
                            name="is-my-PO-enabled"
                            onChange={() => setIsMyPOEnabled((prev) => !prev)}
                            checked={isMyPOEnabled}
                        />
                    </GridCol>
                    <GridCol setWidth="two-thirds">
                        <SelectLazyLoading<ConfigurationItemUi>
                            key={seed}
                            label={t('userProfile.myPoSelect')}
                            name={UserPreferencesFormNamesEnum.MY_PO}
                            getOptionValue={(item) => item.uuid?.toString() || ''}
                            getOptionLabel={(item) => (item.attributes ? item.attributes?.Gen_Profil_nazov : '')}
                            loadOptions={(searchTerm, _, additional) => loadCiOptions(searchTerm, additional)}
                            disabled={!isMyPOEnabled}
                            value={myPO}
                            onChange={(val) => setMyPO(Array.isArray(val) ? val[0] : val)}
                            defaultValue={defaultValueForMyPOLazySelect}
                        />
                    </GridCol>
                </GridRow>
                <GridRow>
                    <GridCol setWidth="one-third">
                        <SimpleSelect
                            label={t('userProfile.defaultLang')}
                            name={UserPreferencesFormNamesEnum.DEFAULT_LANG}
                            options={DEFAULT_LANGUAGE_OPTIONS}
                            value={defaultLang}
                            onChange={(val) => setDefaultLang(val ?? '')}
                        />
                    </GridCol>
                </GridRow>

                <SubmitWithFeedback submitButtonLabel={t('userProfile.savePreferences')} loading={false} />
            </form>
        </QueryFeedback>
    )
}
