import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log }) => {
  log("🚀 Function başladı");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    let rawBody = req.bodyRaw || req.body || "{}";

    // 🔥 Eğer Buffer geldiyse stringe çevir
    if (typeof rawBody !== "string") {
      rawBody = Buffer.from(rawBody).toString("utf8");
    }

    log("📥 rawBody string:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      log("❌ JSON parse hatası:", err.message);
      return res.send(JSON.stringify({ error: "Invalid JSON body" }), 400);
    }

    log("📦 Parsed body:", JSON.stringify(body));

    const { documentId, username, bio, avatarIndex } = body;

    if (!documentId) {
      log("❌ Eksik documentId");
      return res.send(JSON.stringify({ error: "Missing documentId" }), 400);
    }

    const result = await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.USERS_COLLECTION_ID,
      documentId,
      {
        username,
        bio,
        avatarIndex,
        avatarUrl: `avatar-${avatarIndex}`,
      }
    );

    log("✅ Güncelleme başarılı:", result.$id);
    return res.send(JSON.stringify({ success: true, updated: result }));
  } catch (err) {
    log("❌ Function error:", err.message);
    return res.send(
      JSON.stringify({ error: "Update failed", details: err.message }),
      500
    );
  }
};



