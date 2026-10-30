// Project inquiry: receives the Start a Project form and emails it to Sand City Designs through Resend.
// Environment: RESEND_API_KEY (required), INQUIRY_TO (required, where inquiries go),
// INQUIRY_FROM (optional; a sender on a domain verified in Resend, e.g. "Sand City Designs <hello@sandcitydesigns.com>").

const FIELDS = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['business', 'Business name'],
  ['website', 'Current website'],
  ['service', 'Service of interest'],
  ['description', 'Project or challenge'],
  ['existing_branding', 'Existing branding'],
  ['content', 'Content and photos'],
  ['design_needs', 'Design needs'],
  ['current_tools', 'Current tools'],
  ['operational_challenge', 'Operational challenge'],
  ['users', 'Who would use it'],
  ['additional', 'Additional information'],
];
const REQUIRED = ['name', 'email', 'business', 'service', 'description'];
const SERVICES = ['Website Design', 'Branding', 'SEO', 'Custom Software', 'Multiple Services'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escape = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function readForm(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return await request.json();
  return Object.fromEntries(await request.formData());
}

export async function POST(request) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const reply = (status, body) => wantsJson || status !== 200
    ? Response.json(body, { status })
    : Response.redirect(new URL('/start-a-project?sent=1', request.url), 303);

  let raw;
  try { raw = await readForm(request); } catch { return reply(400, { error: 'We couldn’t read the form.' }); }

  // bots fill the hidden field; pretend it worked
  if (String(raw.company_url || '').trim()) return reply(200, { ok: true });

  const data = {};
  for (const [key] of FIELDS) {
    const value = String(raw[key] ?? '').trim().slice(0, 5000);
    if (value) data[key] = value;
  }
  if (REQUIRED.some(key => !data[key]) || !EMAIL.test(data.email) || !SERVICES.includes(data.service)) {
    return reply(400, { error: 'Please fill in your name, a valid email, your business name, the service and a short description.' });
  }

  const { RESEND_API_KEY, INQUIRY_TO, INQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !INQUIRY_TO) {
    console.error('inquiry: RESEND_API_KEY or INQUIRY_TO is not set');
    return reply(500, { error: 'The form isn’t connected yet.' });
  }

  const rows = FIELDS.filter(([key]) => data[key]);
  const text = rows.map(([key, label]) => `${label}:\n${data[key]}`).join('\n\n');
  const html = `<h2 style="font-family:Arial,sans-serif">New project inquiry</h2>` + rows.map(([key, label]) =>
    `<p style="font-family:Arial,sans-serif;margin:0 0 14px"><strong>${label}</strong><br>${escape(data[key]).replace(/\n/g, '<br>')}</p>`).join('');

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: INQUIRY_FROM || 'Sand City Designs <onboarding@resend.dev>',
      to: INQUIRY_TO.split(',').map(address => address.trim()),
      reply_to: data.email,
      subject: `New project inquiry: ${data.business} (${data.service})`,
      text,
      html,
    }),
  });
  if (!sent.ok) {
    console.error('inquiry: Resend error', sent.status, await sent.text());
    return reply(502, { error: 'We couldn’t send your details just now.' });
  }
  return reply(200, { ok: true });
}
