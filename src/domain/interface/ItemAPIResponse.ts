export interface ItemAPIResponse{
    description: string,
    id: number,
    name: string,
    media: {
        id: number,
        key: {
            href: string
        }
    }
}