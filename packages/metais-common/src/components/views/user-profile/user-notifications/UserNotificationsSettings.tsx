import React, { useEffect, useState } from 'react'
import { AccordionContainer, CheckBox, DEFAULT_LAZY_LOAD_PER_PAGE, ILoadOptionsResponse, SelectLazyLoading, Table } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { SortType } from '@isdd/idsk-ui-kit/src/types'
import classNames from 'classnames'

import { UserFavoritesNotifications } from './components/FavoritesNotifications'
import styles from './userNotificationsSettings.module.scss'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useChangeIdentityNotifications, useFindByUuid2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { ConfigurationItemSetUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'

enum Tabs {
    ITEMS = 'ITEMS',
    RELATIONS = 'RELATIONS',
    TASKS = 'TASKS',
    INTEGRATIONS = 'INTEGRATIONS',
    STANDARDIZATION = 'STANDARDIZATION',
    USER = 'USER',
    LICENSES = 'LICENSES',
    CODELIST = 'CODELIST',
}

enum ItemsPreferences {
    ITEM_SAVED = 'ITEM_SAVED',
    ITEM_CHANGED = 'ITEM_CHANGED',
    ITEM_VALIDATED = 'ITEM_VALIDATED',
    ITEM_INVALIDATED = 'ITEM_INVALIDATED',
    ITEM_CHANGED_OWNER = 'ITEM_CHANGED_OWNER',
}

enum RelationsPreferences {
    RELATION_SAVED = 'RELATION_SAVED',
    RELATION_CHANGED = 'RELATION_CHANGED',
    RELATION_VALIDATED = 'RELATION_VALIDATED',
    RELATION_INVALIDATED = 'RELATION_INVALIDATED',
    RELATION_CHANGED_OWNER = 'RELATION_CHANGED_OWNER',
}

enum TasksPreferences {
    TASK_CREATED = 'TASK_CREATED',
    TASK_CHANGED_ASSIGNEE = 'TASK_CHANGED_ASSIGNEE',
    TASK_CLOSED = 'TASK_CLOSED',
}
enum IntegrationsPreferences {
    INTEGRATION_STARTED = 'INTEGRATION_STARTED',
    INTEGRATION_DELAYED = 'INTEGRATION_DELAYED',
}
enum StandardizationPreferences {
    STANDARD_REQUEST = 'STANDARD_REQUEST',
    STANDARD_MEETING = 'STANDARD_MEETING',
    STANDARD_VOTE = 'STANDARD_VOTE',
    STANDARD_USERS_IN_GROUP = 'STANDARD_USERS_IN_GROUP',
    STANDARD_CSRU_SYNC = 'STANDARD_CSRU_SYNC',
}
enum UserPreferences {
    USER_IMPORTED = 'USER_IMPORTED',
    USER_CHANGED = 'USER_CHANGED',
    USER_ACCEPTED = 'USER_ACCEPTED',
    USER_REFUSED = 'USER_REFUSED',
}
enum LicensesPreferences {
    LICENSE_ADDED = 'LICENSE_ADDED',
    LICENSE_MOVED = 'LICENSE_MOVED',
    LICENSE_CHANGED_UNUSED = 'LICENSE_CHANGED_UNUSED',
}
enum CodeListsPreferences {
    CODELIST_REQUEST = 'CODELIST_REQUEST',
    CODELIST_CHANGE_STATUS = 'CODELIST_CHANGE_STATUS',
    CODELIST_CHANGE_ITEM = 'CODELIST_CHANGE_ITEM',
}

const Sections = {
    [Tabs.ITEMS]: ItemsPreferences,
    [Tabs.RELATIONS]: RelationsPreferences,
    [Tabs.TASKS]: TasksPreferences,
    [Tabs.INTEGRATIONS]: IntegrationsPreferences,
    [Tabs.STANDARDIZATION]: StandardizationPreferences,
    [Tabs.USER]: UserPreferences,
    [Tabs.LICENSES]: LicensesPreferences,
    [Tabs.CODELIST]: CodeListsPreferences,
}

type SettingRow = {
    id: string
    portalSelected: boolean
    emailSelected: boolean
}

interface Project {
    uuid: string
    name: string
}

const getContentTable = (columns: Array<ColumnDef<SettingRow>>, items: string[]) => {
    const data: SettingRow[] = items.map((item) => ({
        id: item,
        emailSelected: false,
        portalSelected: false,
    }))

    return <Table columns={columns} data={data} />
}

const mapProjects = (data: ConfigurationItemSetUi): Project[] => {
    return (
        data?.configurationItemSet?.map((item) => ({
            name: (item?.attributes?.['Gen_Profil_nazov'] as string) ?? '',
            uuid: item.uuid ?? '',
        })) ?? []
    )
}

export const UserNotificationsSettings = () => {
    const {
        state: { user },
    } = useAuth()
    const { t } = useTranslation()
    const readCiListHook = useReadCiList1Hook()

    const prefixMsg = 'mutationFeedback'
    const [isLoadingProject, setIsLoadingProjects] = useState<boolean>(false)
    const [isErrorProject, setIsErrorProjects] = useState<boolean>(false)
    const [messageSection, setMessageSection] = useState<string>()
    const [selectedPortalNotifications, setSelectedPortalNotifications] = useState<string[]>([])
    const [selectedEmailNotifications, setSelectedEmailNotifications] = useState<string[]>([])
    const [selectedProjectsNotifications, setSelectedProjectsNotifications] = useState<Project[]>([])

    const {
        data: notificationsData,
        isFetching: isLoadingNotifications,
        isError: isErrorNotifications,
    } = useFindByUuid2(user?.uuid ?? '', { query: { enabled: !!user?.uuid } })
    const { mutate: mutateSettings, isError: isErrorSettingsMutation, isSuccess: isSuccessSettingsMutation } = useChangeIdentityNotifications()

    useEffect(() => {
        setSelectedPortalNotifications(notificationsData?.webNotifPreferences ?? [])
        setSelectedEmailNotifications(notificationsData?.emailNotifPreferences ?? [])
    }, [notificationsData?.emailNotifPreferences, notificationsData?.webNotifPreferences])

    useEffect(() => {
        if (notificationsData?.projectNotifPreferences?.length ?? 0 > 0) {
            setIsErrorProjects(false)
            setIsLoadingProjects(true)
            readCiListHook({
                page: 1,
                perpage: 999,
                filter: { type: ['Projekt'], uuid: notificationsData?.projectNotifPreferences, metaAttributes: { state: ['DRAFT'] } },
            })
                .then((data) => {
                    setSelectedProjectsNotifications(mapProjects(data))
                })
                .catch(() => {
                    setIsErrorProjects(true)
                })
                .finally(() => {
                    setIsLoadingProjects(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationsData?.projectNotifPreferences])

    const handleSave = (email: string[], portal: string[], projects: Project[]) => {
        mutateSettings({
            data: {
                emailNotifPreferences: email,
                webNotifPreferences: portal,
                projectNotifPreferences: projects.map((project) => project.uuid),
            },
        })
    }

    const handlePortalCheckboxChange = (id: string, checked: boolean, sectionId: string) => {
        setMessageSection(`${prefixMsg}.${sectionId}`)
        let state: string[] = []
        if (checked) {
            state = [...selectedPortalNotifications, id]
        } else {
            state = selectedPortalNotifications.filter((item) => item !== id)
        }
        setSelectedPortalNotifications(state)
        handleSave(selectedEmailNotifications, state, selectedProjectsNotifications)
    }

    const handleEmailCheckboxChange = (id: string, checked: boolean, sectionId: string) => {
        setMessageSection(`${prefixMsg}.${sectionId}`)

        let state: string[] = []
        if (checked) {
            state = [...selectedEmailNotifications, id]
        } else {
            state = selectedEmailNotifications.filter((item) => item !== id)
        }

        setSelectedEmailNotifications(state)
        handleSave(state, selectedPortalNotifications, selectedProjectsNotifications)
    }

    const handleChangeProjects = (projects: Project[]) => {
        setMessageSection(`${prefixMsg}.PROJECTS`)
        setSelectedProjectsNotifications(projects)
        handleSave(selectedEmailNotifications, selectedPortalNotifications, projects)
    }

    const loadProjectsSelectOptions = async (
        searchQuery: string,
        additional: { page: number } | undefined,
    ): Promise<ILoadOptionsResponse<Project>> => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const response = await readCiListHook({
            filter: {
                fullTextSearch: searchQuery,
                type: ['Projekt'],
            },
            sortBy: 'Gen_Profil_nazov',
            sortType: SortType.ASC,
            page,
            perpage: DEFAULT_LAZY_LOAD_PER_PAGE,
        })

        return {
            options: mapProjects(response),
            hasMore: page < (response.pagination?.totalPages ?? 0),
            additional: {
                page: page,
            },
        }
    }

    const getColumnsDefinition = (sectionId: string): Array<ColumnDef<SettingRow>> => [
        {
            header: t('userProfile.notifications.table.name'),
            id: 'name',
            accessorFn: (row) => t(`userProfile.notifications.settings.${sectionId}.${row.id}`),
        },
        {
            header: t('userProfile.notifications.table.settings'),
            id: 'settings',
            accessorFn: (row) => row.id,
            cell: (ctx) => {
                const id = ctx.cell.getValue() as string
                return (
                    <div className={classNames('govuk-checkboxes', 'govuk-checkboxes--small', styles.buttonContainer)}>
                        <CheckBox
                            id={`portal-${id}`}
                            name="portal"
                            label={t('userProfile.notifications.table.portal')}
                            checked={selectedPortalNotifications.includes(id)}
                            onChange={(event) => handlePortalCheckboxChange(id, event.target.checked, sectionId)}
                        />
                        <CheckBox
                            id={`email-${id}`}
                            name="email"
                            label={t('userProfile.notifications.table.email')}
                            checked={selectedEmailNotifications.includes(id)}
                            onChange={(event) => handleEmailCheckboxChange(id, event.target.checked, sectionId)}
                        />
                    </div>
                )
            },
        },
    ]
    const isLoading = [isLoadingNotifications, isLoadingProject].some((item) => item)
    const isError = [isErrorNotifications, isErrorProject].some((item) => item)
    const isSuccessMutation = [isSuccessSettingsMutation].some((item) => item)
    const isErrorMutation = [isErrorSettingsMutation].some((item) => item)

    const sections = [
        {
            title: t(`userProfile.notifications.settings.tabs.FAVORITES`),
            content: (
                <>
                    <MutationFeedback
                        key={`${prefixMsg}.FAVORITES`}
                        error={isErrorMutation}
                        success={isSuccessMutation && messageSection === `${prefixMsg}.FAVORITES`}
                        successMessage={t(`userProfile.notifications.feedback.editSuccess`)}
                        onMessageClose={() => setIsErrorProjects(false)}
                    />
                    <UserFavoritesNotifications />
                </>
            ),
        },
        ...Object.entries(Sections).map(([sectionId, preferences]) => ({
            title: t(`userProfile.notifications.settings.tabs.${sectionId}`),
            content: (
                <>
                    <MutationFeedback
                        key={`${prefixMsg}.${sectionId}`}
                        error={isErrorMutation}
                        success={isSuccessMutation && messageSection === `${prefixMsg}.${sectionId}`}
                        successMessage={t(`userProfile.notifications.feedback.editSuccess`)}
                        onMessageClose={() => setIsErrorProjects(false)}
                    />
                    {getContentTable(getColumnsDefinition(sectionId), Object.keys(preferences))}
                </>
            ),
        })),
        {
            title: t(`userProfile.notifications.settings.tabs.PROJECTS`),
            content: (
                <>
                    <MutationFeedback
                        key={`${prefixMsg}.PROJECTS`}
                        error={isErrorMutation}
                        success={isSuccessMutation && messageSection === `${prefixMsg}.PROJECTS`}
                        successMessage={t(`userProfile.notifications.feedback.editSuccess`)}
                        onMessageClose={() => setIsErrorProjects(false)}
                    />
                    <SelectLazyLoading
                        getOptionLabel={(item) => item.name}
                        getOptionValue={(item) => item.uuid}
                        loadOptions={(searchQuery, _prevOptions, additional) => loadProjectsSelectOptions(searchQuery, additional)}
                        label={t(`userProfile.notifications.settings.tabs.PROJECTS`)}
                        name="projectsSelect"
                        isMulti
                        isClearable={false}
                        onChange={(projects) => handleChangeProjects(projects as Project[])}
                        defaultValue={selectedProjectsNotifications}
                    />
                </>
            ),
        },
    ]

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <AccordionContainer sections={sections} />
        </QueryFeedback>
    )
}
