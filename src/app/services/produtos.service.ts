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

  buscarBebidas(): Item[] {
    return [
      {
        id: 101,
        nome: "Refrigerante Lata",
        preco: 6.00,
        ingredientes: ["gelo", "limão (opcional)"],
        imagem: ""
      },
      {
        id: 102,
        nome: "Suco Natural",
        preco: 8.50,
        ingredientes: ["fruta", "água", "açúcar (opcional)"],
        imagem: ""
      },
      {
        id: 103,
        nome: "Água Mineral",
        preco: 4.00,
        ingredientes: [],
        imagem: ""
      }
    ];
  }
}
