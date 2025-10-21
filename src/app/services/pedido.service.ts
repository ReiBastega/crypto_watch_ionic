import { Injectable } from '@angular/core';
import { Item, ItemCarrinho } from '../types/Item';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  pedido: ItemCarrinho[] =[]
  constructor() { }

  numeroSequencial = 0
  adicionarItem(item: Item){
    this.numeroSequencial = this.numeroSequencial + 1
    const novoItem = {
      id: item.id,
      idSequencial: this.numeroSequencial,
      nome:item.nome,
      preco:item.preco,
      imagem:"",
      ingredientes:item.ingredientes,
      ingredientesRemovidos: []
    }
    this.pedido.push(novoItem);
  }

  getPedido():ItemCarrinho[]{
    return this.pedido
  }

  removerItem(idASerRemovido:number){
    console.log(idASerRemovido,"id a ser removido")
    console.log(this.pedido,"this.pedido")
   this.pedido = this.pedido.filter((produto)=> produto.idSequencial != idASerRemovido)
    // forma 2 
    /*
    const novopedido = [] 
    this.pedido.forEach((produto)=>{
      if(produto.id != idASerRemovido ){
        novopedido.push(produto)
      }
    })
      */

    // forma 3
    //const novopedido = this.pedido.filter((produto)=> produto.id != idASerRemovido )
    //this.pedido = novopedido
  }





}
