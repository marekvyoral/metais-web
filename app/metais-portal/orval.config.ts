import { defineConfig } from 'orval'
const paths = ['./iam-swagger.json', './userconfig-swagger.json'] // add swagger paths

const getSwaggerName = (swaggerFilePath: string) => {
    return swaggerFilePath?.replace(/\.\/|\.json$/g, '')
}

const createMultipleConfigs = () => {
    return paths?.map((path) => {
        const swaggerName = getSwaggerName(path)
        return {
            input: {
                target: path,
            },
            output: {
                target: `./src/generated/${swaggerName}.ts`,
                client: 'react-query',
                prettier: true,
                override: {
                    mutator: {
                        path: './src/hooks/use-custom-client.ts',
                        name: 'useCustomClient',
                    },
                },
            },
            hooks: {
                afterAllFilesWrite: 'prettier --write',
            },
        }
    })
}

const computedConfig = createMultipleConfigs()

export default defineConfig(computedConfig)
