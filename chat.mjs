export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers: { "content-type": "application/json", "allow": "POST" }
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set in Netlify environment variables." }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const message = String(body.message || "").trim().slice(0, 4000);
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is empty." }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    const history = Array.isArray(body.history) ? body.history.slice(-10).map(item => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: String(item.content || "").slice(0, 1500)
    })) : [];

    const input = [
      {
        role: "system",
        content: "You are Nanbi, a warm, kind, friendly female-coded AI companion for a user who prefers Tamil and Tanglish (Tamil written in Latin letters). Reply naturally in the same language/script style as the user's latest message. Keep replies conversational and varied; do not repeat stock phrases or claim to be human. Usually 1-4 short sentences, unless the user asks for detail. Ask a relevant follow-up only when it feels natural. Be honest that you are an AI. Never ask for passwords, API keys, or payment secrets. If a user is in immediate danger, encourage contacting local emergency help and a trusted person."
      },
      ...history,
      { role: "user", content: message }
    ];

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input,
        max_output_tokens: 300
      })
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return new Response(JSON.stringify({
        error: upstream.status === 401 ? "API key invalid. Check OPENAI_API_KEY in Netlify." :
               upstream.status === 429 ? "API quota/rate limit reached. Check API billing and limits." :
               "AI provider returned an error (" + upstream.status + ")."
      }), {
        status: upstream.status === 429 ? 429 : 502,
        headers: { "content-type": "application/json" }
      });
    }

    let reply = "";
    if (Array.isArray(result.output)) {
      for (const item of result.output) {
        if (item.type === "message" && Array.isArray(item.content)) {
          for (const part of item.content) {
            if (part.type === "output_text" && part.text) reply += part.text;
          }
        }
      }
    }
    reply = reply.trim() || "Sorry bro, reply generate aagala. Marubadi try pannalama?";
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Could not process this message. Please try again." }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};
