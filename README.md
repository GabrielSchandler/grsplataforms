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
| `npm run audit:layout` | Testa a página em 1440x900, 1280x800, 768x1024 e 390x844 |

## Dados da empresa e contato

Já estão configurados como padrão em `src/lib/site-config.ts`, então o site
funciona sem nenhum `.env`:

| Item | Valor |
| --- | --- |
| WhatsApp comercial do CRM | (11) 98226-6789 |
| E-mail | planejamento@grssolucao.com.br |
| CNPJ | 63.562.890/0001-45 |
| Sede | R. Evangelina, 321 — Vila Carrão, São Paulo/SP |

CNPJ e endereço vieram do site institucional já publicado
(`GRS_INSTITUCIONAL2/lib/content.js`), para que a mesma empresa não apareça
com identificação diferente em dois sites.

O WhatsApp do CRM é **outro número** do usado no institucional
((11) 94039-4084), de propósito: separa o lead de software do lead de
revisional. Toda mensagem começa com `GRS Plataforma (CRM) —`, para o
comercial reconhecer a origem já na lista de conversas.

Para sobrescrever qualquer um desses valores, copie `.env.example` para
`.env.local`. Como o build é estático, mudar variável exige refazer o build.

## Como o conteúdo é organizado

- `src/content/site.ts` — **todo o texto da página**. Editar este arquivo muda
  o site inteiro, sem tocar em componente.
- `src/lib/site-config.ts` — o que vem de variável de ambiente.
- `src/components/sections/` — as seções, em ordem de leitura.
- `src/components/site/` — cabeçalho, rodapé, formulário e primitivas visuais.

## As telas do produto

As telas demonstrativas são **componentes React**, em
`src/components/demo/`, e não capturas do sistema em produção. Os dados vêm
de `src/components/demo/data.ts` e são inteiramente fictícios: empresa,
consultores e clientes inventados, CPF mascarado e telefones em faixa
inexistente.

Os mesmos componentes servem a dois usos, então demo e imagem nunca divergem:

1. **Demo navegável** na seção "Ambiente demonstrativo", renderizado ao vivo.
2. **Imagens estáticas** nas demais seções, geradas por `npm run capture`.

A esteira jurídica mostrada é um exemplo montado para o site. O processo real
de qualquer empresa é configurado dentro do sistema, e não foi publicado aqui.

### Como a captura funciona

`npm run capture` faz um build com `CAPTURE=1`, que habilita as rotas
`/capturas/[id]`, serve o resultado localmente, fotografa cada tela com o
Chrome instalado na máquina (sem baixar o Chromium do Playwright) e refaz o
build de produção no fim. As rotas de captura usam a extensão
`.capture.tsx`, que só entra no roteamento quando `CAPTURE=1` — no site
publicado elas não existem.

O script também escreve `src/content/screenshot-sizes.json` com as dimensões
finais, que o componente `Screenshot` usa para reservar o espaço da imagem e
evitar que a página salte durante o carregamento.

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
