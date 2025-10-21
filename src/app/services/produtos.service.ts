import { Injectable } from '@angular/core';
import { Item } from '../types/Item';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  constructor() { }


  buscarLanches():Item[] {
    return [
      {
       id:1,
        nome: "Hamburguer",
        preco: 25.00,
        ingredientes: ["carne", "cebola", "picles",  "molho especial"],
        imagem:""
      },
      {
        id:2,
        nome: "Hamburguer bacon",
        preco: 30.00,
        ingredientes: ["carne", "cebola", "picles",  "molho especial"],
        imagem:""
      },
      {
        id:3,
        nome: "Hamburguer bacon",
        preco: 30.00,
        ingredientes: ["carne", "cebola", "picles",  "molho especial"],
        imagem:""
      },

    ];
  }
}
