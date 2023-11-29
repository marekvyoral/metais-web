import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { RootRouteContainer } from './route-containers/RootRouteContainer'

import { TodoPage } from '@/components/views/todo-page/TodoPage'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { Home } from '@/pages/Home'
import AsEntityDetailPage from '@/pages/ci/AS/[entityId]'
import CloneEntityPage from '@/pages/ci/AS/[entityId]/clone'
import ActivityEntityDetailPage from '@/pages/ci/Aktivita/[entityId]'
import GoalEntityDetailPage from '@/pages/ci/Ciel/[entityId]'
import KRISListPage from '@/pages/ci/KRIS'
import KrisEntityDetailPage from '@/pages/ci/KRIS/[entityId]'
import Evaluation from '@/pages/ci/KRIS/[entityId]/evaluation'
import Goals from '@/pages/ci/KRIS/[entityId]/goals'
import KsEntityDetailPage from '@/pages/ci/KS/[entityId]'
import POIsListPage from '@/pages/ci/PO_IS'
import POIsPOListPage from '@/pages/ci/PO_IS_PO'
import POPOListPage from '@/pages/ci/PO_PO'
import PrincipleEntityDetailPage from '@/pages/ci/Princip/[entityId]'
import ProjectEntityDetailPage from '@/pages/ci/Projekt/[entityId]'
import ActivitiesListPage from '@/pages/ci/Projekt/[entityId]/activities'
import ProjectDocumentsListPage from '@/pages/ci/Projekt/[entityId]/documents'
import EntityDetailPage from '@/pages/ci/[entityName]/[entityId]'
import DocumentsListPage from '@/pages/ci/[entityName]/[entityId]/documents'
import EditEntityPage from '@/pages/ci/[entityName]/[entityId]/edit'
import History from '@/pages/ci/[entityName]/[entityId]/history'
import CompareSinglePage from '@/pages/ci/[entityName]/[entityId]/history/[firstId]'
import ComparePage from '@/pages/ci/[entityName]/[entityId]/history/[firstId]/[secondId]'
import Information from '@/pages/ci/[entityName]/[entityId]/information'
import CreateCiItemAndRelation from '@/pages/ci/[entityName]/[entityId]/new-ci/[tabName]'
import NewCiRelationPage from '@/pages/ci/[entityName]/[entityId]/new-relation/[tabName]'
import RelationshipsAccordionPage from '@/pages/ci/[entityName]/[entityId]/relationships'
import CreateEntityPage from '@/pages/ci/[entityName]/create'
import CiListPage from '@/pages/ci/[entityName]/entity'
import CodeListDetailPage from '@/pages/data-objects/codelists/[id]/detail'
import EditCodeListPage from '@/pages/data-objects/codelists/[id]/edit'
import CodeListPage from '@/pages/data-objects/codelists/list'
import RequestListDetailPage from '@/pages/data-objects/requestlist/[requestId]/detail'
import RequestListEditPage from '@/pages/data-objects/requestlist/[requestId]/edit'
import RequestListCreatePage from '@/pages/data-objects/requestlist/create'
import RequestListPage from '@/pages/data-objects/requestlist/requestList'
import GlobalSearchPage from '@/pages/global/search/search'
import TutorialPage from '@/pages/help'
import GeneralHowTo from '@/pages/howto'
import NotificationsPage from '@/pages/notifications'
import NotificationsDetailPage from '@/pages/notifications/[id]'
import PublicAuthoritiesHierarchyPage from '@/pages/public-authorities-hierarchy'
import ITVSStandards from '@/pages/publicspace'
import RefRegistersDetail from '@/pages/refregisters/[entityId]'
import RefRegistersEdit from '@/pages/refregisters/[entityId]/edit'
import RefRegistersHistory from '@/pages/refregisters/[entityId]/history'
import RefRegistersCompareSinglePage from '@/pages/refregisters/[entityId]/history/[firstId]'
import RefRegistersComparePage from '@/pages/refregisters/[entityId]/history/[firstId]/[secondId]'
import RefRegistersHistoryChanges from '@/pages/refregisters/[entityId]/historyChanges'
import RefRegistersInformation from '@/pages/refregisters/[entityId]/information'
import RefRegistersCreate from '@/pages/refregisters/create'
import ReferenceRegisters from '@/pages/refregisters/refRegisterList'
import Failed from '@/pages/registration/failed'
import Registration from '@/pages/registration/registration'
import Success from '@/pages/registration/success'
import RelationDetailPage from '@/pages/relation/[entityName]/[entityId]/[relationshipId]'
import ReportsDetailPage from '@/pages/reports/[entityId]/report'
import ReportsListPage from '@/pages/reports/reports'
import DraftsListEditPage from '@/pages/standardization/draftslist/[entityId]/edit'
import DraftDetail from '@/pages/standardization/draftslist/[entityId]/form'
import DraftsListCreatePage from '@/pages/standardization/draftslist/create'
import DraftsListListPage from '@/pages/standardization/draftslist/list'
import GroupsListPage from '@/pages/standardization/groupslist'
import GroupDetailPage from '@/pages/standardization/groupslist/[groupId]'
import GroupEditPage from '@/pages/standardization/groupslist/[groupId]/edit'
import CreateGroupPage from '@/pages/standardization/groupslist/create'
import MeetingsListPage from '@/pages/standardization/meetingslist'
import MeetingDetailPage from '@/pages/standardization/meetingslist/[meetingId]'
import MeetingEditPage from '@/pages/standardization/meetingslist/[meetingId]/edit'
import CreateMeetingPage from '@/pages/standardization/meetingslist/create'
import VotesListPage from '@/pages/standardization/voteslist'
import VoteDetailPage from '@/pages/standardization/voteslist/[voteIdParam]'
import VoteEditPage from '@/pages/standardization/voteslist/[voteIdParam]/edit'
import VoteCreatePage from '@/pages/standardization/voteslist/create'
import TasksPage from '@/pages/ulohy'
import TaskDetailPage from '@/pages/ulohy/[taskId]'
import UserProfilePage from '@/pages/userprofile/profile'
import Tasks from '@/pages/ci/KRIS/[entityId]/tasks'
import CreateProjectPage from '@/pages/ci/Projekt/create'
import EditProjectPage from '@/pages/ci/Projekt/[entityId]/edit'

