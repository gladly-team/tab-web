export const isClientSide = () => typeof window !== 'undefined'

export const isServerSide = () => typeof window === 'undefined'
