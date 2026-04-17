
# Yuna — MVP Protocolo de Yoga Coreano (28 dias)

App mobile-first de hábito guiado. Visual coreano moderno (creme + terracota), seed de 28 dias com placeholders, acesso liberado por padrão.

## 1. Banco de dados (Supabase)

Tabelas:
- `profiles` (id, nome, avatar_url, created_at) — auto-criada via trigger no signup
- `access_control` (user_id, has_access default `true`, source)
- `programs` (id, title, description, is_active)
- `weeks` (id, program_id, title, order_index)
- `days` (id, week_id, day_number, title, video_url, respiration_text, reflection_text)
- `exercises` (id, day_id, title, order_index)
- `movements` (id, exercise_id, title, description, video_url, order_index)
- `user_progress` (id, user_id, day_id, completed, completed_at) — UNIQUE(user_id, day_id)
- `user_streak` (user_id PK, current_streak, last_completed_date)
- `community_posts` (id, user_id, content, created_at, likes_count)
- `post_likes` (post_id, user_id) — para likes únicos
- `comments` (id, post_id, user_id, content, created_at)
- `feed_items` (id, type ['video'|'tip'|'text'], title, content, media_url, created_at, likes_count)
- `feed_likes` (feed_item_id, user_id)

**RLS:** conteúdo (programs/weeks/days/exercises/movements/feed) leitura pública para autenticados; user_progress/streak/access_control restritos ao próprio usuário; posts e comments leitura para todos autenticados, escrita apenas pelo dono.

**Seed:** 1 programa "Yuna 28 dias" → 4 semanas → 28 dias com títulos genéricos, 2-3 exercícios cada, movimentos exemplo, vídeo placeholder do YouTube, textos de respiração e reflexão. ~6 itens iniciais no feed.

## 2. Autenticação

- Tela `/auth` com Login + Signup (email/senha), `emailRedirectTo` configurado
- Trigger SQL cria `profiles` + `access_control(has_access=true)` + `user_streak` no signup
- Layout `_authenticated` protege rotas internas

## 3. Telas (mobile-first, max-width 430px centralizado)

**Bottom nav fixo:** Início · Feed · Comunidade · Perfil

### Início (`/`)
- Saudação "Olá, {nome}"
- Card grande: progresso "Dia X de 28" + barra
- Botão principal "Continuar prática" → vai para o dia atual (primeiro não concluído)
- Linha da semana atual (7 bolinhas: concluído / atual / bloqueado)
- Preview do dia (thumb + título)

### Dia (`/day/$dayNumber`)
- Bloqueado se day_number > primeiro não concluído → redireciona
- Player de vídeo (top)
- Lista de exercícios em accordion (expande movimentos)
- Card de respiração
- Card de reflexão
- Botão fixo no rodapé "Concluir dia" → grava progress, atualiza streak (+1 ou reset se gap), libera próximo, volta pra Início com toast

### Feed (`/feed`)
- Lista vertical de cards (vídeo curto / dica / texto)
- Botão coração + contador

### Comunidade (`/community`)
- Input para criar post no topo
- Lista de posts: avatar, nome, texto, like, comentar
- `/community/$postId` ou modal para comentários

### Perfil (`/profile`)
- Avatar + nome
- Stats: dias concluídos, streak atual, progresso %
- Botão sair

## 4. Lógica de progressão
- "Dia atual" = menor `day_number` sem `user_progress.completed=true`
- Streak: se `last_completed_date` = ontem → +1; se = hoje → mantém; se >1 dia gap → reset para 1

## 5. Design system
- Fundo creme `#FAF6F0`, cards branco, terracota `#C97B5A` como primária, texto `#2A2420`
- Tipografia: serif suave para títulos (Cormorant), sans para corpo (Inter)
- Bordas arredondadas 16-24px, sombras sutis, muito espaço em branco
- Ícones lucide-react, transições suaves

## 6. Fora do escopo (fase 2)
Notificações push, gamificação avançada, ranking, webhook real Ticto, multi-programas.

## Ordem de implementação
1. Migrations + RLS + seed dos 28 dias  
2. Auth + trigger profiles  
3. Layout + bottom nav + tema  
4. Tela Início  
5. Tela Dia + lógica concluir/streak  
6. Feed  
7. Comunidade  
8. Perfil
