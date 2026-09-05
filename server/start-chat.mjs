// Render runs this entry point. It must never open or initialize the local CMS database.
process.env.CMS_ENABLED = 'false';
process.env.CHAT_ONLY = 'true';
await import('./index.mjs');
