import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverInquiry } from './contact.mjs';

const inquiry = { name: 'Test Visitor', email: 'visitor@example.com', subject: 'Project question', message: 'I would like to discuss a web project.', website: '' };
const config = { apiKey: 'test-only-key', from: 'Portfolio <portfolio@example.com>' };

test('inquiries validate fields before requesting delivery', async () => {
  const fetchImpl = () => { throw new Error('Should not call provider'); };
  for (const body of [null, [], {}, { ...inquiry, email: 'invalid' }, { ...inquiry, subject: 'Injected\r\nHeader' }, { ...inquiry, message: 'short' }, { ...inquiry, name: 'x'.repeat(101) }, { ...inquiry, message: 'x'.repeat(5001) }]) {
    assert.equal((await deliverInquiry(body, { ...config, fetchImpl })).status, 400);
  }
  assert.equal((await deliverInquiry({ ...inquiry, website: 'spam.example' }, { ...config, fetchImpl })).status, 200);
});

test('missing email configuration never claims delivery', async () => {
  assert.equal((await deliverInquiry(inquiry)).status, 503);
});

test('delivery uses fixed recipient, plain text, and visitor reply-to', async () => {
  const result = await deliverInquiry({ ...inquiry, to: 'untrusted@example.com', from: 'untrusted@example.com' }, {
    ...config,
    fetchImpl: async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails');
      const body = JSON.parse(options.body);
      assert.deepEqual(body.to, ['kyawhmuesan@gmail.com']);
      assert.equal(body.from, config.from);
      assert.equal(body.reply_to, inquiry.email);
      assert.ok(body.text.includes(inquiry.message));
      assert.equal(body.html, undefined);
      return Response.json({ id: 'mock-delivery-id' });
    },
  });
  assert.deepEqual(result, { status: 200, body: { ok: true } });
});

test('provider rejection, malformed responses, and timeout return a retryable error', async () => {
  for (const fetchImpl of [async () => Response.json({ error: 'private provider detail' }, { status: 429 }), async () => Response.json({}), async () => { throw new Error('timeout'); }]) {
    const result = await deliverInquiry(inquiry, { ...config, fetchImpl });
    assert.equal(result.status, 502);
    assert.equal(result.body.ok, undefined);
    assert.ok(!result.body.error.includes('private provider detail'));
  }
});
