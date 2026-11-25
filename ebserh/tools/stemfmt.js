/* Organiza enunciados e alternativas: parágrafos, itens, textos-base e comando final.
   Convenções do texto organizado:  "\n" = quebra de linha; "\n\n" = novo parágrafo;
   ⟦T⟧...⟦/T⟧ = texto-base (citação ou texto de apoio); linhas que começam com "( )" ou "I." viram itens. */
const MK='(?:⟦\\/?[umS]⟧)*';
const SB=new RegExp('(?<=[.?!:”"»)\\]])'+MK+'\\s+(?:[—–-]\\s+)?(?='+MK+'[A-ZÀ-Ú“"(0-9\\[])','g'); // fronteira de frase
const CUE=/^(?:⟦\/?[umS]⟧)*(Está|Estão|Estar|As afirmativas|A sequência|A ordem|A alternativa|Assinale|Marque|Indique|Identifique|Considerando|Considere|Com base|Em relação|Sobre|Acerca|A respeito|Julgue|Analise|Avalie|Observe|Leia|Qual|Quais|Segundo|De acordo|Conforme|Nesse|Nessa|Neste|Nesta|Esse|Essa|O que|Dentre|Entre|Tendo em vista|À luz|Diante|A partir|No que|Quanto|Em face|Ao |Para |Pela|Pelo|Das|Dos|Do ponto|Pode-se|Podemos|É correto|São corretas|Está correto|Está incorreto|Trata-se|Isso|Isto|Tal|Tais)/i;
const strip=s=>String(s).replace(/⟦\/?[umSTL]⟧/g,'');

