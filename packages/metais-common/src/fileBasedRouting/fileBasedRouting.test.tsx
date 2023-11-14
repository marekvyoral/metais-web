import React from 'react'
import { test, expect } from 'vitest'
import { Route } from 'react-router-dom'

import { calcNestedPath, parseSlugFromFilePath, reduceAllFilePathsByNumberOfSlash } from './fileBasedRoutesHelpers'
import { constructRouteWithParent, constructRouteObject } from './fileBasedRouting'

const globExports = {
    '../pages/DevTestScreen.tsx': {
        DevTestScreen: () => {
            return <></>
        },
    },
    '../pages/Home.tsx': {
        Home: () => {
            return <></>
        },
    },
    '../pages/notifications/index.tsx': {
        default: () => {
            return <></>
        },
    },
    '../pages/project/[id].tsx': {
        default: () => {
            return <></>
        },
    },
    '../pages/projekt/index.tsx': {
        default: () => {
            return <></>
        },
    },
    '../pages/ci/[entityName]/[entityId].tsx': {
        default: () => {
            return <></>
        },
    },
    '../pages/ci/[entityName]/[entityId]/form.tsx': {
        default: () => {
            return <></>
        },
    },
}

const pages = {
    '../pages/DevTestScreen.tsx': {
        Component: () => {
            return <></>
        },
        indexComponent: undefined,
    },
    '../pages/notifications/index.tsx': {
        Component: () => {
            return <></>
        },
        indexComponent: undefined,
    },
    '../pages/Home.tsx': {
        Component: () => {
            return <></>
        },
        indexComponent: undefined,
    },
    '../pages/roles/index.tsx': {
        Component: () => {
            return <></>
        },
        indexComponent: undefined,
    },
    '../pages/project/[id].tsx': {
        Component: () => {
            return <></>
        },
        indexComponent: undefined,
    },
    '../pages/projekt/index.tsx': {
        Component: () => {
            return <></>
        },
        indexComponent: undefined,
    },
    '../pages/ci/[entityName]/[entityId].tsx': {
        Component: () => {
            return <></>
        },
        indexComponent: undefined,
    },
    '../pages/ci/[entityName]/[entityId]/form.tsx': {
        Component: () => {
            return <></>
        },
        indexComponent: undefined,
    },
}

test('reduce all file paths by number of slashes', () => {
    const paths = [
        '../pages/DevTestScreen.tsx',
        '../pages/Home.tsx',
        '../pages/roles/index.tsx',
        '../pages/project/[id].tsx',
        '../pages/project/project-dashboard/[projektId].tsx',
        '../pages/project/project-dashboard/index.tsx',
        '../pages/project/project-dashboard/project-dashboard-help/[projektId].tsx',
        '../pages/projekt/index.tsx',
        '../pages/notifications/index.tsx',
    ]

    const groupedFilePathBySlash = reduceAllFilePathsByNumberOfSlash(paths)

    const expectedmap = new Map([
        [2, ['../pages/DevTestScreen.tsx', '../pages/Home.tsx']],
        [3, ['../pages/project/[id].tsx', '../pages/projekt/index.tsx', '../pages/notifications/index.tsx']],
        [4, ['../pages/project/project-dashboard/[projektId].tsx', '../pages/project/project-dashboard/index.tsx']],
        [5, ['../pages/project/project-dashboard/project-dashboard-help/[projektId].tsx']],
    ])
    expect(groupedFilePathBySlash).toEqual(expectedmap)
})

test('reduce all file paths by number of slashes', () => {
    const paths: never[] | string[] = []

    const groupedFilePathBySlash = reduceAllFilePathsByNumberOfSlash(paths)

    const expectedmap = new Map()
    expect(groupedFilePathBySlash).toEqual(expectedmap)
})

test('reduce all file paths by number of slashes', () => {
    const paths = ['test1', 'test2', 'test3']

    const groupedFilePathBySlash = reduceAllFilePathsByNumberOfSlash(paths)

    const expectedmap = new Map([[0, ['test1', 'test2', 'test3']]])
    expect(groupedFilePathBySlash).toEqual(expectedmap)
})