export interface RouteConfig {
    path?: string
    component: React.FC
    slug?: string
    index?: boolean
    subRoutes?: RouteConfig[]
}

const generalCiDetailInformationOutlet: RouteConfig = {
    slug: RouterRoutes.CI_DETAIL,
    component: Information,
    index: true,
}

const generalCiDetailOutlets: RouteConfig[] = [
    generalCiDetailInformationOutlet,
    {
        path: RouterRoutes.DOCUMENTS_OUTLET,
        slug: RouterRoutes.DOCUMENTS_OUTLET,
        component: DocumentsListPage,
    },
    {
        path: RouterRoutes.RELATIONSHIPS_OUTLET,
        slug: RouterRoutes.RELATIONSHIPS_OUTLET,
        component: RelationshipsAccordionPage,
    },
    {
        path: RouterRoutes.HISTORY_OUTLET,
        slug: RouterRoutes.HISTORY_OUTLET,
        component: History,
    },
]

const generalCiRoutes: RouteConfig[] = [
    {
        path: RouterRoutes.CI_LIST,
        slug: RouterRoutes.CI_LIST,
        component: CiListPage,
    },
    {
        path: RouterRoutes.CI_CREATE,
        slug: RouterRoutes.CI_CREATE,
        component: CreateEntityPage,
    },
    {
        path: RouterRoutes.CI_EDIT,
        slug: RouterRoutes.CI_EDIT,
        component: EditEntityPage,
    },
    {
        path: RouterRoutes.CI_CLONE,
        slug: RouterRoutes.CI_CLONE,
        component: CloneEntityPage,
    },
    {
        path: RouterRoutes.CI_DETAIL,
        slug: RouterRoutes.CI_DETAIL,
        component: EntityDetailPage,
        subRoutes: generalCiDetailOutlets,
    },
    {
        path: RouterRoutes.HISTORY_COMPARE_SINGLE_ITEM,
        slug: RouterRoutes.HISTORY_COMPARE_SINGLE_ITEM,
        component: CompareSinglePage,
    },
    {
        path: RouterRoutes.HISTORY_COMPARE_TWO_ITEMS,
        slug: RouterRoutes.HISTORY_COMPARE_TWO_ITEMS,
        component: ComparePage,
    },
    {
        path: RouterRoutes.CI_CREATE_ITEM_RELATION,
        slug: RouterRoutes.CI_CREATE_ITEM_RELATION,
        component: CreateCiItemAndRelation,
    },
    {
        path: RouterRoutes.CI_CREATE_RELATION,
        slug: RouterRoutes.CI_CREATE_RELATION,
        component: NewCiRelationPage,
    },
]

