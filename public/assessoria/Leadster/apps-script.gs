/**
 * Google Apps Script — recebe os leads do chat-form e grava na planilha.
 *
 * COMO INSTALAR
 * 1. Abra o editor: script.google.com (ou Extensões > Apps Script na planilha).
 * 2. Apague TODO o conteúdo e cole este arquivo inteiro.
 * 3. Confira as duas variáveis PLANILHA_ID e ABA logo abaixo.
 * 4. Salve (ícone de disquete).
 * 5. Rode a função `testarManual` uma vez pelo editor e autorize o acesso.
 * 6. Implantar > Nova implantação > tipo "App da Web":
 *      Executar como:      Eu (sua conta)
 *      Quem tem acesso:    Qualquer pessoa
 * 7. Copie a URL gerada (termina em /exec) e cole em CONFIG.sheetUrl no chat-form.js.
 *
 * TODA VEZ que editar este arquivo, publique uma NOVA VERSÃO da implantação
 * (Implantar > Gerenciar implantações > lápis > Versão: Nova). Sem isso a URL
 * continua rodando o código antigo.
 */

/* ---------- CONFIGURAÇÃO ---------- */

// ID da planilha — é o trecho da URL entre /d/ e /edit.
// Usamos o ID em vez de getActiveSpreadsheet() de propósito: assim funciona
// mesmo que este script seja um projeto avulso, não vinculado à planilha.
var PLANILHA_ID = '1TnGoWiUnU0bl9NI7CITftHLkX299uqKHJM6vxya_rrA';

var ABA = 'assessoria';

// A ordem aqui define a ordem das colunas na planilha.
// A primeira posição de cada par é a "key" da pergunta no chat-form.js.
var COLUNAS = [
  ['data',      'Data/Hora'],
  ['nome',      'Nome'],
  ['email',     'E-mail'],
  ['whatsapp',  'WhatsApp'],
  ['instagram', 'Instagram'],
  ['comercial', 'Pessoas no comercial'],
  ['trafego',   'Investimento em tráfego'],
  ['origem',    'Página de origem']
];

/* ---------- GRAVAÇÃO ---------- */

function abrirPlanilha() {
  if (PLANILHA_ID && PLANILHA_ID.indexOf('COLE') !== 0) {
    return SpreadsheetApp.openById(PLANILHA_ID);
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Sem planilha: preencha PLANILHA_ID com o ID da sua planilha.');
  }
  return ss;
}

function gravar(p) {
  var ss = abrirPlanilha();
  var sheet = ss.getSheetByName(ABA);
  if (!sheet) sheet = ss.insertSheet(ABA);

  // Cabeçalho na primeira execução
  if (sheet.getLastRow() === 0) {
    var head = COLUNAS.map(function (c) { return c[1]; });
    sheet.appendRow(head);
    sheet.getRange(1, 1, 1, head.length)
      .setFontWeight('bold')
      .setBackground('#25D366')
      .setFontColor('#06251a');
    sheet.setFrozenRows(1);
  }

  var linha = COLUNAS.map(function (c) { return p[c[0]] || ''; });
  sheet.appendRow(linha);

  // Opcional: avisar por e-mail a cada lead novo.
  // Descomente e troque o endereço.
  // MailApp.sendEmail({
  //   to: 'voce@suaempresa.com.br',
  //   subject: 'Novo lead: ' + (p.nome || ''),
  //   body: COLUNAS.map(function (c) { return c[1] + ': ' + (p[c[0]] || '-'); }).join('\n')
  // });

  return sheet.getLastRow();
}

/* ---------- ENDPOINTS ---------- */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var p = (e && e.parameter) ? e.parameter : {};
    var linha = gravar(p);
    return responder({ status: 'ok', linha: linha });
  } catch (err) {
    registrarErro(err);
    return responder({ status: 'erro', mensagem: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/**
 * Abrir a URL /exec no navegador mostra um diagnóstico da conexão.
 * Acrescente ?teste=1 na URL para gravar uma linha de teste na planilha.
 */
function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  try {
    var ss = abrirPlanilha();
    var sheet = ss.getSheetByName(ABA);

    if (p.teste === '1') {
      var linha = gravar({
        data:      new Date().toLocaleString('pt-BR'),
        nome:      'TESTE VIA NAVEGADOR',
        email:     'teste@teste.com',
        whatsapp:  '(11) 90000-0000',
        instagram: '@teste',
        comercial: '1 pessoa',
        trafego:   'Ainda não invisto',
        origem:    'doGet ?teste=1'
      });
      return responder({ status: 'gravou', linha: linha, aba: ABA });
    }

    return responder({
      status:   'online',
      planilha: ss.getName(),
      aba:      ABA,
      existe:   !!sheet,
      linhas:   sheet ? sheet.getLastRow() : 0
    });
  } catch (err) {
    return responder({ status: 'erro', mensagem: String(err) });
  }
}

/* ---------- DIAGNÓSTICO ---------- */

/**
 * Rode esta função aqui no editor (selecione no menu do topo e clique Executar).
 * Se aparecer "TESTE MANUAL" na planilha, o código e as permissões estão certos —
 * e qualquer problema restante está na IMPLANTAÇÃO (passo 6 do topo).
 */
function testarManual() {
  var linha = gravar({
    data:      new Date().toLocaleString('pt-BR'),
    nome:      'TESTE MANUAL',
    email:     'teste@teste.com',
    whatsapp:  '(11) 90000-0000',
    instagram: '@teste',
    comercial: '1 pessoa',
    trafego:   'Ainda não invisto',
    origem:    'editor do Apps Script'
  });
  Logger.log('Gravado na linha ' + linha);
}

// Guarda os erros numa aba própria, pra não sumirem silenciosamente.
function registrarErro(err) {
  try {
    var ss = abrirPlanilha();
    var log = ss.getSheetByName('_erros') || ss.insertSheet('_erros');
    log.appendRow([new Date(), String(err)]);
  } catch (x) {
    // se nem isso funcionar, não há o que fazer
  }
}

function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
