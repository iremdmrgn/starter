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
    const rawBody = req.body || "{}"; // ✅ bodyRaw kaldırıldı
    log("📥 rawBody:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      log("❌ JSON parse hatası:", err.message);
      return res.json({ error: "Invalid JSON body" }, 400);
    }

    log("📦 Parsed body:", JSON.stringify(body));
    const { documentId, username, bio, avatarIndex } = body;

    if (!documentId) {
      log("❌ Eksik documentId");
      return res.json({ error: "Missing documentId" }, 400);
    }

    log(`🆔 documentId: ${documentId}`);
    log(`👤 username: ${username}`);
    log(`📝 bio: ${bio}`);
    log(`🖼️ avatarIndex: ${avatarIndex}`);

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
    return res.json({ success: true, updated: result });
  } catch (err) {
    log("❌ Function error:", JSON.stringify(err, null, 2));
    return res.json({ error: "Update failed", details: err.message }, 500);
  }
};

