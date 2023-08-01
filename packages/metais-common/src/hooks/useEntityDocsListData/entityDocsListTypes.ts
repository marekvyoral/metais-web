export interface IDocument {
    uuid: string
    status: string
    version: string
    mimeType: string
    encoding: string | null
    filename: string
    contentLength: number
    created: string
    createdBy: string
    lastModified: string
    lastModifiedBy: string
}
