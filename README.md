# Crypto Watch Ionic

Aplicativo Ionic/Angular para acompanhar mercado cripto, gerir carteira local e visualizar destaques em tempo real com dados da CoinGecko.

## Funcionalidades
- **Login local**: autenticação simples (token salvo no dispositivo).
- **Mercado**: lista top 50 moedas, busca por nome/ticker, badge de variação, botão para atualizar preços e abrir detalhes.
- **Carteira**: adiciona/edita/remove posições, calcula valor total e média 24h, cards em grid responsivo.
- **Pulse (insights)**: blocos com maiores altas/quedas, tendências 7d/30d, top volume, maior market cap, mais voláteis e moedas perto do ATH.
- **Detalhes da moeda**: preço atual, high/low 24h, market cap/volume, botão para adicionar à carteira, preço registrado na entrada e P/L calculado vs preço atual.

## Stack
- Ionic 7 / Angular
- RxJS para stream de dados
- CoinGecko API (endpoint `coins/markets`)

## Pré-requisitos
- Node.js 18+
- npm 9+
- Ionic CLI (opcional, mas recomendado): `npm install -g @ionic/cli`

## Instalação e execução
1. Instale dependências: `npm install`
2. Execução web (dev): `ionic serve`  
   - Alternativa sem CLI global: `npx ionic serve`
3. (Opcional) Build web: `npm run build`
4. (Opcional) Android/iOS: use `ionic cap` após o build (`ionic cap copy android` / `ios`) e abra o projeto nativo pelo Android Studio/Xcode.

## Configuração da API
- Já configurado para CoinGecko sem chave (pública). Endpoint: `https://api.coingecko.com/api/v3/coins/markets` com `vs_currency=usd` e `price_change_percentage=24h,7d,30d`.
- Se quiser usar proxy ou limitar requisições, ajuste em `src/app/services/price.service.ts`.

## Scripts úteis
- `npm start` / `ionic serve`: servidor de desenvolvimento.
- `npm run build`: build de produção para `www/`.
- `npm run test`: testes unitários (Karma/Jasmine, se configurado).

## Estrutura relevante
- `src/app/tab1`: mercado (lista, busca, adicionar a carteira).
- `src/app/tab2`: carteira (posições, edit/remove, grid responsivo).
- `src/app/tab3`: pulse/insights (tops e tendências com dados CoinGecko).
- `src/app/coin-detail`: detalhe por moeda e P/L da posição.
- `src/app/services`: integração com CoinGecko (`price.service`) e carteira local (`wallet.service`).

## Notas
- Os dados da carteira ficam em `localStorage`. Limpar storage reseta o app.
- Sem dependências externas além das libs instaladas via npm.