test('construct route object', () => {
    const filePath = '../pages/project/[id].tsx'
    const slug = '/project/:id'

    const globExport = pages[filePath]
    const Component = globExport?.Component
    const paths = Object.keys(globExports)?.filter((key) => key?.endsWith('.tsx'))
    const pathsGroupedByLevel = reduceAllFilePathsByNumberOfSlash(paths)
    const parentFilePathsOnUpperLevels = pathsGroupedByLevel?.get(2)
    const routePath = calcNestedPath(slug, parentFilePathsOnUpperLevels ?? [])
    const constructedRouteObject = constructRouteObject({
        slug: routePath,
        Component,
        ParentComponent: undefined,
        parentFilePath: undefined,
    })

    const expectedOutput = <Route key={slug} path={'/project/:id'} element={<Component />} />

    expect(constructedRouteObject).toEqual(expectedOutput)
})

test('construct route with parent', () => {
    const filePath = '../pages/ci/[entityName]/[entityId].tsx'
    const slug = '/ci/:entityName/:entityId'
    const paths = Object.keys(globExports)?.filter((key) => key?.endsWith('.tsx'))
    const pathsGroupedByLevel = reduceAllFilePathsByNumberOfSlash(paths)

    const globExport = pages[filePath]
    const Component = globExport?.Component
    const parentFilePathsOnUpperLevels = pathsGroupedByLevel?.get(2)
    const routePath = calcNestedPath(slug, parentFilePathsOnUpperLevels ?? [])

    const constructedRouteObject = constructRouteObject({
        slug: routePath,
        Component,
        ParentComponent: undefined,
        parentFilePath: undefined,
    })

    const finalRouteElement = constructRouteWithParent({
        level: 3,
        pathsGroupedByLevel,
        slug,
        globExports: pages,
        constructedRouteObject,
    })

    const expectedOutput = <Route key={slug} path={'/ci/:entityName/:entityId'} element={<Component />} />

    expect(finalRouteElement).toEqual(expectedOutput)
})

test('construct route with parent 2', () => {
    const filePath = '../pages/ci/[entityName]/[entityId]/form.tsx'
    const slug = '/ci/:entityName/:entityId/form'
    const paths = Object.keys(globExports)?.filter((key) => key?.endsWith('.tsx'))
    const pathsGroupedByLevel = reduceAllFilePathsByNumberOfSlash(paths)

    const globExport = pages[filePath]
    const Component = globExport?.Component
    const parentFilePathsOnUpperLevels = pathsGroupedByLevel?.get(4)
    const routePath = calcNestedPath(slug, parentFilePathsOnUpperLevels ?? [])
    const constructedRouteObject = constructRouteObject({
        slug: routePath,
        Component,
        ParentComponent: undefined,
        parentFilePath: undefined,
    })
    const finalRouteElement = constructRouteWithParent({
        level: 5,
        pathsGroupedByLevel,
        slug,
        globExports: pages,
        constructedRouteObject,
    })

    const expectedOutput = <Route key={'form'} path={'form'} element={<Component />} />

    expect(finalRouteElement).toEqual(expectedOutput)
})

test('parse slug', () => {
    const slug = parseSlugFromFilePath('../pages/DevTestScreen.tsx')
    const expectedOutput = 'DevTestScreen'
    expect(slug).toEqual(expectedOutput)
})

test('parse slug', () => {
    const slug = parseSlugFromFilePath('../pages/notifications/index.tsx')
    const expectedOutput = 'notifications/'
    expect(slug).toEqual(expectedOutput)
})

test('parse index slug', () => {
    const slug = parseSlugFromFilePath('../pages/ci/index.tsx')
    const expectedOutput = 'ci/'
    expect(slug).toEqual(expectedOutput)
})

test('parse detail slug', () => {
    const slug = parseSlugFromFilePath('../pages/ci/[entityName]/[entityId]/form.tsx')
    const expectedOutput = 'ci/:entityName/:entityId/form'
    expect(slug).toEqual(expectedOutput)
})

test('parse empty path', () => {
    expect(() => parseSlugFromFilePath('')).toThrow('unexpected react file path')
})
