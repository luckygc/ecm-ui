export interface Props {
    capApiEndpoint: string
}

export interface Emits {
    (event: 'solve', token: string): void
    (event: 'close'): void
}