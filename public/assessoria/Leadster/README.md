# Chat Form — formulário conversacional estilo Leadster

Formulário que abre em tela cheia com cara de conversa de WhatsApp. O usuário responde
pergunta por pergunta, as respostas vão para a planilha do Google e, no final, a pessoa é
redirecionada para o WhatsApp com uma mensagem curta.

## Arquivos

| Arquivo | O que é |
|---|---|
| `chat-form.js` | O widget inteiro (HTML + CSS + JS + a foto de perfil). É o único arquivo que vai pro site. |
| `demo.html` | Página de exemplo só pra testar. Não precisa subir. |
| `apps-script.gs` | Código que você cola no Google Apps Script pra receber os leads na planilha. |
| `elementor-widget-html.txt` | O mesmo script já embrulhado em `<script>`, pronto pra colar num widget HTML do Elementor. |
| `foto perfil.jpg` | Original da logo. Já está embutida no `chat-form.js`, não precisa subir. |

## Como está configurado

- **Planilha:** já apontando pro seu webhook do Apps Script.
- **WhatsApp:** a mensagem enviada é só `Olá, vim pelo site e gostaria de saber mais.`
  As respostas do formulário **não** vão na mensagem — vão apenas pra planilha.
- **Foto de perfil:** a logo da Insider já está embutida como base64 (redimensionada pra
  128px, ~3 KB), então não depende de nenhum arquivo externo.
- **Falta só uma coisa:** trocar o número do WhatsApp em `CONFIG.whatsapp`, na
  linha 16 do `chat-form.js`. Hoje está o placeholder `5511999999999`.

## Instalação em site comum (HTML)

1. Suba o `chat-form.js` junto com os arquivos do site.
2. Antes de `</body>`, adicione:

```html
<script src="chat-form.js" defer></script>
```

3. Marque os botões que devem abrir o chat (veja a seção de gatilhos abaixo).

---

## Instalação no WordPress

### Passo 1 — colocar o script no site

Escolha **um** dos caminhos:

**A) Widget HTML do Elementor (o mais rápido)**

Funciona: o widget HTML executa `<script>` normalmente no frontend.

1. Abra o arquivo `elementor-widget-html.txt` e copie o conteúdo inteiro.
2. Na página, arraste um widget **HTML** para o final (última seção, depois do rodapé
   do conteúdo).
3. Cole. Atualize a página.

> **Cole sempre o `elementor-widget-html.txt`, não o `chat-form.js`.** O `.txt` já vem
> com a tag `<script>` correta e com as tags de fechamento internas escapadas. Se o
> código aparecer como texto solto no rodapé do site, é sinal de que o bloco tem um
> `</script>` no meio — o navegador fecha o script ali e mostra o resto como texto.

Cuidados desse método:

- **Use uma vez só por página.** Dois widgets HTML com o mesmo script = script rodando
  duas vezes. Adicionei uma trava que ignora a segunda carga, mas evite mesmo assim.
- **Vale só na página onde você colou.** Se quiser o chat no site inteiro, ou coloque o
  widget num *template de rodapé* do Elementor (Templates → Theme Builder → Footer), ou
  use o caminho B.
- O widget não mostra nada na tela, mas ocupa espaço no layout. Se aparecer um vão em
  branco, zere o padding/margin dele na aba **Avançado**.
- No **editor** do Elementor o chat pode não abrir ao clicar (o editor intercepta os
  cliques). Teste sempre na página publicada, em aba anônima.

**B) Plugin WPCode (mais robusto, vale pro site inteiro)**

1. Instale o plugin **WPCode – Insert Headers and Footers** (ou "Code Snippets").
2. Vá em *Code Snippets → Add Snippet → Add Your Custom Code*.
3. Tipo do código: **HTML Snippet**.
4. Cole o conteúdo inteiro do `chat-form.js` dentro de uma tag `<script>`:

```html
<script>
/* cole aqui TODO o conteúdo do chat-form.js */
</script>
```

5. Em *Insertion*, escolha **Site Wide Footer**. Ative e salve.

Esse caminho é o mais à prova de erro: não precisa subir arquivo, não tem problema de
caminho e continua funcionando se você trocar de tema.

**C) Enfileirando o arquivo pelo tema (mais limpo)**

1. Suba o `chat-form.js` para `/wp-content/uploads/` (via FTP ou pelo gerenciador de
   arquivos da hospedagem).
2. No **tema filho**, em `functions.php`, adicione:

```php
add_action( 'wp_enqueue_scripts', function () {
    wp_enqueue_script(
        'chat-form',
        content_url( 'uploads/chat-form.js' ),
        array(),
        '1.0',
        true // carrega no rodapé
    );
} );
```

> Não edite o `functions.php` do tema principal — a próxima atualização apaga.
> Se não tiver tema filho, use o caminho A ou B.

