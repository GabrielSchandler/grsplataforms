# Site comercial — GRS Plataforma

Página de venda do sistema de operação desenvolvido pela GRS Soluções.
Objetivo único da página: agendar demonstração. Não exibe preço.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build estático em `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run capture` | Gera as imagens das telas e a imagem de Open Graph |
| `npm run audit:layout` | Testa as 7 páginas em 1440x900, 1280x800, 768x1024 e 390x844 |

A auditoria verifica overflow horizontal, imagens carregadas, **contraste de
texto** (WCAG AA), presença das seções, um único `<h1>` por página, foco de
teclado e o FAQ funcionando sem JavaScript. Também imprime a altura de cada
página, para o inchaço voltar a ser visível antes de virar problema. Rode
depois de qualquer mudança visual.

## Dados da empresa e contato

Já estão configurados como padrão em `src/lib/site-config.ts`, então o site
funciona sem nenhum `.env`:

| Item | Valor |
| --- | --- |
| WhatsApp comercial do CRM | (11) 96332-2546 |
| E-mail | planejamento@grssolucao.com.br |
| CNPJ | 63.562.890/0001-45 |
| Sede | R. Evangelina, 321 — Vila Carrão, São Paulo/SP |

CNPJ e endereço vieram do site institucional já publicado
(`GRS_INSTITUCIONAL2/lib/content.js`), para que a mesma empresa não apareça
com identificação diferente em dois sites.

O WhatsApp do CRM é **o mesmo número do institucional** desde 31/08/2026,
quando a linha anterior da GRS foi banida e todos os sites foram unificados
no (11) 96332-2546. Toda mensagem começa com `GRS Plataforma (CRM) —`, para o
comercial reconhecer que o lead veio do site de software, e não do revisional.

Para sobrescrever qualquer um desses valores, copie `.env.example` para
`.env.local`. Como o build é estático, mudar variável exige refazer o build.

## Arquitetura das páginas

A home resume e encaminha; a profundidade mora em cinco páginas de área, que
espelham as cinco áreas de trabalho do próprio sistema. **Nada é repetido nos
dois lugares** — conteúdo duplicado divide a força de busca e obriga a manter
a mesma frase em dois arquivos.

| Página | Altura em 1440px | Assunto |
| --- | --- | --- |
| `/` | ~11.000px | Promessa, demo, problema, jornada guiada, índice das áreas, implantação, FAQ |
| `/comercial` | ~9.200px | Leads, pipeline, cliente, simulação, documentos gerados, painel |
| `/gestao` | ~6.000px | Ambiente, permissões, segurança, backup, implantação |
| `/juridico` | ~5.800px | Esteira configurável, e-mail, cobranças, portal do cliente |
| `/financeiro` | ~4.200px | Lançamentos, chargebacks, metas e comissões |
| `/academy` | ~3.800px | Trilhas de treinamento e acompanhamento |

A primeira versão era **uma página de 21.900px**, cerca de 24 telas de
rolagem. Ela tentava atender três leitores ao mesmo tempo — o visitante frio
de anúncio, o avaliador e o decisor técnico — e não servia bem nenhum.

`npm run audit:layout` imprime a altura de cada página a cada execução, para
que o inchaço volte a ser visível antes de virar problema.

## Como o conteúdo é organizado

- `src/content/site.ts` — texto da **home**.
- `src/content/areas.ts` — texto das **cinco páginas de área**. Adicionar uma
  área aqui já a inclui no menu, no rodapé, no índice da home e no sitemap;
  falta só criar a pasta da rota em `src/app/<slug>/`.
- `src/lib/site-config.ts` — dados da empresa e o que vem de ambiente.
- `src/components/sections/` — as seções da home, em ordem de leitura.
- `src/components/site/` — cabeçalho, rodapé, formulário, barra fixa do
  celular, página de área e primitivas visuais.

## As telas do produto

