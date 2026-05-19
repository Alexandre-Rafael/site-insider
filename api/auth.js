// /api/auth — inicia o fluxo OAuth com o GitHub
// Chamada pelo Decap quando o gestor clica em "Login with GitHub" no /admin
export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('OAUTH_CLIENT_ID não configurada nas variáveis de ambiente da Vercel.');
    return;
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${proto}://${host}/api/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
    state: Math.random().toString(36).slice(2),
  });
  res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params}` });
  res.end();
}
