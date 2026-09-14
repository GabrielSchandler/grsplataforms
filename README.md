# Site comercial — NewSec

Site de venda dos produtos NewSec. Não exibe preço em nenhuma página.

| Produto | Onde | Objetivo da página |
| --- | --- | --- |
| **NewSec CRM** | `/` e as cinco páginas de área | Agendar demonstração |
| **NewSec Focus** | `/focus` | Pedir o teste com a própria equipe |

Até 09/2026 marca e produto eram a mesma palavra: "NewSec" queria dizer o CRM.
Com o Focus, a marca passou a ser a casa e cada produto ganhou nome próprio —
`siteConfig.brandName` é a marca, `siteConfig.productName` é o CRM, e a lista
`produtos` (em `src/lib/site-config.ts`) alimenta o seletor do cabeçalho e as
colunas do rodapé. Acrescentar um terceiro produto é acrescentar uma linha lá.

⚠️ **O CRM não mudou de endereço.** A home, as cinco áreas e a demonstração do
CRM continuam exatamente onde estavam: a página do Focus entra ao lado, com
título, descrição, dados estruturados e imagem de compartilhamento próprios. As
duas disputam buscas diferentes — "CRM para assessoria" de um lado,
"monitoramento de produtividade" do outro.

## Por que a marca do site não é a marca de quem desenvolve

O sistema é desenvolvido pela GRS Soluções, que atua em revisão de juros. O
público comprador deste site inclui empresas do mesmo ramo — ou seja,
concorrente direto da desenvolvedora. Um comprador que percebe estar
contratando software de um concorrente desiste antes da demonstração.

Por isso o produto é vendido sob a marca própria **NewSec**, e o site não
publica a identificação da desenvolvedora. Decisão do Gabriel, 01/09/2026.

O que isso implica, na prática:

- Rodapé e dados estruturados **não** exibem mais razão social, CNPJ e
  endereço. Eles continuam em `src/lib/site-config.ts`, mas só a página de
  privacidade os consome.
- A primeira dobra não diz mais em que ramo o sistema nasceu. O argumento
  de "software testado em operação real" ficou; o segmento saiu.
- Os cursos da Academy aparecem como **Formação Comercial** e **Operação do
  CRM**, sem o sufixo GRS.

⚠️ **Três brechas seguem abertas** — ver "Pendências antes de publicar".

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
| `npm run capture` | Gera as imagens das telas e as duas imagens de Open Graph |
| `npm run capture -- --og` | Só as imagens de Open Graph, sem refotografar as telas |
| `npm run audit:layout` | Testa as 8 páginas em 1440x900, 1280x800, 768x1024 e 390x844 |

A auditoria verifica overflow horizontal, imagens carregadas, **contraste de
texto** (WCAG AA), presença das seções, um único `<h1>` por página, foco de
teclado e o FAQ funcionando sem JavaScript. Também imprime a altura de cada
página, para o inchaço voltar a ser visível antes de virar problema. Rode
depois de qualquer mudança visual.

## Pendências antes de publicar

Três coisas ainda ligam esta página à GRS. Nenhuma é resolvida no código —
todas dependem de decisão ou de cadastro externo.

| Pendência | Situação | O que fazer |
| --- | --- | --- |
| ~~Domínio~~ | **Resolvido em 01/09/2026:** `https://www.newsec.com.br`, na Vercel | — |
| **WhatsApp** | `(11) 96332-2546`, a **mesma linha do institucional da GRS** | O perfil comercial dela no WhatsApp aparece como GRS Soluções: o primeiro contato entrega a desenvolvedora. Precisa de linha própria |
| **E-mail** | Vazio — a linha some do rodapé | Criar um endereço no domínio da NewSec e preencher `NEXT_PUBLIC_EMAIL_COMERCIAL`. O anterior (`planejamento@grssolucao.com.br`) saiu porque o domínio entrega a desenvolvedora |

Além disso, **a página `/privacidade` identifica a desenvolvedora** — e não
tem como não identificar. A LGPD exige que o controlador dos dados seja
identificável, e um site que esconde isso por completo fica irregular. Hoje
ela publica razão social, CNPJ e endereço da GRS Soluções, dizendo que
NewSec é a marca sob a qual o sistema é comercializado. Se a NewSec vier a
ser constituída como empresa própria, essa seção passa a citá-la e o
conflito desaparece.

E **os cursos da Academy**: o site vende "Formação Comercial" e "Operação do
CRM", mas dentro do sistema eles se chamam "Formação Comercial GRS" e
"Operação do CRM GRS". Ou renomeia lá, ou o cliente entra e encontra nome
diferente do que foi vendido.

### O que já deu errado com o domínio

O primeiro deploy foi ao ar com o placeholder `dominio-a-definir.newsec` no
canonical, no `og:url` e em todas as URLs do sitemap, com o `robots.txt`
liberando o rastreamento. Canonical apontando para um host inexistente diz
ao buscador que o endereço verdadeiro é outro, e isso derruba a indexação
do domínio que serve a página.

Por isso o domínio de produção agora é o **padrão do código**, não só uma
variável da Vercel: build sem a variável definida voltaria a publicar o
endereço errado.

Toda mensagem de WhatsApp começa com `NewSec (CRM) —`, para o comercial
reconhecer que o lead veio do site de software e não do revisional.

Para sobrescrever qualquer valor, copie `.env.example` para `.env.local`.
Como o build é estático, mudar variável exige refazer o build.

