export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- READ DATA ---
    if (request.method === "GET" && url.pathname === "/data") {
      const raw = await env.DB.get("data");
      return new Response(raw ?? "{}", {
        headers: { "Content-Type": "application/json" }
      });
    }

    // --- WRITE DATA ---
    if (request.method === "POST" && url.pathname === "/data") {
      const secret = url.searchParams.get("secret");
      if (secret !== env.SECRET) {
        return new Response("Forbidden", { status: 403 });
      }

      try {
        const body = await request.json();
        await env.DB.put("data", JSON.stringify(body));
        return new Response("OK");
      } catch (err) {
        return new Response("Invalid JSON", { status: 400 });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
