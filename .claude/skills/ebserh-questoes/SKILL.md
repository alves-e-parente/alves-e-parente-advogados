---
name: ebserh-questoes
description: Importa, organiza e confere questões do curso Trilha HU Brasil (EBSERH 2027, Enfermeiro). Use ao receber cadernos de questões (PDF do TEC), ao revisar o banco ou ao corrigir questões desorganizadas.
---

# Questões da Trilha HU Brasil

Leia `ebserh/REGRAS.md` antes de qualquer mudança. Resumo operacional:

1. **Extrair** o PDF com `pdfplumber` lendo a formatação: sublinhado (retângulo preto fino), destaque (retângulo amarelo), sobrescrito (fonte menor e mais alta) e imagens (recortar pela caixa e salvar em `img/`). Nunca excluir questão por causa de figura, sublinhado ou destaque.
2. **Gabarito**: inline ("Gabarito: X") ou em tabela no fim. Excluir só anuladas e formatos quebrados. Aceitar 4 ou 5 alternativas.
3. **Mapear** matéria para assunto (nome para Português; palavras-chave para Enfermagem). Deduplicar por código do TEC e por hash do enunciado. Ids existentes nunca mudam; novas entram no fim.
4. **Organizar o enunciado** com `ebserh/tools/stemfmt.js` (`fmtStem`, `fmtOpt`): contexto, texto-base entre `⟦T⟧…⟦/T⟧`, itens `( )` e `I.` em linhas próprias, comando final em parágrafo separado. Conferir que nenhum texto foi perdido e olhar uma amostra de 15 questões renderizadas.
5. **Gravar** no banco em docs de até 100 KB (`espcN`, `ptcN`…), com `if_version` em docs existentes. Imagens vão em `files` na publicação.
6. **Testar** (247 aulas sem erro e sem estouro lateral em 1200 e 390 px), publicar com o mesmo caminho do arquivo e responder a thread de comentário.