As telas demonstrativas são **componentes React**, em
`src/components/demo/`, e não capturas do sistema em produção. Os dados vêm
de `src/components/demo/data.ts` e são inteiramente fictícios: empresa,
consultores e clientes inventados, CPF mascarado e telefones em faixa
inexistente.

Os mesmos componentes servem a três usos, então réplica e imagem nunca
divergem:

1. **Réplica navegável por área**, embutida em `/comercial`, `/juridico`,
   `/financeiro` e `/gestao`. A barra lateral é clicável e troca a tela dentro
   da própria página.
2. **Demo com abas** na home, cobrindo as telas de destaque e os dois
   documentos gerados pela simulação.
3. **Imagens estáticas** onde a tela não é navegável, geradas por
   `npm run capture`.

O que decide entre réplica e imagem é `DemoNavContext`: quando existe um
provedor, a barra lateral assume a área, marca o item ativo e entrega o
clique; sem provedor — nas rotas de captura — ela continua estática, como uma
fotografia. Mesmo componente, dois comportamentos.

O menu da réplica lista **apenas itens que têm tela construída**. Item de
menu que não leva a lugar nenhum frustra mais do que a lista curta incomoda.

As colunas de Documentos, Usuários, Backups e Logs foram lidas das tabelas do
próprio CRM, não inventadas. A esteira jurídica mostrada é um exemplo montado
para o site: o processo real de qualquer empresa é configurado dentro do
sistema, e não foi publicado aqui.

### Nada de imagem de UI gerada por IA

Telas de produto **não** são geradas por modelo de imagem. Um gerador produz
uma interface plausível e falsa, que não corresponde ao sistema que o cliente
vai receber — e um comprador que reconhece a diferença perde a confiança no
resto da página. A réplica em HTML sai do código, é fiel e ainda por cima
navegável. Modelo de imagem serve para fotografia e cena, não para UI.

### Como a captura funciona

`npm run capture` faz um build com `CAPTURE=1`, que habilita as rotas
`/capturas/[id]`, serve o resultado localmente, fotografa cada tela com o
Chrome instalado na máquina (sem baixar o Chromium do Playwright) e refaz o
build de produção no fim. As rotas de captura usam a extensão
`.capture.tsx`, que só entra no roteamento quando `CAPTURE=1` — no site
publicado elas não existem.

O script também escreve `src/content/screenshot-sizes.json` com as dimensões
finais e um **borrão base64 de 16px** por imagem. As dimensões reservam o
espaço para a página não saltar; o borrão aparece no primeiro quadro e some
quando a imagem chega, em vez de deixar um retângulo vazio.

Só entram na captura as telas que aparecem como imagem em alguma página — as
demais existem apenas dentro da réplica navegável, renderizadas ao vivo.
Imagem órfã é peso no repositório sem uso, então o script apaga sozinho os
arquivos de telas que saíram da lista.

Antes de abrir o navegador, ele confere que o build realmente exportou as
rotas de captura. Sem essa checagem, um erro de configuração aparecia lá na
frente como "timeout esperando #alvo", que não diz nada sobre a causa.

### Por que existe `.next-tooling`

`npm run capture` e `npm run audit:layout` rodam `next build` por conta
própria. Se escrevessem na mesma pasta `.next` que o `next dev` usa, o
servidor de desenvolvimento cairia no meio do trabalho e passaria a responder
500 sem explicação — o que aconteceu de verdade aqui. Por isso eles constroem
em `.next-tooling`, via `BUILD_TARGET=tooling`.

⚠️ O `npm run build` normal continua usando `.next`. Rodá-lo com o servidor de
desenvolvimento aberto derruba o servidor; isso é comportamento padrão do
Next, e a saída é fechar o servidor, apagar `.next` e subir de novo.

## Movimento

Há um sistema, não efeitos avulsos: **uma curva de aceleração
(`--ease-out-quint`), uma duração-base (`--dur-base`) e um atraso escalonado**,
aplicados em tudo. O que dá sensação de produto caro não é a quantidade de
efeitos — é todos se moverem com a mesma assinatura.

