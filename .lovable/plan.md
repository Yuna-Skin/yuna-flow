# Plano de performance — pontos restantes

Cada ponto é independente e pode ser feito separadamente. Ordem sugerida = maior ganho por menor esforço primeiro.

---

## 1. Lazy do vídeo via IntersectionObserver

**Problema:** o vídeo do Cloudinary começa a baixar metadata mesmo quando o card "Sua prática de hoje" está fora do viewport, e em mobile a home rola pra baixo.

**O que muda:**
- Criar componente `LazyVideo` em `src/components/LazyVideo.tsx`
- Usa `IntersectionObserver` pra só setar `src` quando o `<video>` entra em ~200px do viewport
- Aplicar em `_authenticated.index.tsx` (vídeo ambiente)

**Arquivos:** 1 novo + 1 editado.

---

## 2. Subir `defaultPreloadStaleTime` pra 30s

**Problema:** `src/router.tsx:55` está em `0` → toda navegação refaz fetch, mesmo no preload de hover/touchstart do `<Link>`.

**O que muda:**
- 1 linha em `src/router.tsx`: `defaultPreloadStaleTime: 30_000`
- Seguro porque cada query já tem `staleTime` próprio

**Arquivos:** 1 editado.

---

## 3. Retry automático em signed URLs expiradas

**Problema:** `createSignedUrl(path, 3600)` (1h). Se a usuária volta ao app depois de 1h, vídeo/áudio quebra com 403/401 e não tem retry.

**O que muda:**
- No `<video>` e `<audio>` players, listener `onError` que invalida a query (`queryClient.invalidateQueries`) → re-pede signed URL fresca
- Aplicar em `AudioModulePlayer.tsx` e no `<video>` de `_authenticated.day.$dayId.tsx`
- Reduzir TTL do signed URL pra 50min e alinhar `staleTime` em 45min (margem de segurança)

**Arquivos:** `AudioModulePlayer.tsx`, `day-audio.functions.ts`, `week-thumbnail.functions.ts`, `_authenticated.day.$dayId.tsx`, `_authenticated.index.tsx`.

---

## 4. Preload da fonte Inter

**Problema:** Inter via `fonts.googleapis.com` adiciona ~150ms de round-trip no FCP. Já tem `preconnect` mas falta o preload do woff2 principal.

**O que muda:**
- Em `__root.tsx`, no `head().links`, adicionar:
  ```
  { rel: "preload", as: "font", type: "font/woff2",
    href: "https://fonts.gstatic.com/...inter-400.woff2",
    crossOrigin: "anonymous" }
  ```
- Preload só do peso 400 (body) e 600 (display) — os mais usados

**Arquivos:** `__root.tsx`.

**Alternativa mais agressiva (não incluída por padrão):** self-host via `@fontsource/inter`. Se quiser, me avisa.

---

## 5. Limpeza de dependências Radix órfãs

**Problema:** removi 30 componentes UI mas as deps Radix continuam no `package.json`, inflando `node_modules` e instalação.

**O que muda:**
- `bun remove` de: `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle-group`, `cmdk`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `recharts`, `vaul`
- Antes de remover, conferir cada uma com `rg` se nada importa

**Arquivos:** `package.json`, `bun.lockb`.

---

## 6. SSR loader + preload do LCP (maior trabalho, maior ganho)

**Problema:** thumbnail da semana é o LCP da home, mas hoje vem de `useQuery` client-only → o navegador só conhece a URL depois do JS hidratar. Sem SSR e sem preload.

**O que muda:**
- Migrar `weeksQ`, `profileQ`, `progressQ` da home pra padrão TanStack Query SSR:
  - `queryOptions(...)` em `src/lib/home-data.ts`
  - `loader: ({ context }) => context.queryClient.ensureQueryData(...)` na rota
  - Trocar `useQuery` por `useSuspenseQuery` no componente
- No `head()` da home, derivar do `loaderData` o `<link rel="preload" as="image" fetchpriority="high">` da thumbnail da semana ativa
- Adicionar `errorComponent` e `notFoundComponent` (obrigatório quando rota tem loader)
- Reduzir signed-URL para entregar diretamente public URL OU pré-assinar no server e devolver no loader

**Arquivos:** `_authenticated.index.tsx`, novo `src/lib/home-data.ts`.

**Trade-off:** mais código, mais surface de bug. Só faz sentido se a home for entrada principal e métrica de LCP importar (ex.: ads, SEO, conversão). Pra app autenticado puro, ganho é menor.

---

## Recomendação de ordem

1. **#2** (30s, 1 linha)
2. **#5** (limpeza de deps)
3. **#1** (LazyVideo)
4. **#4** (preload de fonte)
5. **#3** (retry de signed URL — bug latente)
6. **#6** (SSR + preload LCP — só se valer o esforço)

Me responde quais quer que eu execute (ex.: "1, 2, 3, 4, 5" ou "todos menos o 6").
