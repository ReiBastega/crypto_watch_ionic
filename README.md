# Crypto Watch Ionic

Aplicativo Ionic/Angular para acompanhar mercado cripto, gerir carteira local e visualizar destaques em tempo real com dados da CoinGecko.

## Funcionalidades
- **Login local**: autenticação simples (token salvo no dispositivo).
- **Mercado**: lista top 50 moedas, busca por nome/ticker, badge de variação, botão para atualizar preços e abrir detalhes.
- **Carteira**: adiciona/edita/remove posições, calcula valor total e média 24h, cards em grid responsivo.
- **Pulse (insights)**: blocos com maiores altas/quedas, tendências 7d/30d, top volume, maior market cap, mais voláteis e moedas perto do ATH.
- **Detalhes da moeda**: preço atual, high/low 24h, market cap/volume, botão para adicionar à carteira, preço registrado na entrada e P/L calculado vs preço atual.

## Instalação e execução
1. Instale dependências: `npm install`
2. Execução web (dev): `ionic serve`

## Configuração da API
- Já configurado para CoinGecko. Endpoint: `https://api.coingecko.com/api/v3/coins/markets` com `vs_currency=usd` e `price_change_percentage=24h,7d,30d`.

## Estrutura
- `src/app/tab1`: mercado (lista, busca, adicionar a carteira).
- `src/app/tab2`: carteira (posições, edit/remove, grid responsivo).
- `src/app/tab3`: pulse/insights (tops e tendências com dados CoinGecko).
- `src/app/coin-detail`: detalhe por moeda e P/L da posição.
- `src/app/services`: integração com CoinGecko (`price.service`) e carteira local (`wallet.service`).

## Notas
- Os dados da carteira ficam em `localStorage`. Limpar storage reseta o app.
- Sem dependências externas além das libs instaladas via npm.
