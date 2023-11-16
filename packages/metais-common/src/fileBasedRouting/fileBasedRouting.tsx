import React from 'react'
import { Route } from 'react-router-dom'

import {
    reduceAllFilePathsByNumberOfSlash,
    getIndexFilePaths,
    getIndexRouteComponents,
    globImportedComponent,
    parseSlugFromFilePath,
    RouteConstructOptions,
    ConstructRouteWithParentInputs,
    RouteLevelConstruction,
    FileBasedPages,
    getIndexRouteComponent,
    ModuleExport,
    checkIfExportOnFilePathIsReactComponent,
    calcNestedPath,
    INDEX_ROUTE,
} from './fileBasedRoutesHelpers'
import ProtectedRoute from './ProtectedRoute'

export const constructRouteWithParent = ({
    level,
    pathsGroupedByLevel,
    slug,
    globExports,
    constructedRouteObject,
}: ConstructRouteWithParentInputs) => {
    const minSlashCount = Math.min(...Array.from(pathsGroupedByLevel.keys()))
    while (level > minSlashCount) {
        level -= 1
        const parentPaths = pathsGroupedByLevel?.get(level)
        const removedFileNameFromRoutePath = slug?.substring(0, slug?.lastIndexOf('/'))
        // console.log('removedFileNameFromRoutePath', removedFileNameFromRoutePath)
        const foundParentFilePath = parentPaths?.find((parentFilePath: string) => {
            const transformedParentFilePath = parseSlugFromFilePath(parentFilePath)
            return transformedParentFilePath.includes(removedFileNameFromRoutePath)
        })
        if (foundParentFilePath) {
            const path = parseSlugFromFilePath(foundParentFilePath)
            const Component = globImportedComponent(globExports[foundParentFilePath], 'Component')
            if (constructedRouteObject?.key !== path) {
                constructedRouteObject = (
                    <Route path={path} key={path} element={<Component />}>
                        {constructedRouteObject}
                    </Route>
                )
                console.log(`---PREDOSLY ROUTE TREBA OBALIT: <Route path={${path}} key={${path}} element={<${Component?.name} />}>{...}</Route>`)
            }
        }
    }
    return constructedRouteObject
}

export const constructRouteObject = ({ slug, Component, ParentComponent, parentFilePath }: RouteConstructOptions) => {
    if (ParentComponent) {
        const parentSlug = parseSlugFromFilePath(parentFilePath ?? '')
        console.log('PARENT')
        console.log(`<Route path={${parentSlug}} key={${parentSlug}} element={<${ParentComponent?.name} />}>`)
        console.log(`   <Route element={<ProtectedRoute element={<${Component?.name} />} slug={${slug}} />} key={${slug}} index />`)
        console.log(`</Route>`)
        return (
            <Route path={parentSlug} key={parentSlug} element={<ParentComponent />}>
                <Route element={<ProtectedRoute element={<Component />} slug={slug} />} key={slug} index />
            </Route>
        )
    } else {
        console.log(
            `<Route path={${slug === '' ? INDEX_ROUTE : slug}} element={<ProtectedRoute element={<${
                Component?.name
            } />} slug={${slug}} />} key={${slug}} />`,
        )
        return <Route path={slug === '' ? INDEX_ROUTE : slug} element={<ProtectedRoute element={<Component />} slug={slug} />} key={slug} />
    }
}

const constructAllRoutesPerSlashLevel = ({ pathsGroupedByLevel, globExports, level }: RouteLevelConstruction) => {
    // console.log('pathsGroupedByLevel', pathsGroupedByLevel)
    // console.log('globExports', globExports)
    // console.log('level', level)
    const filePathsOnLevel = pathsGroupedByLevel.get(level) ?? []
    // console.log('filePathsOnLevel', filePathsOnLevel)
    const indexFilePathsOnLevel = getIndexFilePaths(filePathsOnLevel, globExports)
    const indexRouteComponentsOnLevel = getIndexRouteComponents(globExports, indexFilePathsOnLevel)

    const test = filePathsOnLevel?.map((filePath: string) => {
        // console.log('filePath', filePath)
        const slug = parseSlugFromFilePath(filePath)
        // console.log('slug', slug)
        const parentFilePathsOnUpperLevels = pathsGroupedByLevel?.get(level - 1)
        // console.log('parentFilePathsOnUpperLevels', parentFilePathsOnUpperLevels)
        const routePath = calcNestedPath(slug, parentFilePathsOnUpperLevels ?? [])
        // console.log('routePath', routePath)
        console.log('filePath', filePath)
        const Component = globExports[filePath].Component
        const indexOfParentComponent = indexRouteComponentsOnLevel?.indexOf(Component)
        console.log('indexRouteComponentsOnLevel', indexRouteComponentsOnLevel)
        console.log('indexOfParentComponent', indexOfParentComponent)
        const ParentComponent = globExports[indexFilePathsOnLevel[indexOfParentComponent]]?.Component
        const parentFilePath = indexFilePathsOnLevel[indexOfParentComponent]

        const constructedRouteObject = constructRouteObject({
            slug: routePath,
            Component,
            ParentComponent,
            parentFilePath,
        })

        const constructedRouteWithParents = constructRouteWithParent({
            slug,
            level,
            constructedRouteObject,
            pathsGroupedByLevel,
            globExports,
        })
        return constructedRouteWithParents
    })
    return test
}

export const computeRoutes = (globExports: FileBasedPages) => {
    const tsxFilePaths = Object.keys(globExports)
    // console.log('tsxFilePaths', tsxFilePaths)
    const pathsGroupedByLevel = reduceAllFilePathsByNumberOfSlash(tsxFilePaths)
    const levels = Array.from(pathsGroupedByLevel.keys())?.sort((a, b) => a - b)
    // console.log('levels', levels)
    // console.log('pathsGroupedByLevel', pathsGroupedByLevel)
    const routes =
        levels?.flatMap((level) => {
            // console.log('level', level)
            const allConstructedRoutesInLevel = constructAllRoutesPerSlashLevel({
                pathsGroupedByLevel,
                globExports: globExports,
                level,
            })
            // console.log('allConstructedRoutesInLevel', allConstructedRoutesInLevel)
            return allConstructedRoutesInLevel
        }) ?? []

    // console.log('routes', routes)

    return routes
}

export const globRoutes = (globExports: { [filePath: string]: unknown }) => {
    const tsxFilePaths = Object.keys(globExports)?.filter((key) => key?.endsWith('.tsx'))
    const pages: FileBasedPages = {}

    tsxFilePaths
        ?.filter((tsxFilePath) => checkIfExportOnFilePathIsReactComponent(tsxFilePath, globExports))
        ?.forEach((filePath) => {
            const slug = parseSlugFromFilePath(filePath)
            const globExportOfFile = globExports[filePath] as ModuleExport
            const exportedComponent = globImportedComponent(globExportOfFile, slug)
            const indexChildComponent = getIndexRouteComponent(globExportOfFile)
            pages[filePath] = { Component: exportedComponent, indexComponent: indexChildComponent }
        })
    console.log('pages', pages)
    return computeRoutes(pages)
}
