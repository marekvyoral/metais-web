import path from 'path'

import { config } from 'dotenv'
import { defineConfig } from 'orval'

if (process.env.DOTENV_CONFIG_PATH) {
    config({
        path: path.resolve(__dirname, process.env.DOTENV_CONFIG_PATH),
    })
}

const defaultOutputOptions: object = {
    client: 'react-query',
    prettier: true,
    mock: JSON.parse(process.env.VITE_SWAGGER_MOCK ?? 'false') ?? false,
}

export default defineConfig({
    cmdbSwagger: {
        input: {
            override: {
                transformer: './packages/metais-common/scripts/attributesTypesTransformer.js',
            },
            target: process.env.VITE_REST_CLIENT_CMDB_SWAGGER_SWAGGER_URL ?? '',
            filters: {
                tags: [
                    'cmdb-cache-controller',
                    'cmdb-change-owner-controller',
                    'cmdb-elastic-delete-controller',
                    'cmdb-elastic-read-controller',
                    'cmdb-elastic-store-controller',
                    'cmdb-history-read-controller',
                    'cmdb-invalidate-controller',
                    'cmdb-metrics-controller',
                    'cmdb-po-controller',
                    'cmdb-read-controller',
                    'cmdb-recycle-controller',
                    'cmdb-request-tracking-controller',
                    'cmdb-rights-controller',
                    'cmdb-store-controller',
                    'cmdb-user-feedback-controller',
                    'cmdb-util-controller',
                ],
            },
        },
        output: {
            target: `./packages/metais-common/src/api/generated/cmdb-swagger.ts`,
            override: {
                operations: {
                    readCiNeighbours: {
                        query: {
                            useQuery: true,
                        },
                        mutator: {
                            path: './packages/metais-common/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForreadCiNeighboursUsingPOST',
                        },
                    },
                    getRoleParticipantBulk: {
                        mutator: {
                            path: './packages/metais-common/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForGetRoleParticipantBulkUsingPOST',
                        },
                        query: {
                            useQuery: true,
                        },
                    },
                    readConfigurationItem: {
                        mutator: {
                            path: './packages/metais-common/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadConfigurationItemUsingGET',
                        },
                    },
                    getRoleParticipant: {
                        mutator: {
                            path: './packages/metais-common/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForGetRoleParticipantUsingGET',
                        },
                    },
                    readCiNeighboursWithAllRels: {
                        mutator: {
                            path: './packages/metais-common/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadCiNeighboursWithAllRelsUsingGET',
                        },
                    },
                    readCiList_1: {
                        query: {
                            useQuery: true,
                        },
                        mutator: {
                            path: './packages/metais-common/src/api/hooks/useCmdbSwaggerClientWithTransform.ts',
                            name: 'useClientForReadCiListUsingPOST',
                        },
                    },
                },
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useCmdbSwaggerClient.ts',
                    name: 'useCmdbSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    typesRepo: {
        input: {
            target: process.env.VITE_REST_CLIENT_TYPES_REPO_SWAGGER_URL ?? '',
            filters: {
                tags: [
                    'attribute-controller',
                    'attribute-profile-controller',
                    'ci-type-controller',
                    'ci-type-relationship-type-map-controller',
                    'relationship-type-controller',
                    'rights-type-controller',
                    'query',
                ],
            },
        },
        output: {
            target: `./packages/metais-common/src/api/generated/types-repo-swagger.ts`,
            override: {
                operations: {
                    listAttrProfile_1: {
                        query: {
                            useQuery: true,
                        },
                    },
                    listTypes: {},
                },
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useTypesRepoSwaggerClient.ts',
                    name: 'useTypesRepoSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    dms: {
        input: {
            target: process.env.VITE_REST_CLIENT_DMS_SWAGGER_URL ?? '',
            filters: {
                tags: ['file-controller'], //'utils-controller'
            },
        },
        output: {
            target: `./packages/metais-common/src/api/generated/dms-swagger.ts`,
            override: {
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useDmsSwaggerClient.ts',
                    name: 'useDmsSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    enumsRepo: {
        input: {
            target: process.env.VITE_REST_CLIENT_ENUMS_REPO_SWAGGER_URL ?? '',
            filters: {
                tags: ['scheduled-jobs-controller', 'enums-controller', 'enums-item-controller'],
            },
        },
        output: {
            target: `./packages/metais-common/src/api/generated/enums-repo-swagger.ts`,
            override: {
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useEnumsRepoSwaggerClient.ts',
                    name: 'useEnumsRepoSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    userConfig: {
        input: {
            target: process.env.VITE_REST_CLIENT_USER_CONFIG_REPO_SWAGGER_URL ?? '',
            filters: {
                tags: ['favorites-columns-controller'],
            },
        },
        output: {
            target: `./packages/metais-common/src/api/generated/user-config-swagger.ts`,
            override: {
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useUserConfigSwaggerClient.ts',
                    name: 'useUserConfigSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    notificationsApi: {
        input: {
            target: process.env.VITE_REST_CLIENT_NOTIFICATION_ENGINE_SWAGGER_URL ?? '',
            filters: {
                tags: ['notification-engine-controller'],
            },
        },
        output: {
            target: `./packages/metais-common/src/api/generated/notifications-swagger.ts`,
            override: {
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useNotificationsSwaggerClient.ts',
                    name: 'useNotificationsSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    iam: {
        input: {
            target: process.env.VITE_REST_CLIENT_IAM_SWAGGER_URL ?? '',
        },
        output: {
            target: `./packages/metais-common/src/api/generated/iam-swagger.ts`,
            override: {
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useIAmSwaggerClient.ts',
                    name: 'useIAmSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    impexpCmdb: {
        input: {
            target: process.env.VITE_REST_CLIENT_IMPEXP_CMDB_SWAGGER_URL ?? '',
        },
        output: {
            target: `./packages/metais-common/src/api/generated/impexp-cmdb-swagger.ts`,
            override: {
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useImpexpCmdbSwaggerClient.ts',
                    name: 'useImpexpCmdbSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    bpmApi: {
        input: {
            target: process.env.VITE_REST_CLIENT_BPM_ENGINE_SWAGGER_URL ?? '',
            filters: {
                tags: ['task-controller'],
            },
        },
        output: {
            target: `./packages/metais-common/src/api/generated/tasks-swagger.ts`,
            override: {
                query: {
                    useQuery: true,
                },
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useTasksSwaggerClient.ts',
                    name: 'useTasksSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    codeListRepo: {
        input: {
            target: process.env.VITE_REST_CLIENT_CODELIST_REPO_SWAGGER_URL ?? '',
        },
        output: {
            target: `./packages/metais-common/src/api/generated/codelist-repo-swagger.ts`,
            override: {
                mutator: {
                    path: './packages/metais-common/src/api/hooks/useCodeListRepoSwaggerClient.ts',
                    name: 'useCodeListRepoSwaggerClient',
                },
            },
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
})
