export interface APIServerInterface{
    key: {
        href: string
    },
    name: string,
    id: number,
    slug: string
}

export interface ApiServerListInterface{
    _links: {
        self: {
            href: string
        }
    },
    realms: APIServerInterface[]
}
