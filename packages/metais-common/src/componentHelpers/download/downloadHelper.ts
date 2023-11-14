import { FileExtensionEnum } from '@isdd/metais-common/components/actions-over-table/actions-default/ExportButton'
export const downloadBlobAsFile = (blob: Blob, filename: string) => {
    const blobURL = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobURL
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobURL)
}

export const generateExportFileName = (entityName: string, extension: FileExtensionEnum) => {
    const date = new Date().toISOString()
    return `CI-${entityName}-${date}.${extension.toLocaleLowerCase()}`
}
