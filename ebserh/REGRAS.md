# Trilha HU Brasil (EBSERH 2027, Enfermeiro): regras do projeto

Artefato: https://claude.ai/artifact/APmniwDxDz1pPdXyvtX9ib (privado). Dono: Romero (pt-BR).
Estas regras valem para qualquer sessão futura. Ler antes de mexer.

## 1. Como o Romero quer ser atendido
- Respostas curtas, diretas, estruturadas. Sem enrolação, sem elogio genérico.
- Crítica honesta: riscos, limites, o que não foi verificado.
- Ele manda pedidos por comentários no artefato ("Sent to Claude"). Cada thread: responder com `ArtifactComments reply`
  e uma linha curta na sessão. Não resolver a thread; quem resolve é ele.
- Instrução permanente: seguir e completar as etapas sem pedir permissão e sem questionar. Escolher a melhor conduta.
- Se um recurso não tem solução viável, ele prefere remover a deixar vazio ou quebrado.

## 2. Produto e posicionamento
- (Superado em 21/11/2026: uso pessoal, sem venda.) Citar "HU Brasil (ex-Ebserh)" só em texto, sem "ex-Ebserh" no cabeçalho.
- Não usar logotipo oficial HU Brasil, FGV ou marcas de terceiros.
- Paleta verde pastel (enfermagem), Plus Jakarta Sans (títulos) e Figtree (texto). Manter a paleta em todo redesign.
- Aspecto profissional, fluido, sem "cara de IA". Sem fonte mono em rótulos. Sem selo de "salvo na conta".
- Mestrado do Romero não entra no plano (não terá o título no prazo). Títulos dele: residência, 3 pós, experiência desde 2022, artigos, aperfeiçoamento.

## 3. Conteúdo: regras de ouro
- Questões reais da FGV sempre antes das autorais. Autoral só quando não existe real do tema. Selo "Autoral".
- Todo assunto precisa ter questões. Reais novas do Romero somam às existentes, nunca substituem.
- Cada aula termina com portão de 10 questões; 80% libera "Dominado". Diagnóstico, prática e portão nunca ficam vazios:
  completar com questões da mesma área (reais primeiro) e avisar na tela.
- Aulas com: objetivos, regra central, quadro-resumo, caso, pegadinhas, vídeo-resumo, mapa mental, prática, portão.
- Todo assunto tem esquema visual (comparativo, fluxo, escala, ciclo, números, desenho). Sem foto licenciada: só SVG/HTML próprio.
- Explicações por IA: didáticas e formatadas (resposta em 1 frase; por que a certa; por que cada errada; termos-chave; mnemônico;
  dica de prova), até ~230 palavras. Vale para todo lugar com IA.
- Recordação ativa por mapa mental visual, não por texto digitado.
- Alternativas têm tesoura para cortar. Simulado com 80% ou mais de acertos: confete e selo (respeita "reduzir movimento").
- Questão com sublinhado, destaque, sobrescrito ou imagem NUNCA é excluída: preservar a marcação (ver seção 5). Ao reimportar, também recuperar as que foram excluídas antes: imagens e marcações entram por `tecK/patch.json` (`{tid:{img,s,o}}`), sem mudar ids.
- Material complementar de curso (Missão Aprovação 2027): vira "Julgue os itens" (campo `jg` nas aulas, docs `aulas/jg1`, `jg2`). Os gabaritos do PDF vinham em branco; os veredictos e as correções são de autoria do Claude e só entram quando há confiança. Atualizações de 2026 são verificadas em fonte primária antes de entrar: baixar o PDF oficial (gov.br, DOU, CONASS) e extrair com `pdftotext -layout`; o WebFetch não lê PDF, mas o harness salva o arquivo em `tool-results/`. Já conferidos: Portarias GM/MS 11.211 e 12.508/2026, Nota Técnica 5/2026 (isolamento), PCDT de DM2 e de acidentes escorpiônicos 2026, 5ª Definição Universal de IAM, SBC 2026 (IC), SSC 2026, AHA/ASA 2026 (AVC).

- Raio-X da banca (após responder): tipo de comando, palavras absolutas, dados reais do banco (posição do gabarito equilibrada; absoluta certa ~15% vs acaso 20%; mais longa ~24%) e, por IA, o tipo de pegadinha de cada alternativa errada. Conta no navegador quais pegadinhas mais enganam o Romero. Não vender como "hack": os sinais estatísticos são fracos.

