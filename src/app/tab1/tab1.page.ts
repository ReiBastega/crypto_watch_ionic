import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ProdutosService } from '../services/produtos.service';
import { PedidoService } from '../services/pedido.service';
import { Item } from '../types/Item';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  lanches = [] 
  constructor(private toastController: ToastController, 
    private produtosService: ProdutosService,
    private pedidoService:PedidoService
  ) {}

  ngOnInit(){
    this.lanches = this.produtosService.buscarLanches()
  }


  async adicionarProduto(item:Item){
    const toast = await this.toastController.create({
      message:  `${item.nome} foi adicionado ao pedido`,
      duration: 3000,
      color:'light',
      position:'bottom'
    })
    //toast.present();

    this.pedidoService.adicionarItem(item)
  }




  

}