function fixCompounds(t){
  return String(t).replace(/pico- ?de- ?jaca|picode- jaca/gi,'pico-de-jaca').replace(/\b(bem|mal|recém|têmporo|alvo|físico|socio|sócio|médico)- (?=[a-zà-ú])/gi,'$1-').replace(/consti- tuem/g,'constituem').replace(/([a-zà-ú]{3,})- (ção|ções|mente|dade|dades|mento|mentos)\b/g,'$1$2');
}
function clean(t){
  t=String(t==null?'':t).replace(/\u00a0/g,' ').replace(/[\u200b\u200c\u200d\ufeff]/g,'').replace(/μ|�/g,'');
  t=t.replace(/\bhttps?:\/\/www\.tecconcursos\S*/gi,'').replace(/\b\d{1,2}\/\d{1,2}\/20\d\d,? \d\d:\d\d\s*(Caderno EBSERH)?/g,'').replace(/Caderno EBSERH/g,'');
  // hífen partido na quebra de linha do PDF
  t=t.replace(/([A-Za-zÀ-ÿ])- (se|lo|la|los|las|lhe|lhes|me|te|nos|vos|a|o|as|os)(?![A-Za-zÀ-ÿ])/g,(m,a,b)=>/^(a|o|as|os)$/.test(b)?m:a+'-'+b);
  t=t.replace(/\b(pseudo|anti|auto|micro|macro|semi|sub|extra|inter|intra|supra|ex|pré|pós|pró|co|neo|multi|bio|socio|psico)- (?=[a-zà-ú])/gi,'$1-');
  t=fixCompounds(t);
  t=t.replace(/[ \t]+/g,' ').replace(/ ([,;.:!?])(?=\s|$)/g,'$1').replace(/\s+$/,'').replace(/^\s+/,'');
  return t;
}
function splitItems(s){
  // V/F
  if((s.match(/\(\s*\)/g)||[]).length>=2) s=s.replace(/\s*\(\s*\)\s+/g,'\n( ) ');
  // romanos: precisa de I. e II.
  if(/(^|[\s.:;?!])I\.\s/.test(s)&&/[\s.:;?!]II\.\s/.test(s)){
    s=s.replace(new RegExp('(?<=[.?!:;”"»)\\]'+'\\w])'+MK+'\\s+(?=(?:⟦\\/?[umS]⟧)*(?:VIII|VII|VI|IV|V|III|II|I)\\.\\s+(?:⟦\\/?[umS]⟧)*[A-ZÀ-Ú“"(0-9a-zà-ú])','g'),'\n');
  }
  return s;
}
function lastSentence(s){
  let idx=-1,m; SB.lastIndex=0;
  while((m=SB.exec(s))) idx=m.index+m[0].length;
  return idx;
}
const STRONG=/^(?:⟦\/?[umS]⟧)*(Assinale|Marque|Indique|Identifique|Julgue|Considerando|Considere|Com base|Sobre|Acerca|A respeito|Segundo|De acordo|Conforme|Tendo em vista|Analise|Avalie|Observe|Leia|Qual|Quais|Em relação|Quanto|À luz|Diante|Está|Estão|As afirmativas|A sequência|A ordem|É correto|São corretas|O que|Dentre|Entre)/i;
const isCmd=t=>{ const u=strip(t).trim(); return STRONG.test(t)||/[:?,]$/.test(u)||!/[.?!”"»)\]]$/.test(u); };
const PEEL=/^(?:⟦\/?[umS]⟧)*(No|Nesse|Neste|Nessa|Nesta|Do|Da|Dos|Das|O|A|Os|As|Podemos|Pode-se|Com relação|Em relação|Considerando|Considere|Observe) (?:texto|poema|trecho|fragmento|segmento|primeiro|segundo|terceiro|último|título|parágrafo|verso|termo|palavra|expressão|segmento|trecho|uso|emprego|fato|aspecto|caso|que|inferir|seguir|relação)/i;
const TRAILCMD=/\s+((?:Está|Estão) (?:corret|incorret)[^.]{0,120}|As afirmativas são[^.]{0,80}|A sequência (?:correta|de)[^.]{0,100}|A ordem (?:correta|de)[^.]{0,100}|Assinale[^.]{0,200}|Considerando[^.]{0,260}|Marque[^.]{0,200}|Quais[^.]{0,200}|Qual[^.]{0,200}|Indique[^.]{0,200}|Está correto[^.]{0,100})$/;
function protect(s){ return s.replace(/\(\s*\)/g,'(\u0001)'); }
function restore(s){ return s.replace(/\(\u0001\)/g,'( )'); }
function splitTail(s){
  s=protect(s);
  const lines=s.split('\n'); const last=lines[lines.length-1], body=lines.slice(0,-1).join('\n');
  const isItem=/^(\(\u0001\)|(?:VIII|VII|VI|IV|V|III|II|I)\.)\s/.test(strip(last));
  let out=null;
  if(isItem){ const m=last.match(TRAILCMD);
    if(m&&m.index>20){ out=(body?body+'\n':'')+last.slice(0,m.index).replace(/\s+$/,'')+'\n\n'+m[1]; }
    else { const cand=[]; SB.lastIndex=0; let mm; while((mm=SB.exec(last))) cand.push(mm.index+mm[0].length);
      if(cand.length){ const k=cand[cand.length-1], tail=last.slice(k); if(tail.length<=260&&k>30&&!/^[^.]*[.?!]\s*$/.test(strip(tail))&&isCmd(tail)) out=(body?body+'\n':'')+last.slice(0,k).replace(/\s+$/,'')+'\n\n'+tail; } } }
  else {
    const cand=[]; SB.lastIndex=0; let m; while((m=SB.exec(last))) cand.push(m.index+m[0].length);
    if(cand.length){ const k=cand[cand.length-1], tail=last.slice(k); const pre=last.slice(0,k).replace(/\s+$/,'');
      if(tail.length<=360&&strip(pre).length>=80&&isCmd(tail)){ let pp=pre, tt=tail;
        for(let g=0;g<2;g++){ const c2=[]; SB.lastIndex=0; let m2; while((m2=SB.exec(pp))) c2.push(m2.index+m2[0].length); if(!c2.length) break; const k2=c2[c2.length-1], t2=pp.slice(k2); if(t2.length<=240&&PEEL.test(t2)&&strip(pp.slice(0,k2)).length>=80){ tt=t2+' '+tt; pp=pp.slice(0,k2).replace(/\s+$/,''); } else break; }
        out=(body?body+'\n':'')+pp+'\n\n'+tt; } }
  }
  return restore(out||s);
}
function boxTexts(s){
  // 1) "Texto N" explícito
  const hdr=/(^|\n|\s)((?:Texto|TEXTO)\s*(?:\d+|[IVX]+)\b\s*[:.]?)/g;
  if(hdr.test(s)){
    s=s.replace(/(?:^|\s)((?:Texto|TEXTO)\s*(?:\d+|[IVX]+)\b\s*[:.]?)\s*/g,(m,h)=>'\n\n⟦T⟧'+h.replace(/[:.]$/,'')+'\n');
    // fecha cada texto depois da linha de fonte "(Disponível em ... Acesso em: ...)" ou antes do próximo "Texto"/comando
    s=s.replace(/(\((?:fragmento|trecho|adaptado|adaptada|texto adaptado)\))\s+/gi,'$1\n');
    const parts=s.split('⟦T⟧'); let out=parts[0];
    for(let i=1;i<parts.length;i++){ let seg=parts[i], rest='';
      const src=seg.search(/(?:Dispon[ií]vel em|Fonte:|Acesso em)[^]*?(?:Acesso em:?\s*\d{1,2}\/\d{1,2}\/\d{2,4}\.?|\d{1,2}\/\d{1,2}\/\d{2,4}\.?)/i);
      if(src>=0){ const mm=seg.slice(src).match(/^(?:Dispon[ií]vel em|Fonte:|Acesso em)[^]*?(?:Acesso em:?\s*\d{1,2}\/\d{1,2}\/\d{2,4}\.?|\d{1,2}\/\d{1,2}\/\d{2,4}\.?)/i); const end=src+mm[0].length; rest=seg.slice(end); seg=seg.slice(0,end); }
      else { const li=lastSentence(seg); const tail=li>0?seg.slice(li):''; if(i===parts.length-1&&tail&&isCmd(tail)&&tail.length<340&&seg.length>200){ rest=' '+tail; seg=seg.slice(0,li).replace(/\s+$/,'').replace(/\s*[—–-]\s*$/,''); rest=rest.replace(/^\s*[—–-]\s*/,' ');
        for(let g=0;g<2;g++){ const c2=[]; SB.lastIndex=0; let m2; while((m2=SB.exec(seg))) c2.push(m2.index+m2[0].length); if(!c2.length) break; const k2=c2[c2.length-1], t2=seg.slice(k2).replace(/\s*[—–-]\s*$/,''); if(t2.length<=240&&PEEL.test(t2)&&strip(seg.slice(0,k2)).length>=120){ rest=' '+t2+rest; seg=seg.slice(0,k2).replace(/\s+$/,'').replace(/\s*[—–-]\s*$/,''); } else break; } } }
      out+='⟦T⟧'+seg.replace(/\s+$/,'')+'⟦/T⟧'+(rest?'\n\n'+rest.replace(/^\s+/,''):''); }
    return out;
  }
  // 1b) "Leia o poema/texto a seguir": a frase de abertura fica fora; o texto-base vai para a caixa até o comando final
  const lead=s.match(/^((?:⟦\/?[umS]⟧)*(?:Leia|Observe|Considere|Analise)[^.\n]{0,140}?(?:poema|texto|trecho|fragmento|charge|tirinha|anúncio|notícia|crônica|letra|canção|cartaz)[^.\n]{0,170}\.)\s+([^]+)$/i);
  if(lead&&lead[2].length>240){ let rest=lead[2], cmdStart=-1; const c=[]; SB.lastIndex=0; let m; while((m=SB.exec(rest))) c.push(m.index+m[0].length);
    if(c.length){ let k=c[c.length-1]; let tail=rest.slice(k); if(isCmd(tail)&&tail.length<=360){ let pp=rest.slice(0,k).replace(/\s+$/,''), tt=tail;
        for(let g=0;g<2;g++){ const c2=[]; SB.lastIndex=0; let m2; while((m2=SB.exec(pp))) c2.push(m2.index+m2[0].length); if(!c2.length) break; const k2=c2[c2.length-1], t2=pp.slice(k2); if(t2.length<=240&&PEEL.test(t2)&&strip(pp.slice(0,k2)).length>=80){ tt=t2+' '+tt; pp=pp.slice(0,k2).replace(/\s+$/,''); } else break; }
        return lead[1]+'\n\n⟦T⟧'+pp+'⟦/T⟧\n\n'+tt; } } }
  // 2) citação longa entre aspas curvas
  const q=s.match(/[“"]([^“”"]{220,}?)[”"]/);
  if(q){ const a=s.indexOf(q[0]), b=a+q[0].length; let tail=s.slice(b); const attr=tail.match(/^\s*(?:\[\.\.\.\]\s*)?(?:[A-ZÀ-Ú][^.\n]{2,60}\.(?:\s+[^.\n]{2,80}\.){0,2})(?=\s+[A-ZÀ-Ú“"(0-9])/);
    let end=b; if(attr&&attr[0].length<200) end=b+attr[0].length;
    const before=s.slice(0,a).replace(/\s+$/,''), box=s.slice(a,end).trim(), after=s.slice(end).replace(/^\s+/,'');
    return (before?before+'\n\n':'')+'⟦T⟧'+box+'⟦/T⟧'+(after?'\n\n'+after:''); }
  return s;
}
function fmtStem(raw){
  let s=clean(raw); if(!s) return s; if(/\n/.test(s)&&/⟦T⟧/.test(s)) return s; // já organizado
  const plain=strip(s);
  const needs=plain.length>260||/\(\s*\)/.test(plain)||/(^|\s)I\.\s[\s\S]*\sII\.\s/.test(plain)||/(Texto|TEXTO)\s*(\d+|[IVX]+)\b/.test(plain);
  if(!needs) return s;
  s=splitItems(s);
  s=boxTexts(s);
  // o comando final só é separado fora das caixas de texto-base
  const m=s.match(/^([^]*⟦\/T⟧)([^]*)$/);
  if(m){ const tail=m[2].replace(/^\s+/,''); s=m[1]+(tail?'\n\n'+(tail.length>150?splitTail(tail):tail):''); }
  else s=splitTail(s);
  s=s.replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').replace(/^\s+|\s+$/g,'');
  return s;
}
function fmtOpt(raw){ return clean(raw).replace(/^\s*[a-eA-E]\)\s+/,''); }
module.exports={fmtStem,fmtOpt,clean,strip,fixCompounds};
