export type ItemCarrinho = {
    id: number
    idSequencial: number
    nome: string
    preco: number
    imagem:string
    ingredientesRemovidos:string[]
    ingredientes: string[]
}

export type Item = {
    id: number
    nome: string
    preco: number
    imagem:string
    ingredientes: string[]
}