## Arquitetura das páginas

A home resume e encaminha; a profundidade mora em cinco páginas de área, que
espelham as cinco áreas de trabalho do próprio sistema. **Nada é repetido nos
dois lugares** — conteúdo duplicado divide a força de busca e obriga a manter
a mesma frase em dois arquivos.

| Página | Altura em 1440px | Assunto |
| --- | --- | --- |
| `/` | ~11.600px | Promessa, demo, problema, jornada guiada, índice das áreas, implantação, FAQ |
| `/focus` | ~11.400px | Promessa, números, painel navegável, leituras, celular, coleta, implantação, acessos, teste, FAQ |
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
   documentos gerados pela simulação. A tela ativa fica na URL
   (`?tela=esteira-juridica`), para o comercial mandar ao lead o endereço
   de uma tela específica em vez de "abre o site e clica na terceira aba".
   Mesmo padrão do tour guiado, que já aceitava `?passo=14`.
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

## A réplica do NewSec Focus

A página `/focus` traz o painel do Focus **funcionando**, e não uma captura:
barra lateral clicável, troca de período, filtro por equipe, tabela ordenável,
detalhe de uma pessoa e classificação de aplicativo com o índice recalculando
na hora. No celular, a mesma réplica assume o layout de aplicativo do produto,
com as abas de baixo.

Fica em `src/components/focus/demo/`:

| Arquivo | O que faz |
| --- | --- |
| `dados.ts` | Empresa, 18 pessoas em 4 equipes, ferramentas, estações e eventos — tudo fictício |
| `motor.ts` | Simula dia a dia e agrega como o painel agrega (período, equipe, pessoa, estação) |
| `vivo.ts` | Atividade agora, estações, diário de bordo e registros minuto a minuto |
| `estado.tsx` | Estado da demonstração: tela, período, filtros e classificações |
| `kit.tsx`, `graficos.tsx`, `tabelas.tsx`, `kpis.tsx`, `filtros.tsx` | As primitivas do painel, refeitas |
| `telas.tsx`, `casca.tsx` | As nove telas e a casca (barra lateral, topo, avisos) |
| `tour-focus.tsx`, `painel-focus.tsx`, `sistema-focus.tsx` | Tour guiado, exploração livre e o alternador entre os dois |

Três decisões que valem registro:

- **Nada de relógio nem de sorteio.** O "agora" é fixo (28/08/2026, 16h40) e a
  variação vem de um hash da chave (pessoa + dia + medida). O HTML sai do build
  e o navegador calcula o mesmo número — senão a hidratação quebra (erro #418).
- **Sem Recharts.** O painel usa a biblioteca; aqui os três gráficos são SVG
  feito à mão, com a mesma leitura. Mais de 100 kB numa página que já carrega a
  réplica inteira não se justificava.
- **A frase de conformidade da LGPD não foi copiada.** O painel escreve "Coleta
  em conformidade com a LGPD" na barra lateral; a réplica escreve o que o
  agente faz ("Coleta só metadados de uso. Sem conteúdo digitado nem captura de
  tela."). A regra do site contra selo vale também dentro da tela demonstrativa
  — e o produto deveria adotar a mesma frase.

O conteúdo da página fica em `src/content/focus.ts`, com um cabeçalho listando
o que a página **não** diz e por quê.

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
  `@media (prefers-reduced-motion: no-preference)`**, e há um `<noscript>`
  no `<head>` que o neutraliza. As duas coisas são necessárias, e por muito
  tempo só a primeira existia.

  A média cobre quem **pediu** menos movimento. Não cobre JavaScript
  bloqueado, quebrado ou ainda não carregado — que é justamente quando o
  problema acontece. Medido antes da correção, com JS desativado e
  preferência de movimento normal: **1.325 palavras invisíveis na home**,
  630 em `/comercial`, 570 em `/gestao`, 371 em `/juridico`. Texto que
  existe no HTML, que o leitor não vê, porque o observador que devolveria
  a opacidade nunca rodou.

  Regra prática: se a revelação depende de JS, o estado escondido precisa
  de uma saída que não dependa de JS.

Feito à mão em vez de biblioteca: custa cerca de 1 kB no bundle, contra os
~40 kB de uma biblioteca de animação.

## Estado que vem da URL, sem quebrar a hidratação

`?passo=14` e `?tela=esteira-juridica` precisam valer já na primeira pintura
— ver a etapa 1 piscar antes da etapa pedida denuncia o truque. Mas o HTML
é gerado no build, sem saber a URL de quem vai visitar: ler
`window.location` **durante a renderização** faz o cliente desenhar algo
diferente do que o servidor gerou, e o React descarta a árvore e renderiza
tudo de novo. É o erro #418, e ele existia em `/?passo=9` desde que o link
por etapa foi criado.

A saída é `useLayoutEffect`, embrulhado em `useAntesDaPintura`
(`src/lib/use-antes-da-pintura.ts`): servidor e cliente desenham a mesma
coisa na primeira passada, e a correção pela URL entra depois da hidratação
e **antes da pintura**. Medido: em `/?passo=9`, aos 350ms a etapa 9 já está
ativa, sem passar pela etapa 1.

Regra: componente que lê a URL, o `localStorage`, o tamanho da janela ou o
relógio começa com o mesmo valor que o build gerou, e corrige em
`useAntesDaPintura`.

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

Publicado em **https://www.newsec.com.br**. Push no `main` republica.
