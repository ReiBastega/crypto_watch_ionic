import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ProdutosService } from '../services/produtos.service';
import { PedidoService } from '../services/pedido.service';
import { Item } from '../types/Item';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  bebidas = []

  constructor(
    private toastController: ToastController,
    private produtosService: ProdutosService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit() {
    this.bebidas = this.produtosService.buscarBebidas();
  }

  async adicionarProduto(item: Item) {
    const toast = await this.toastController.create({
      message: `${item.nome} foi adicionado ao pedido`,
      duration: 3000,
      color: 'light',
      position: 'bottom'
    });
    // toast.present();

    this.pedidoService.adicionarItem(item);
  }
}
