import { Client, Databases } from "node-appwrite";

console.log("✅ index.js yüklendi");

export default async ({ req, res, log }) => {
  log("🚀 Function başladı");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    // ✅ Hem body hem bodyRaw üzerinden almaya çalış (hangisi varsa)
    const raw = req.bodyRaw || "{}";
    const fallbackParsed = JSON.parse(raw);
    const body = req.body && Object.keys(req.body).length > 0 ? req.body : fallbackParsed;

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




