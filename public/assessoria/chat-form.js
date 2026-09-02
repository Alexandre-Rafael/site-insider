/* ============================================================
   CHAT FORM - Qualificacao de leads (estilo Leadster/WhatsApp)

   Uso: carregue este arquivo no rodape da pagina, ou cole o conteudo dentro
        de uma tag script. Depois marque os botoes com a classe chatform-open,
        com o atributo data-chatform-open, ou aponte o link para #chatform.
        Tambem da pra abrir por codigo: ChatForm.open()

   O widget roda dentro de um Shadow DOM: o CSS do tema (WordPress, Elementor,
   etc.) NAO consegue entrar e baguncar os botoes.

   IMPORTANTE: nunca escreva a tag de fechamento de script literal neste
   arquivo. Ela encerraria o bloco antes da hora quando o codigo for colado
   inline (widget HTML do Elementor, snippet, etc.).
   ============================================================ */
(function () {
  'use strict';

  // Protecao: se o script for colado duas vezes na mesma pagina (dois widgets
  // HTML no Elementor, plugin + tema, etc.), a segunda carga e ignorada.
  if (window.ChatForm) return;

  /* ---------- CONFIGURACAO ---------- */
  var CONFIG = {
    // URL do Web App do Google Apps Script (veja apps-script.gs)
    sheetUrl: 'https://script.google.com/macros/s/AKfycbwxd4MczOkYbtisASZPaH2iFR2ruo9ISJd6ZjYc_bDPet-datfdX6eMZBwMLdweRrvt/exec',

    // WhatsApp de destino (so numeros, com DDI 55)
    whatsapp: '5534999111430',

    // Mensagem que o lead envia no WhatsApp (os dados vao SO pra planilha)
    whatsappMsg: 'Olá, vim pelo site e gostaria de saber mais.',

    // Identidade
    brandName: 'Insider Mídia',
    brandTag: 'online agora',
    avatar: 'data:image/jpeg;base64,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',   // iniciais OU URL/data-URI de imagem
    accent: '#25D366',     // cor principal

    typingDelay: 550,      // ms de "digitando..."
    redirectDelay: 2600,   // ms antes de redirecionar pro WhatsApp
    debug: false           // true = mostra o passo a passo do envio no console
  };

  /* ---------- ROTEIRO DO CHAT ---------- */
  var STEPS = [
    {
      key: 'nome',
      bot: [
        'Olá! 👋 Que bom te ver por aqui. Queremos te ouvir e conhecer sua operação atual.',
        'Pra começar, como você se chama?'
      ],
      type: 'text',
      placeholder: 'Seu nome completo',
      validate: function (v) { return v.trim().length >= 2 || 'Digite seu nome, por favor.'; }
    },
    {
      key: 'email',
      bot: function (d) { return ['Prazer, ' + d.nome.split(' ')[0] + '! 😄', 'Qual o seu melhor e-mail?']; },
      type: 'email',
      placeholder: 'voce@empresa.com.br',
      validate: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Hmm, esse e-mail parece inválido.';
      }
    },
    {
      key: 'whatsapp',
      bot: ['Perfeito. E o seu WhatsApp com DDD?'],
      type: 'tel',
      mask: 'phone',
      placeholder: '(11) 99999-9999',
      validate: function (v) {
        return v.replace(/\D/g, '').length >= 10 || 'Preciso do DDD + número. 🙂';
      }
    },
    {
      key: 'instagram',
      bot: ['Qual o @ do Instagram da sua empresa?'],
      type: 'text',
      mask: 'instagram',
      placeholder: '@suaempresa',
      optional: true,
      skipLabel: 'Não tenho Instagram',
      validate: function (v) {
        return v.replace(/[@\s]/g, '').length >= 2 || 'Digite o @ ou pule essa pergunta.';
      }
    },
    {
      key: 'comercial',
      bot: [
        'Show! Agora me conta um pouco do seu time.',
        'Hoje, quantas pessoas são dedicadas ao comercial da sua empresa? (vendedores, SDRs, closers)'
      ],
      type: 'options',
      options: [
        'Ninguém ainda — eu mesmo(a) vendo',
        '1 pessoa',
        'De 2 a 5 pessoas',
        'De 6 a 10 pessoas',
        'De 11 a 30 pessoas',
        'Mais de 30 pessoas'
      ]
    },
    {
      key: 'trafego',
      bot: ['Última pergunta: quanto você investe em tráfego pago por mês?'],
      type: 'options',
      options: [
        'Ainda não invisto',
        'Até R$1.000',
        'De R$1.000 a R$3.000',
        'De R$3.000 a R$10.000',
        'De R$10.000 a R$30.000',
        'Acima de R$30.000'
      ]
    }
  ];

  /* ---------- ESTILOS (ficam dentro do Shadow DOM) ---------- */
  var FONTE = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';

  var CSS = [
    ':host{--cf-accent:' + CONFIG.accent + ';--cf-bg:#0b141a;--cf-panel:#111b21;--cf-head:#202c33;',
    '--cf-bot:#202c33;--cf-user:#005c4b;--cf-txt:#e9edef;--cf-muted:#8696a0;--cf-line:#2a3942}',
    '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;font-family:' + FONTE + ';',
    'letter-spacing:normal;text-transform:none;text-shadow:none;float:none}',

    '.cf-back{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.72);',
    'backdrop-filter:blur(4px);animation:cfFade .25s ease}',
    '.cf-win{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;',
    'background:var(--cf-bg);animation:cfUp .32s cubic-bezier(.22,1,.36,1);',
    '-webkit-font-smoothing:antialiased}',
    '@media(min-width:768px){.cf-win{top:50%;left:50%;right:auto;bottom:auto;',
    'transform:translate(-50%,-50%);width:min(460px,94vw);height:min(720px,92vh);',
    'border-radius:16px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.6)}}',
    '@keyframes cfFade{from{opacity:0}to{opacity:1}}',
    '@keyframes cfUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}',
    '@media(min-width:768px){@keyframes cfUp{from{opacity:0;transform:translate(-50%,-44%)}',
    'to{opacity:1;transform:translate(-50%,-50%)}}}',

    '.cf-head{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--cf-head);',
    'border-bottom:1px solid var(--cf-line);flex:0 0 auto}',
    '.cf-av{width:42px;height:42px;border-radius:50%;background:var(--cf-accent);color:#06251a;',
    'display:grid;place-items:center;font-weight:800;font-size:15px;overflow:hidden;flex:0 0 auto}',
    '.cf-av img{width:100%;height:100%;object-fit:cover;display:block;border-radius:0;',
    'max-width:none;box-shadow:none}',
    '.cf-name{color:var(--cf-txt);font-size:15px;font-weight:600;line-height:1.3}',
    '.cf-stat{color:var(--cf-accent);font-size:12px;display:flex;align-items:center;gap:5px}',
    '.cf-dot{width:7px;height:7px;border-radius:50%;background:var(--cf-accent);animation:cfPulse 1.8s infinite}',
    '@keyframes cfPulse{0%,100%{opacity:1}50%{opacity:.35}}',

    /* reset forte para os controles, mesmo isolados */
    'button{-webkit-appearance:none;appearance:none;background:none;border:0;outline:0;',
    'font:inherit;color:inherit;cursor:pointer;text-decoration:none;box-shadow:none;',
    'text-align:inherit;line-height:normal;min-height:0;min-width:0;width:auto;height:auto;',
    'transform:none;transition:none;letter-spacing:normal}',
    'input{-webkit-appearance:none;appearance:none;font:inherit;box-shadow:none;',
    'line-height:normal;height:auto;min-height:0;width:auto;margin:0}',
    'a{text-decoration:none;color:inherit;box-shadow:none;border:0}',

    '.cf-x{margin-left:auto;color:var(--cf-muted);width:36px;height:36px;border-radius:50%;',
    'display:grid;place-items:center;font-size:22px;line-height:1;transition:.15s;flex:0 0 auto}',
    '.cf-x:hover{background:rgba(255,255,255,.08);color:var(--cf-txt)}',

    '.cf-bar{height:3px;background:var(--cf-line);flex:0 0 auto}',
    '.cf-bar i{display:block;height:100%;width:0;background:var(--cf-accent);',
    'transition:width .45s cubic-bezier(.22,1,.36,1)}',

    '.cf-body{flex:1;overflow-y:auto;padding:18px 14px 8px;display:flex;flex-direction:column;gap:8px;',
    'background:var(--cf-bg);background-image:radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px);',
    'background-size:22px 22px;scroll-behavior:smooth}',
    '.cf-body::-webkit-scrollbar{width:6px}',
    '.cf-body::-webkit-scrollbar-thumb{background:var(--cf-line);border-radius:3px}',

    '.cf-msg{max-width:82%;padding:9px 12px;border-radius:12px;font-size:14.5px;line-height:1.5;',
    'color:var(--cf-txt);word-wrap:break-word;animation:cfIn .3s cubic-bezier(.22,1,.36,1);white-space:pre-wrap}',
    '@keyframes cfIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}',
    '.cf-bot{align-self:flex-start;background:var(--cf-bot);border-top-left-radius:3px}',
    '.cf-user{align-self:flex-end;background:var(--cf-user);border-top-right-radius:3px}',
    '.cf-time{display:block;font-size:10.5px;color:var(--cf-muted);text-align:right;margin-top:3px}',

    '.cf-typing{align-self:flex-start;background:var(--cf-bot);padding:13px 15px;border-radius:12px;',
    'border-top-left-radius:3px;display:flex;gap:4px}',
    '.cf-typing span{width:7px;height:7px;border-radius:50%;background:var(--cf-muted);animation:cfBounce 1.3s infinite}',
    '.cf-typing span:nth-child(2){animation-delay:.18s}',
    '.cf-typing span:nth-child(3){animation-delay:.36s}',
    '@keyframes cfBounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}',

    '.cf-foot{flex:0 0 auto;background:var(--cf-head);border-top:1px solid var(--cf-line);',
    'padding:12px 14px calc(12px + env(safe-area-inset-bottom))}',
    '.cf-opts{display:flex;flex-direction:column;gap:8px;max-height:40vh;overflow-y:auto}',
    '.cf-opt{width:100%;text-align:left;padding:12px 14px;border-radius:10px;',
    'background:transparent;border:1.5px solid var(--cf-line);color:var(--cf-txt);font-size:14.5px;',
    'transition:.15s;animation:cfIn .25s backwards}',
    '.cf-opt:hover{border-color:var(--cf-accent);background:rgba(37,211,102,.1)}',
    '.cf-opt:active{transform:scale(.985)}',

    '.cf-inrow{display:flex;gap:9px;align-items:center}',
    '.cf-in{flex:1;padding:13px 15px;border-radius:22px;border:1.5px solid var(--cf-line);',
    'background:var(--cf-panel);color:var(--cf-txt);font-size:16px;outline:none;',
    'transition:.15s;min-width:0}',
    '.cf-in::placeholder{color:var(--cf-muted);opacity:1}',
    '.cf-in:focus{border-color:var(--cf-accent)}',
    '.cf-send{width:46px;height:46px;flex:0 0 auto;border-radius:50%;background:var(--cf-accent);',
    'color:#06251a;display:grid;place-items:center;transition:.15s}',
    '.cf-send:hover{filter:brightness(1.1)}',
    '.cf-send svg{width:20px;height:20px;fill:currentColor;display:block}',
    '.cf-skip{margin-top:9px;color:var(--cf-muted);font-size:13px;text-decoration:underline;',
    'padding:2px;background:none;border-radius:0}',
    '.cf-skip:hover{color:var(--cf-txt);background:none}',
    '.cf-err{color:#f6607a;font-size:12.5px;margin-top:7px;padding-left:6px}',

    '.cf-cta{display:block;width:100%;padding:15px;border-radius:12px;background:var(--cf-accent);',
    'color:#06251a;font-size:15.5px;font-weight:700;text-align:center;transition:.15s}',
    '.cf-cta:hover{filter:brightness(1.08)}',
    '.cf-lgpd{color:var(--cf-muted);font-size:11px;text-align:center;margin-top:9px;line-height:1.45}'
  ].join('');

  /* ---------- HELPERS ---------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m];
    });
  }
  function now() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function log() {
    if (CONFIG.debug && window.console) {
      console.log.apply(console, ['[ChatForm]'].concat([].slice.call(arguments)));
    }
  }

  function maskPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  function maskInsta(v) {
    return '@' + v.replace(/[@\s]/g, '').replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
  }

  /* ---------- ESTADO ---------- */
  var host, shadow, body, foot, barFill;
  var idx = 0, data = {}, built = false, done = false, enviado = false;

  // O host fica no light DOM, mas com "all:initial" pra nao herdar nada do tema.
  var HOST_STYLE = 'all:initial;position:fixed;top:0;left:0;right:0;bottom:0;' +
                   'z-index:2147483000;display:none;';

  function build() {
    if (built) return;

    host = document.createElement('div');
    host.id = 'chat-form-host';
    host.setAttribute('style', HOST_STYLE);
    document.body.appendChild(host);

    shadow = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    var st = document.createElement('style');
    st.textContent = CSS;
    shadow.appendChild(st);

    var back = el('div', 'cf-back');
    back.addEventListener('click', close);

    var win = el('div', 'cf-win');
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-modal', 'true');
    win.setAttribute('aria-label', 'Formulário de contato');

    var avatar = /^(data:|https?:|\/|\.)/.test(CONFIG.avatar)
      ? '<img src="' + esc(CONFIG.avatar) + '" alt="">'
      : esc(CONFIG.avatar);

    win.appendChild(el('div', 'cf-head',
      '<div class="cf-av">' + avatar + '</div>' +
      '<div>' +
      '<div class="cf-name">' + esc(CONFIG.brandName) + '</div>' +
      '<div class="cf-stat"><span class="cf-dot"></span>' + esc(CONFIG.brandTag) + '</div>' +
      '</div>' +
      '<button class="cf-x" type="button" aria-label="Fechar">&times;</button>'));

    var bar = el('div', 'cf-bar', '<i></i>');
    barFill = bar.firstElementChild;
    win.appendChild(bar);

    body = el('div', 'cf-body');
    foot = el('div', 'cf-foot');
    win.appendChild(body);
    win.appendChild(foot);

    // Sempre que o rodape mudar de altura (troca de campo de texto pra lista de
    // opcoes, teclado do celular abrindo, etc.) a conversa reacompanha o fim.
    if (window.ResizeObserver) {
      new ResizeObserver(function () { scrollFim(); }).observe(foot);
    }

    shadow.appendChild(back);
    shadow.appendChild(win);

    win.querySelector('.cf-x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && host.style.display === 'block') close();
    });
    built = true;
  }

  /* Rola a conversa ate o fim.
     Precisa insistir por alguns frames porque a altura muda depois: a bolha
     entra com animacao e o rodape cresce/encolhe conforme o tipo de resposta
     (uma lista de opcoes e bem mais alta que um campo de texto). Sem isso a
     ultima pergunta fica escondida atras do rodape. */
  function scrollFim() {
    if (!body) return;
    var ir = function () { body.scrollTop = body.scrollHeight; };
    ir();
    requestAnimationFrame(function () {
      ir();
      requestAnimationFrame(ir);
    });
    setTimeout(ir, 60);
    setTimeout(ir, 220);
    setTimeout(ir, 420);
  }

  function push(text, who) {
    var m = el('div', 'cf-msg cf-' + who,
      esc(text) + '<span class="cf-time">' + now() + '</span>');
    body.appendChild(m);
    scrollFim();
  }

  async function botSay(lines) {
    for (var i = 0; i < lines.length; i++) {
      var t = el('div', 'cf-typing', '<span></span><span></span><span></span>');
      body.appendChild(t);
      scrollFim();
      await sleep(CONFIG.typingDelay);
      t.remove();
      push(lines[i], 'bot');
      await sleep(180);
    }
  }

  function progress() {
    barFill.style.width = Math.round((idx / STEPS.length) * 100) + '%';
  }

  async function render() {
    progress();
    if (idx >= STEPS.length) return finish();

    var step = STEPS[idx];
    foot.innerHTML = '';
    await botSay(typeof step.bot === 'function' ? step.bot(data) : step.bot);

    if (step.type === 'options') renderOptions(step);
    else renderInput(step);

    scrollFim();
  }

  function renderOptions(step) {
    var box = el('div', 'cf-opts');
    step.options.forEach(function (opt, i) {
      var b = el('button', 'cf-opt', esc(opt));
      b.type = 'button';
      b.style.animationDelay = (i * 45) + 'ms';
      b.addEventListener('click', function () { answer(step, opt); });
      box.appendChild(b);
    });
    foot.appendChild(box);
  }

  function renderInput(step) {
    var row = el('div', 'cf-inrow');
    var input = el('input', 'cf-in');
    input.type = step.type;
    input.placeholder = step.placeholder || '';
    input.autocomplete = { nome: 'name', email: 'email', whatsapp: 'tel' }[step.key] || 'off';

    var send = el('button', 'cf-send',
      '<svg viewBox="0 0 24 24"><path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"/></svg>');
    send.type = 'button';
    send.setAttribute('aria-label', 'Enviar');

    var err = el('div', 'cf-err');
    err.style.display = 'none';

    if (step.mask === 'phone') {
      input.addEventListener('input', function () { input.value = maskPhone(input.value); });
    }
    if (step.mask === 'instagram') {
      input.addEventListener('input', function () { input.value = maskInsta(input.value); });
    }

    function submit() {
      var v = input.value.trim();
      var res = step.validate ? step.validate(v) : true;
      if (res !== true) {
        err.textContent = res;
        err.style.display = 'block';
        input.focus();
        return;
      }
      answer(step, v);
    }
    send.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    input.addEventListener('input', function () { err.style.display = 'none'; });

    row.appendChild(input);
    row.appendChild(send);
    foot.appendChild(row);
    foot.appendChild(err);

    if (step.optional) {
      var skip = el('button', 'cf-skip', esc(step.skipLabel || 'Pular'));
      skip.type = 'button';
      skip.addEventListener('click', function () { answer(step, '—'); });
      foot.appendChild(skip);
    }

    if (window.matchMedia('(min-width:768px)').matches) {
      setTimeout(function () { input.focus(); }, 120);
    }
  }

  function answer(step, value) {
    data[step.key] = value;
    push(value, 'user');
    foot.innerHTML = '';
    idx++;

    // Assim que a ULTIMA resposta chega, manda pra planilha na hora — antes das
    // mensagens de encerramento e muito antes do clique no WhatsApp.
    if (idx >= STEPS.length) sendToSheet();

    render();
  }

  async function finish() {
    done = true;
    barFill.style.width = '100%';

    // Rede de seguranca: se por algum motivo nao tiver saido no answer(), sai
    // aqui. A flag "enviado" garante que nao vai duplicar a linha.
    sendToSheet();

    var first = (data.nome || '').split(' ')[0];
    await botSay([
      'Prontinho, ' + first + '! ✅',
      'Recebi todas as informações. Vou te chamar agora no WhatsApp pra continuarmos por lá.'
    ]);

    var link = 'https://wa.me/' + CONFIG.whatsapp + '?text=' +
               encodeURIComponent(CONFIG.whatsappMsg);
    var a = el('a', 'cf-cta', 'Continuar no WhatsApp →');
    a.href = link;
    a.target = '_blank';
    a.rel = 'noopener';
    foot.appendChild(a);
    foot.appendChild(el('div', 'cf-lgpd',
      'Seus dados são tratados com confidencialidade e usados apenas para este atendimento.'));

    setTimeout(function () { window.location.href = link; }, CONFIG.redirectDelay);
  }

  /* ---------- ENVIO PRA PLANILHA ----------
     sendBeacon e a forma correta de mandar dados quando a pagina esta prestes
     a navegar: o navegador garante a entrega mesmo depois do unload. O fetch
     comum era cancelado no meio do caminho quando o usuario ia pro WhatsApp. */
  function sendToSheet() {
    if (enviado) { log('ja enviado, ignorando'); return true; }
    if (!CONFIG.sheetUrl || CONFIG.sheetUrl.indexOf('http') !== 0) {
      log('sheetUrl nao configurada');
      return false;
    }

    var p = new URLSearchParams();
    Object.keys(data).forEach(function (k) { p.append(k, data[k]); });
    p.append('origem', location.href);
    p.append('data', new Date().toLocaleString('pt-BR'));

    // UTMs da URL (rastreamento de campanha)
    var qs = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      p.append(k, qs.get(k) || '');
    });

    var corpo = p.toString();
    var tipo = 'application/x-www-form-urlencoded;charset=UTF-8';
    var ok = false;

    if (navigator.sendBeacon) {
      try {
        ok = navigator.sendBeacon(CONFIG.sheetUrl, new Blob([corpo], { type: tipo }));
        log('sendBeacon:', ok);
      } catch (e) {
        log('sendBeacon falhou:', e);
      }
    }

    if (!ok) {
      // Fallback. keepalive mantem a requisicao viva durante a navegacao.
      try {
        fetch(CONFIG.sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          keepalive: true,
          headers: { 'Content-Type': tipo },
          body: corpo
        }).then(function () { log('fetch enviado'); })
          .catch(function (e) { log('fetch falhou:', e); });
        ok = true;
      } catch (e) {
        log('fetch nao disponivel:', e);
      }
    }

    enviado = ok;
    return ok;
  }

  /* ---------- GATILHOS ----------
     Um botao/link abre o chat de 3 jeitos (use o que for mais facil no seu
     construtor de paginas):
       1. atributo  data-chatform-open
       2. classe    chatform-open
       3. link para #chatform                                                */
  var TRIGGER = '[data-chatform-open],.chatform-open,a[href="#chatform"],a[href$="#chatform"]';

  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    var t = e.target.closest(TRIGGER);
    if (t) { e.preventDefault(); open(); }
  });

  /* ---------- API PUBLICA ---------- */
  function open() {
    build();
    host.style.display = 'block';
    document.documentElement.style.overflow = 'hidden';
    if (!body.children.length) {
      idx = 0;
      data = {};
      done = false;
      enviado = false;
      render();
    }
  }

  function close() {
    if (!host) return;
    host.style.display = 'none';
    document.documentElement.style.overflow = '';
    if (done) reset();
  }

  function reset() {
    idx = 0;
    data = {};
    done = false;
    enviado = false;
    if (body) body.innerHTML = '';
    if (foot) foot.innerHTML = '';
    if (barFill) barFill.style.width = '0';
  }

  // Diagnostico: rode ChatForm.testarPlanilha() no console do site.
  function testarPlanilha() {
    data = {
      nome: 'TESTE ChatForm',
      email: 'teste@teste.com',
      whatsapp: '(11) 90000-0000',
      instagram: '@teste',
      funcionarios: 'Individual',
      faturamento: 'De R$0 a R$30 mil',
      trafego: 'Ainda não invisto'
    };
    enviado = false;
    var r = sendToSheet();
    data = {};
    enviado = false;
    console.log(r
      ? 'Envio disparado. Abra a planilha e procure a linha "TESTE ChatForm" (pode levar alguns segundos).'
      : 'Nao foi possivel disparar o envio. Confira CONFIG.sheetUrl.');
    return r;
  }

  window.ChatForm = {
    open: open,
    close: close,
    reset: reset,
    config: CONFIG,
    data: function () { return data; },
    testarPlanilha: testarPlanilha
  };

  // Abre sozinho se a pessoa chegar pela URL .../pagina#chatform
  if (location.hash === '#chatform') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { open(); });
    } else {
      open();
    }
  }
})();
