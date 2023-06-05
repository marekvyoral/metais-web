import path from 'path'

import dotenv from 'dotenv'
import { defineConfig } from 'orval'

if (process.env.DOTENV_CONFIG_PATH) {
    dotenv.config({
        path: path.resolve(__dirname, process.env.DOTENV_CONFIG_PATH),
    })
}

const defaultOutputOptions: object = {
    client: 'react-query',
    prettier: true,
    mock: JSON.parse(process.env.VITE_SWAGGER_MOCK ?? 'false') ?? false,
    override: {
        mutator: {
            path: './app/metais-portal/src/api/hooks/use-custom-client.ts',
            name: 'useCustomClient',
        },
    },
}

export default defineConfig({
    cmdbSwagger: {
        input: {
            target: process.env.VITE_CMDB_SWAGGER_API_ENDPOINT ?? '',
        },
        output: {
            target: `./app/metais-portal/src/api/generated/cmdb-swagger.ts`,
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    typesRepo: {
        input: {
            target: process.env.VITE_TYPES_REPO_SWAGGER_API_ENDPOINT ?? '',
        },
        output: {
            target: `./app/metais-portal/src/api/generated/types-repo-swagger.ts`,
            ...defaultOutputOptions,
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
})