**D) Bloco HTML no Gutenberg (só naquela página)**

No editor de blocos, adicione um bloco **HTML personalizado** no fim da página e cole o
script dentro de `<script>...</script>`, como no caminho B.

### Passo 2 — fazer os botões que já existem abrirem o chat

Como a página já tem vários botões, você não precisa recriar nenhum. Escolha o gatilho
mais fácil de aplicar no seu construtor:

| Onde você monta a página | O que fazer |
|---|---|
| **Elementor** (funciona na versão free) | Selecione o botão → aba **Avançado** → campo **Classes CSS** → escreva `chatform-open` |
| **Elementor Pro** | Também dá pra usar aba Avançado → *Atributos* → `data-chatform-open\|1` |
| **Editor de blocos (Gutenberg)** | Selecione o botão → painel direito → **Avançado** → *Classe(s) CSS adicional(is)* → `chatform-open` |
| **Divi / Beaver / WPBakery** | Campo "CSS Class" nas opções avançadas do módulo → `chatform-open` |
| **Qualquer botão que seja um link** | Troque o destino do link por `#chatform` |
| **Menu do WordPress** | Aparência → Menus → adicione um *Link personalizado* com URL `#chatform` |

Os três gatilhos fazem exatamente a mesma coisa e podem conviver na mesma página. Aplique
em quantos botões quiser.

Também dá pra abrir por código, se você quiser disparar num popup de saída ou por tempo:

```js
ChatForm.open();
```

E se alguém chegar pela URL `seusite.com.br/pagina#chatform`, o chat abre sozinho — útil
pra usar em anúncios, bio do Instagram ou links de e-mail.

### Passo 3 — testar

Abra a página **numa aba anônima** (o cache do WordPress costuma atrapalhar) e clique num
dos botões. Complete o formulário e confira se a linha apareceu na planilha.

> Se você usa plugin de cache (WP Rocket, LiteSpeed, W3 Total Cache), limpe o cache depois
> de instalar. Se usar minificação/combinação de JS e algo quebrar, adicione o
> `chat-form.js` na lista de exclusão de otimização do plugin.

---

## Gatilhos (resumo)

Qualquer um destes abre o chat:

```html
<button data-chatform-open>Fale conosco</button>
<button class="chatform-open">Fale conosco</button>
<a href="#chatform">Fale conosco</a>
```

## Configuração

Bloco `CONFIG` no topo do `chat-form.js`:

```js
var CONFIG = {
  sheetUrl: 'https://script.google.com/macros/s/AKfyc.../exec',
  whatsapp: '5511999999999',   // ← TROCAR pelo número real (só números, com o 55)
  whatsappMsg: 'Olá, vim pelo site e gostaria de saber mais.',
  brandName: 'Insider Mídia',
  brandTag: 'online agora',
  avatar: 'data:image/jpeg;base64,...',  // a logo, já embutida
  accent: '#25D366',           // cor principal do chat
  typingDelay: 550,            // velocidade do "digitando..."
  redirectDelay: 2200          // pausa antes de ir pro WhatsApp
};
```

O `avatar` aceita três formatos: iniciais (`'IM'`), uma URL (`'/wp-content/uploads/logo.png'`)
ou o data-URI que está lá agora.

## A planilha

O webhook já está configurado. Se precisar recriar:

1. Planilha nova no Google Sheets → **Extensões → Apps Script**.
2. Cole o conteúdo de `apps-script.gs`.
3. **Implantar → Nova implantação → App da Web**, com *Executar como:* **Eu** e
   *Quem tem acesso:* **Qualquer pessoa**.
4. Copie a URL terminada em `/exec` para `CONFIG.sheetUrl`.

A aba `Leads` e o cabeçalho são criados sozinhos no primeiro envio. Pra receber um e-mail
a cada lead novo, descomente o trecho `MailApp.sendEmail` no final do `doPost`.

> Se editar o Apps Script depois, publique uma **nova versão** da implantação
> (Implantar → Gerenciar implantações → lápis → Versão: Nova). Senão o site continua
> falando com o código antigo.

## Perguntas do formulário

Estão no array `STEPS` do `chat-form.js`, na ordem em que aparecem:

1. Nome — texto, validado
2. E-mail — validado
3. WhatsApp — máscara `(00) 00000-0000`
4. Instagram da empresa — máscara de `@`, com opção de pular
5. Quantos funcionários — 6 opções
6. Faturamento mensal — 6 faixas (R$0–30k até acima de R$1 mi)
7. Investimento em tráfego — 6 faixas

### Mexer nas perguntas

Cada item do `STEPS` segue este formato:

```js
{
  key: 'segmento',                       // vira a coluna na planilha
  bot: ['Qual o segmento da empresa?'],  // cada string é um balão separado
  type: 'options',                       // 'options' | 'text' | 'email' | 'tel'
  options: ['Serviços', 'Varejo', 'Indústria']
}
```

Para perguntas abertas, troque `options` por `placeholder` e, se quiser, `validate`
(retorna `true` se estiver ok, ou a mensagem de erro em texto). Use `optional: true`
pra exibir o link de pular.

O `bot` também aceita uma função, se quiser usar uma resposta anterior:

```js
bot: function (d) { return ['Boa, ' + d.nome.split(' ')[0] + '! E o seu e-mail?']; }
```

**Se adicionar ou renomear uma pergunta**, lembre de incluir a `key` no array `COLUNAS`
do `apps-script.gs` — senão o dado não vai pra planilha.

## Se o lead não chegar na planilha

O `apps-script.gs` agora abre a planilha pelo **ID** (`PLANILHA_ID`), e não por
`getActiveSpreadsheet()`. Isso resolve o caso mais comum: um projeto do Apps Script criado
avulso em `script.google.com` não tem "planilha ativa", então `getActiveSpreadsheet()`
devolve `null`, o script quebra e — como o envio é `no-cors` — o site nunca fica sabendo.

Confira que o `PLANILHA_ID` bate com o trecho da URL da sua planilha entre `/d/` e `/edit`.
Copie da URL, não digite: o ID mistura maiúsculas e minúsculas parecidas (`l`, `I`, `1`).

Testes, nesta ordem — cada um elimina uma causa:

**Teste 1 — o código e as permissões estão certos?**
No editor do Apps Script, selecione a função `testarManual` no menu do topo e clique em
**Executar**. Autorize quando ele pedir.

- Apareceu "TESTE MANUAL" na aba `assessoria` → siga pro teste 2.
- Deu erro → leia a mensagem: normalmente é `PLANILHA_ID` errado ou falta de autorização.

**Teste 2 — a implantação está no ar e pública?**
Abra a URL do `/exec` numa aba anônima. Deve aparecer algo como:

```json
{"status":"online","planilha":"Leads INSIDER OFICIAL","aba":"assessoria","existe":true,"linhas":1}
```

- Veio esse JSON com o nome da sua planilha → a implantação está correta, vá pro teste 3.
- Pediu login, deu erro ou veio `{"status":"erro",...}` → *Implantar → Gerenciar
  implantações → lápis*, ajuste **Quem tem acesso: Qualquer pessoa** e salve como
  **Versão: Nova**.

> Toda edição no Apps Script exige publicar uma versão nova. Sem isso a URL continua
> executando o código antigo — é a pegadinha número um dessa ferramenta.

**Teste 3 — a gravação pela URL funciona?**
Acrescente `?teste=1` no fim da URL do `/exec` e abra no navegador. Deve responder
`{"status":"gravou","linha":2,...}` e aparecer a linha "TESTE VIA NAVEGADOR" na planilha.

**Teste 4 — o site está enviando?**
Na página publicada, console do navegador (F12 → Console):

```js
ChatForm.testarPlanilha()
```

Manda um lead falso "TESTE ChatForm". Se aparecer na planilha, o circuito inteiro está
funcionando. Pra ver o passo a passo do envio, ligue `debug: true` no `CONFIG`.

**Aba `_erros`:** se algum envio quebrar dentro do Apps Script, o erro é registrado numa
aba chamada `_erros` na própria planilha, com data e mensagem. Se ela existir, leia.
## Detalhes de comportamento

- No celular ocupa a tela inteira; no desktop vira um card centralizado de 460px.
- Fecha no X, no `Esc` ou clicando fora. Se já tiver terminado, começa do zero na próxima abertura.
- Barra de progresso no topo acompanha as respostas.
- Os dados vão pra planilha **no instante em que a última pergunta é respondida** — antes
  das mensagens de encerramento e antes do clique no WhatsApp. Quem desistir na última
  tela já está registrado.
- O envio usa `navigator.sendBeacon`, que é feito justamente pra entregar dados enquanto a
  página está saindo — não é cancelado quando o usuário vai pro WhatsApp. Se o navegador
  não suportar, cai num `fetch` com `keepalive`.
- Não dá pra ler a resposta do Apps Script (é `no-cors`), então a conferência de que o
  lead chegou é sempre olhando a planilha.
- **O widget roda dentro de um Shadow DOM.** Isso isola o CSS: nenhuma regra do tema ou do
  Elementor entra, e nenhum estilo do widget vaza pro site. Foi o que resolveu os botões
  saírem laranja no WordPress. Como efeito colateral, o CSS do widget só pode ser editado
  dentro do próprio `chat-form.js` — regras de "CSS adicional" do tema não alcançam ele.