As primitivas estão em `src/components/motion/motion.tsx`: `Reveal` (quatro
variantes), `ScrollProgress`, `Spotlight`, `ParallaxLayer` e `Seam`. A rolagem
guiada da jornada fica em `src/components/sections/journey-scroll.tsx`.

Duas regras que valem para qualquer efeito novo:

- **Só `transform`, `opacity`, `clip-path` e `filter`.** Nada que force
  recálculo de layout durante a rolagem. Leituras de scroll ficam agrupadas em
  `requestAnimationFrame`, e há um único `IntersectionObserver` compartilhado.
- **O estado inicial escondido mora dentro de
  `@media (prefers-reduced-motion: no-preference)`.** Quem pede menos
  movimento vê a página pronta mesmo que o JavaScript não execute — página que
  depende de JS para revelar texto fica em branco quando algo falha.

Feito à mão em vez de biblioteca: custa cerca de 1 kB no bundle, contra os
~40 kB de uma biblioteca de animação.

## Regras de conteúdo que foram seguidas

Nenhuma afirmação sobre o produto entrou na página sem existir no código do
sistema. Em particular:

- **White label** é a logo e o nome da empresa cliente dentro do sistema.
  Não há personalização de cores por empresa, e a página não promete isso.
- **Sete dias de restauração** e **backup diário automático** vieram da
  configuração real do CRM, não de estimativa.
- Nenhum número de cliente, usuário ou faturamento aparece, porque nenhum foi
  confirmado.
- A seção de segurança descreve controles implementados e usa "desenvolvido
  com controles alinhados à proteção e governança de dados". Não afirma
  conformidade absoluta nem cita certificação.
- **A palavra "multiempresa" não aparece.** O comprador não deve perceber o
  sistema como ambiente compartilhado, e sim como o ambiente da empresa dele,
  administrado por ele. O isolamento de dados continua sendo argumento, mas
  dito do ponto de vista de quem compra: "ambiente exclusivo da sua empresa,
  com isolamento aplicado no próprio banco".
- **Nenhuma instituição financeira real** aparece nos exemplos. O material
  demonstrativo trata de juros abusivos; citar um banco de verdade num site
  aberto é risco jurídico sem contrapartida. A financeira dos exemplos é
  inventada.
- **A cláusula de garantia do contrato da GRS ficou de fora.** É política
  comercial da GRS com o cliente final, e o público deste site inclui
  concorrente direto dela.
- Os números dos exemplos **fecham entre si** (parcela × quantidade,
  diferença mensal, economia total, quitação). Comprador de software confere
  conta, e exemplo que não bate derruba a credibilidade da tela inteira.

## Política de privacidade e medição

A página `/privacidade` descreve o que este site faz de fato: como ele é
estático e o formulário abre o WhatsApp do próprio visitante, não há coleta
em servidor nosso. O texto está em `src/content/privacidade.ts`.

**Ela precisa de revisão jurídica antes de publicar**, e do nome do
encarregado de dados quando a GRS designar um.

A medição (GA4) só é carregada quando `NEXT_PUBLIC_ANALYTICS_ID` está
definido — sem a variável, o site não carrega script de terceiro nem grava
cookie. Atenção: cookie de medição não é essencial ao funcionamento do site,
então a LGPD pede consentimento. **Não há banner de consentimento neste
projeto** — se a medição for ativada, ele precisa ser construído antes.

## Publicação

**Vercel**, decidido. O build é estático (`output: export`), que a Vercel
serve direto — sem função serverless, sem custo de execução.

Domínio ainda não definido. O padrão está em
`https://plataforma.grssolucao.com.br`, subdomínio do domínio que a GRS já
tem. Se for outro, mude `NEXT_PUBLIC_SITE_URL` **antes** do primeiro deploy:
esse valor entra no canonical, no Open Graph e no sitemap, e publicar com o
endereço errado ensina o endereço errado ao Google.

Nenhum deploy foi feito.
