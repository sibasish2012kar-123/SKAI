export default async function handler(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://sibasish2012kar-123.github.io"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Send a POST request."
    });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing from Vercel environment variables."
      });
    }

    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please send a message."
      });
    }

    const conversation = messages
      .filter(
        item =>
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string"
      )
      .slice(-12)
      .map(item => ({
        role: item.role,
        content: item.content.slice(0, 4000)
      }));

    if (
      conversation.length === 0 ||
      !conversation.some(item => item.role === "user")
    ) {
      return res.status(400).json({
        error: "No valid user message was provided."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions:
            "You are SKI AI, a friendly and helpful AI assistant. Answer clearly, accurately, and honestly.",
          input: conversation.map(item => ({
            role: item.role,
            content: item.content
          }))
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, data);

      return res.status(502).json({
        error:
          "OpenAI rejected the request. Check your API access, model availability, and API billing."
      });
    }

    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("");

    if (!reply) {
      return res.status(502).json({
        error: "The AI provider returned no text."
      });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("SKI AI backend error:", error);

    return res.status(500).json({
      error: "Backend error. Please check Vercel Runtime Logs."
    });
  }
}

