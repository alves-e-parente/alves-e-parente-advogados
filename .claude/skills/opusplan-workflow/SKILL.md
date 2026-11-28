---
name: opusplan-workflow
description: Use no início de qualquer conversa, projeto ou artefato não trivial. Planeja com Opus (raciocínio forte), executa com Sonnet (rápido, barato), verifica no fim. Emula o modo opusplan via subagentes.
---

# Opusplan Workflow

Planejar com Opus. Executar com Sonnet. Verificar.

## Quando ativar
- Início de conversa com tarefa real.
- Novo projeto, artefato, documento, código, análise.
- Qualquer pedido com 3+ passos ou decisão de design.

## Quando pular
- Pergunta factual curta.
- Edição trivial (1 arquivo, 1 mudança).
- Usuário disse "direto" ou "sem plano".

## Fase 1 — Plano (Opus)
Dispare `Agent` com `subagent_type: "Plan"` e `model: "opus"`. Passe: objetivo, contexto, restrições.

O plano retorna, nesta ordem:
1. Objetivo em 1 frase.
2. Decisões e premissas (marque incertezas).
3. Passos numerados, cada um independente e verificável.
4. Riscos e gargalos.
5. Critério de aceite mensurável.

Mostre o plano ao usuário. Peça ajuste só se houver decisão que é dele.

## Fase 2 — Execução (Sonnet)
- Passos independentes: `Agent` com `model: "sonnet"`, em paralelo.
- Passos dependentes: execute em sequência.
- Passo pequeno: execute inline, sem subagente.
- Cada subagente recebe: passo, contexto mínimo, critério de aceite.

## Fase 3 — Verificação (Opus)
Revise o resultado contra o critério de aceite. Rode testes/checagens reais. Reporte:
- O que foi feito.
- O que falhou ou ficou incerto.
- Próximo passo.

## Regras
- Resposta curta. Sem narração.
- Falha na execução volta ao plano, não vira gambiarra.
- Nunca declare sucesso sem evidência.
