import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('hiring, mixed skill questions, and explicit drafts reach AI with conversation context', async t => {
  const received = [];
  const upstream = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    received.push(JSON.parse(Buffer.concat(chunks)));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ choices: [{ message: { content: `Generated answer ${received.length}` } }] }));
  });
  upstream.listen(0, '127.0.0.1'); await once(upstream, 'listening');
  const child = spawn(process.execPath, ['server/start-chat.mjs'], {
    env: { ...process.env, PORT: '0', HOST: '127.0.0.1', NODE_ENV: 'test', PUBLIC_ORIGIN: '', AIML_API_KEY: 'test-only', AIML_MODEL: 'test-model', AIML_API_URL: `http://127.0.0.1:${upstream.address().port}` },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(async () => {
    if (child.exitCode === null) { const stopped = once(child, 'exit'); child.kill('SIGTERM'); await stopped; }
    upstream.closeAllConnections(); await new Promise(resolve => upstream.close(resolve));
  });
  const url = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Server startup timed out')), 10000);
    child.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
    });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited: ${code}`)); });
  });
  const questions = [
    'How can I hire him? Can he draw Land Cover Mapping?',
    'I would like to hire him as a Backend Developer for render, I would like to have an interview with him',
    'Write an email inviting him for a backend developer interview.',
    'How can I contact him?',
    'ฉันต้องการจ้าง Kyaw เขามีประสบการณ์อะไรบ้าง',
  ];
  for (const [index, question] of questions.entries()) {
    const messages = [{ role: 'user', content: 'We are recruiting backend developers.' }, { role: 'assistant', content: 'What would you like to know about Kyaw?' }, { role: 'user', content: question }];
    const response = await fetch(`${url}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages }) });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { message: `Generated answer ${index + 1}`, mode: 'live' });
    assert.equal(received.length, index + 1, 'Must call AI instead of intercepting contact keywords');
    assert.deepEqual(received[index].messages.slice(-3), messages);
  }
});