## 4. Uso e direitos autorais
- DECISÃO DO ROMERO (21/11/2026): desistiu de comercializar. A plataforma é só de uso pessoal. Regras de venda (marca, logo, selo FGV,
  aviso de curso independente) deixam de ser obrigatórias, mas não inventar vínculo oficial com a HU Brasil ou a FGV.
- Não redistribuir: se um dia compartilhar com outras pessoas, voltar a tratar direitos autorais dos cadernos TEC e de cursos comerciais.
- Limite técnico, não de política: o artefato roda em sandbox da claude.ai e bloqueia iframes, vídeo e imagem externos (YouTube não toca
  dentro). Só vídeo MP4 próprio (até 15 MB) toca na página. O vídeo-resumo animado com narração (TTS) cobre isso.
- Aulas e comentários são autorais com apoio de IA e SEM revisão clínica externa. Avisar isso sempre que relevante.

## 5. Pipeline técnico (arquivo único `index.html`, ~340 KB)
- Publicar sempre com a mesma `file_path` (mantém a URL). Capabilities atuais: `sample; tts; db[2 rules]; user`. CSP: sem imagens,
  mídia ou iframes externos; scripts só de CDNs permitidas. Imagens próprias vão em `files` (`img/<tid>.png`).
- Banco (Artifact DB): coleção `questoes` (docs esp, esp2..7, espc1..4, pol, polb, leg, legb, pt, ptc1..4) e `aulas`
  (docs por área, `vis1` com esquemas). Cada doc ≤ ~100 KB. Escrita em doc existente exige `if_version`.
  Docs de outras sessões (esp-2, esp-3, leg-2, pol-2…) não tocar. A página carrega todos os docs e deduplica por `id`.
- Ids de questões reais seguem a ordem de importação por área (`pt-083…`). NUNCA reordenar ids existentes: novas entram no fim
  (pastas `tec1`, `tec2`, … na ordem de chegada). Autorais usam ids `area-xNN`. Comentários (`qcom*.js`) e correções (`qover*.js`) são por id.
- Fluxo de build: `build2.js` lê `tree.json`, `content/*.js` e `tecK/final.json`, e gera `final_q_*.json` e `final_a_*.json`.
  Depois fatiar em docs ≤100 KB e gravar com `ArtifactData`.
- Importar caderno TEC (PDF): extrair com pdfplumber lendo formatação (`tools/extract.py`): sublinhado = retângulo preto fino sob o texto;
  destaque = retângulo amarelo (0.945, 0.769, 0.059); sobrescrito = fonte menor e mais alta. Marcadores no texto: `⟦u⟧`, `⟦m⟧`, `⟦S⟧`
  (a página converte com `qf()`; a IA recebe `qtxt()`). Imagens: recortar a figura com a bbox, salvar em `img/`, campo `img`.
  Gabarito pode vir inline ("Gabarito: X") ou em tabela no fim. Descartar só anuladas e formatos quebrados. Aceitar 4 ou 5 alternativas.
  Mapear matéria → assunto por nome (Português) ou palavras-chave (Enfermagem). Deduplicar por `tid` e por hash do enunciado.
- Esquemas visuais: campo `vis` na aula (tipos `cmp`, `flow`, `scale`, `stats`, `cycle`, `svg`). SVG passa por `safeSvg()`.
  Fallback "Gerar esquema visual (IA)" salva por usuário em `data/users/<uid>/ia/vis`.

## 6. Testes antes de publicar
- Sintaxe de todos os `<script>`; render das 247 aulas em 1200 e 390 px sem erro e sem estouro horizontal (`t22/t32`);
  oito telas em 4 larguras (`t24`); teste das marcações e imagens (`t33`).
- Backup antes de editar (`index.vNN.bak`). Responder a thread depois de publicar.

## 7. Pendências conhecidas
- Julgue os itens: itens sem confiança continuam pulados. Pendências: detalhes da Diretriz HAS 2025 (PREVENT, cortes), diurético na IC, PAM-alvo da SSC 2026, quarentena e vigilância sentinela fora do que foi lido.
- 703 questões reais recentes (240 + 463) sem comentário escrito (botão "Explicar por IA" cobre).
- Esquemas curados em 21 assuntos; o resto usa o botão de IA.
- Revisão clínica externa de aulas, comentários e autorais; arquivos MP4 dos vídeos; mais cadernos TEC (Português FGV).
- Autorais de ética seguem princípios gerais, pois falta o texto do Código de Conduta da Ebserh.
- Figma exige autorização do Romero no conector.