export const routesConfig: RouteConfig[] = [
    {
        slug: RouterRoutes.HOME,
        path: RouterRoutes.HOME,
        component: RootRouteContainer,
        subRoutes: [
            {
                index: true,
                component: Home,
            },
            {
                path: RouterRoutes.DEV_TEST_SCREEN,
                slug: RouterRoutes.DEV_TEST_SCREEN,
                component: DevTestScreen,
            },
            {
                path: RouterRoutes.USER_PROFILE,
                slug: RouterRoutes.USER_PROFILE,
                component: UserProfilePage,
            },
            {
                path: RouterRoutes.TASKS,
                slug: RouterRoutes.TASKS,
                component: TasksPage,
            },
            {
                path: RouterRoutes.TASK_DETAIL,
                slug: RouterRoutes.TASK_DETAIL,
                component: TaskDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_LIST,
                slug: RouterRoutes.STANDARDIZATION_VOTE_LIST,
                component: VotesListPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_DETAIL,
                slug: RouterRoutes.STANDARDIZATION_VOTE_DETAIL,
                component: VoteDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_CREATE,
                slug: RouterRoutes.STANDARDIZATION_VOTE_CREATE,
                component: VoteCreatePage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_VOTE_EDIT,
                slug: RouterRoutes.STANDARDIZATION_VOTE_EDIT,
                component: VoteEditPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_MEETINGS_LIST,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_LIST,
                component: MeetingsListPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_MEETINGS_DETAIL,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_DETAIL,
                component: MeetingDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_MEETINGS_CREATE,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_CREATE,
                component: CreateMeetingPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_MEETINGS_EDIT,
                slug: RouterRoutes.STANDARDIZATION_MEETINGS_EDIT,
                component: MeetingEditPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_LIST,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_LIST,
                component: GroupsListPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_DETAIL,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_DETAIL,
                component: GroupDetailPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_CREATE,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_CREATE,
                component: CreateGroupPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_GROUPS_EDIT,
                slug: RouterRoutes.STANDARDIZATION_GROUPS_EDIT,
                component: GroupEditPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_DRAFTS_LIST,
                slug: RouterRoutes.STANDARDIZATION_DRAFTS_LIST,
                component: DraftsListListPage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_DRAFTS_DETAIL,
                slug: RouterRoutes.STANDARDIZATION_DRAFTS_DETAIL,
                component: DraftDetail,
            },
            {
                path: RouterRoutes.STANDARDIZATION_DRAFTS_CREATE,
                slug: RouterRoutes.STANDARDIZATION_DRAFTS_CREATE,
                component: DraftsListCreatePage,
            },
            {
                path: RouterRoutes.STANDARDIZATION_DRAFTS_EDIT,
                slug: RouterRoutes.STANDARDIZATION_DRAFTS_EDIT,
                component: DraftsListEditPage,
            },
            {
                path: RouterRoutes.REPORTS_LIST,
                slug: RouterRoutes.REPORTS_LIST,
                component: ReportsListPage,
            },
            {
                path: RouterRoutes.REPORTS_DETAIL,
                slug: RouterRoutes.REPORTS_DETAIL,
                component: ReportsDetailPage,
            },
            {
                path: RouterRoutes.REPORTS_CREATE,
                slug: RouterRoutes.REPORTS_CREATE,
                component: DraftsListCreatePage,
            },
            {
                path: RouterRoutes.RELATIONS,
                slug: RouterRoutes.RELATIONS,
                component: RelationDetailPage,
            },
            {
                path: RouterRoutes.REGISTRATION,
                slug: RouterRoutes.REGISTRATION,
                component: Registration,
            },
            {
                path: RouterRoutes.REGISTRATION_SUCCESS,
                slug: RouterRoutes.REGISTRATION_SUCCESS,
                component: Success,
            },
            {
                path: RouterRoutes.REGISTRATION_FAILED,
                slug: RouterRoutes.REGISTRATION_FAILED,
                component: Failed,
            },
            {
                path: RouterRoutes.PUBLIC_SPACE,
                slug: RouterRoutes.PUBLIC_SPACE,
                component: ITVSStandards,
            },
            {
                path: RouterRoutes.PUBLIC_AUTHORITIES_HIERARCHY,
                slug: RouterRoutes.PUBLIC_AUTHORITIES_HIERARCHY,
                component: PublicAuthoritiesHierarchyPage,
            },
            {
                path: RouterRoutes.NOTIFICATIONS,
                slug: RouterRoutes.NOTIFICATIONS,
                component: NotificationsPage,
            },
            {
                path: RouterRoutes.NOTIFICATIONS_DETAIL,
                slug: RouterRoutes.NOTIFICATIONS_DETAIL,
                component: NotificationsDetailPage,
            },
            {
                path: RouterRoutes.NOTIFICATIONS_DETAIL,
                slug: RouterRoutes.NOTIFICATIONS_DETAIL,
                component: NotificationsDetailPage,
            },
            {
                path: RouterRoutes.HOW_TO_GENERAL_PAGE,
                slug: RouterRoutes.HOW_TO_GENERAL_PAGE,
                component: GeneralHowTo,
            },
            {
                path: RouterRoutes.HELP,
                slug: RouterRoutes.HELP,
                component: TutorialPage,
            },
            {
                path: RouterRoutes.GLOBAL_SEARCH,
                slug: RouterRoutes.GLOBAL_SEARCH,
                component: GlobalSearchPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_CODE_LIST,
                slug: RouterRoutes.DATA_OBJECT_CODE_LIST,
                component: CodeListPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_CODE_LIST_DETAIL,
                slug: RouterRoutes.DATA_OBJECT_CODE_LIST_DETAIL,
                component: CodeListDetailPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_CODE_LIST_EDIT,
                slug: RouterRoutes.DATA_OBJECT_CODE_LIST_EDIT,
                component: EditCodeListPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REQUESTS_LIST,
                slug: RouterRoutes.DATA_OBJECT_REQUESTS_LIST,
                component: RequestListPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REQUESTS_DETAIL,
                slug: RouterRoutes.DATA_OBJECT_REQUESTS_DETAIL,
                component: RequestListDetailPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REQUESTS_EDIT,
                slug: RouterRoutes.DATA_OBJECT_REQUESTS_EDIT,
                component: RequestListEditPage,
            },
            {
                path: RouterRoutes.DATA_OBJECT_REQUESTS_CREATE,
                slug: RouterRoutes.DATA_OBJECT_REQUESTS_CREATE,
                component: RequestListCreatePage,
            },
            {
                path: RouterRoutes.REF_REGISTERS_LIST,
                slug: RouterRoutes.REF_REGISTERS_LIST,
                component: ReferenceRegisters,
            },
            {
                path: RouterRoutes.REF_REGISTERS_DETAIL,
                slug: RouterRoutes.REF_REGISTERS_DETAIL,
                component: RefRegistersDetail,
                subRoutes: [
                    {
                        slug: RouterRoutes.REF_REGISTERS_DETAIL,
                        component: RefRegistersInformation,
                        index: true,
                    },
                    {
                        path: RouterRoutes.HISTORY_CHANGES_OUTLET,
                        slug: RouterRoutes.HISTORY_CHANGES_OUTLET,
                        component: RefRegistersHistoryChanges,
                    },
                    {
                        path: RouterRoutes.HISTORY_OUTLET,
                        slug: RouterRoutes.HISTORY_OUTLET,
                        component: RefRegistersHistory,
                    },
                ],
            },
            {
                path: RouterRoutes.REF_REGISTERS_CREATE,
                slug: RouterRoutes.REF_REGISTERS_CREATE,
                component: RefRegistersCreate,
            },
            {
                path: RouterRoutes.REF_REGISTERS_EDIT,
                slug: RouterRoutes.REF_REGISTERS_EDIT,
                component: RefRegistersEdit,
            },
            {
                path: RouterRoutes.REF_REGISTERS_HISTORY_COMPARE_SINGLE_ITEM,
                slug: RouterRoutes.REF_REGISTERS_HISTORY_COMPARE_SINGLE_ITEM,
                component: RefRegistersCompareSinglePage,
            },
            {
                path: RouterRoutes.REF_REGISTERS_HISTORY_COMPARE_TWO_ITEMS,
                slug: RouterRoutes.REF_REGISTERS_HISTORY_COMPARE_TWO_ITEMS,
                component: RefRegistersComparePage,
            },
            {
                path: RouterRoutes.CI_PO_IS,
                slug: RouterRoutes.CI_PO_IS,
                component: POIsListPage,
            },
            {
                path: RouterRoutes.CI_PO_IS_PO,
                slug: RouterRoutes.CI_PO_IS_PO,
                component: POIsPOListPage,
            },
            {
                path: RouterRoutes.CI_PO_PO,
                slug: RouterRoutes.CI_PO_PO,
                component: POPOListPage,
            },
            {
                path: RouterRoutes.CI_PRINCIPLE_DETAIL,
                slug: RouterRoutes.CI_PRINCIPLE_DETAIL,
                component: PrincipleEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_PRINCIPLE_CREATE,
                slug: RouterRoutes.CI_PRINCIPLE_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.CI_GOAL_DETAIL,
                slug: RouterRoutes.CI_GOAL_DETAIL,
                component: GoalEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_GOAL_CREATE,
                slug: RouterRoutes.CI_GOAL_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.CI_ACTIVITY_DETAIL,
                slug: RouterRoutes.CI_ACTIVITY_DETAIL,
                component: ActivityEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_KRIS_LIST,
                slug: RouterRoutes.CI_KRIS_LIST,
                component: KRISListPage,
            },
            {
                path: RouterRoutes.CI_ACTIVITY_CREATE,
                slug: RouterRoutes.CI_ACTIVITY_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.CI_KRIS_DETAIL,
                slug: RouterRoutes.CI_KRIS_DETAIL,
                component: KrisEntityDetailPage,
                subRoutes: [
                    ...generalCiDetailOutlets,
                    {
                        path: RouterRoutes.GOALS_OUTLET,
                        slug: RouterRoutes.GOALS_OUTLET,
                        component: Goals,
                    },
                    ...generalCiDetailOutlets,
                    {
                        path: RouterRoutes.TASKS_OUTLET,
                        slug: RouterRoutes.TASKS_OUTLET,
                        component: Tasks,
                    },
                    ...generalCiDetailOutlets,
                    {
                        path: RouterRoutes.EVALUATION_OUTLET,
                        slug: RouterRoutes.EVALUATION_OUTLET,
                        component: Evaluation,
                    },
                ],
            },
            {
                path: RouterRoutes.CI_KRIS_CREATE,
                slug: RouterRoutes.CI_KRIS_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.CI_PROJECT_DETAIL,
                slug: RouterRoutes.CI_PROJECT_DETAIL,
                component: ProjectEntityDetailPage,
                subRoutes: [
                    ...generalCiDetailOutlets.filter((outlet) => outlet.path !== RouterRoutes.DOCUMENTS_OUTLET),
                    {
                        path: RouterRoutes.ACTIVITIES_OUTLET,
                        slug: RouterRoutes.ACTIVITIES_OUTLET,
                        component: ActivitiesListPage,
                    },
                    {
                        path: RouterRoutes.DOCUMENTS_OUTLET,
                        slug: RouterRoutes.DOCUMENTS_OUTLET,
                        component: ProjectDocumentsListPage,
                    },
                ],
            },
            {
                path: RouterRoutes.CI_PROJECT_CREATE,
                slug: RouterRoutes.CI_PROJECT_CREATE,
                component: CreateProjectPage,
            },
            {
                path: RouterRoutes.CI_PROJECT_EDIT,
                slug: RouterRoutes.CI_PROJECT_EDIT,
                component: EditProjectPage,
            },
            {
                path: RouterRoutes.CI_KS_DETAIL,
                slug: RouterRoutes.CI_KS_DETAIL,
                component: KsEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_KS_CREATE,
                slug: RouterRoutes.CI_KS_CREATE,
                component: CreateEntityPage,
            },
            {
                path: RouterRoutes.CI_AS_DETAIL,
                slug: RouterRoutes.CI_AS_DETAIL,
                component: AsEntityDetailPage,
                subRoutes: [generalCiDetailInformationOutlet],
            },
            {
                path: RouterRoutes.CI_AS_CREATE,
                slug: RouterRoutes.CI_AS_CREATE,
                component: CreateEntityPage,
            },
            ...generalCiRoutes,
            {
                path: '*',
                component: TodoPage,
            },
        ],
    },
]
