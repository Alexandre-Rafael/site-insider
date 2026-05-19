// /api/callback — recebe o "code" do GitHub, troca por access_token
// e devolve pro Decap CMS pelo protocolo de postMessage.
export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!code) {
    res.status(400).send('Código de autorização não recebido.');
    return;
  }
  if (!clientId || !clientSecret) {
    res.status(500).send('Credenciais OAuth não configuradas na Vercel.');
    return;
  }

  let token;
  try {
    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error_description || data.error);
    token = data.access_token;
  } catch (err) {
    res.status(500).send(`Falha ao autenticar com GitHub: ${err.message}`);
    return;
  }

  const payload = JSON.stringify({ token, provider: 'github' });
  const html = `<!doctype html>
<html><body><script>
(function() {
  function receive(e) {
    if (!e.data || typeof e.data !== 'string') return;
    if (e.data !== 'authorizing:github') return;
    window.opener.postMessage('authorization:github:success:${payload}', e.origin);
    window.removeEventListener('message', receive, false);
  }
  window.addEventListener('message', receive, false);
  window.opener && window.opener.postMessage('authorizing:github', '*');
})();
</script>
<p>Autenticado. Você pode fechar esta janela.</p>
</body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
