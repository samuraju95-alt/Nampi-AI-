Nanbi AI - Real AI Netlify starter (phone-friendly)

IMPORTANT:
- This project sends messages to the OpenAI API from a Netlify Function.
- Never put your API key in index.html, JavaScript, GitHub, or any ZIP.
- Set OPENAI_API_KEY in Netlify Project configuration > Environment variables.
- API billing is separate from a ChatGPT subscription; set usage limits/budget in your API account.
- The provided client-side speech recognition and speech synthesis are browser features; this does not add natural voice generation. Replies are AI-generated, but spoken with the installed device/browser voice.

Phone-only setup:
1. Create an OpenAI API key in the OpenAI API platform. Do not send the key in chat or paste it into code.
2. Create a GitHub repository and upload these files preserving paths, including netlify/functions/chat.mjs and netlify.toml. Do not upload a .env file or any key.
3. In Netlify, import/connect that GitHub repository as a site. Build command can be empty; publish directory is "." (or follow Netlify's detected configuration).
4. In the Netlify site dashboard open Project configuration > Environment variables; add key OPENAI_API_KEY and value your API key. Keep it secret.
5. Trigger a new deploy after adding the variable.
6. Open the deployed site's URL and test a voice/text message.
7. If errors occur, inspect the Netlify function logs. 401 = key issue; 429 = quota/billing/rate limit; 500 missing environment variable.
8. The old drag-and-drop static deploy will not run serverless functions; connect the repo so Netlify can build and deploy the function.

Security note:
This minimal starter has no user login or per-user rate limit. Treat the URL as public. Before sharing widely, add rate limiting/abuse protection and consider restricting access. Never use this public demo for sensitive information.
