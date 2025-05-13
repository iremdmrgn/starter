import { Client, Databases } from "node-appwrite";

console.log("✅ Function dosyası yüklendi");

export default async ({ req, res, log }) => {
  log("🚀 Function başladı");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    const rawBody = req.body || "{}";
    log("📥 raw req.body:", rawBody);

    const body = JSON.parse(rawBody);
    log("📦 Parsed body:", JSON.stringify(body));

    const { documentId, username, bio, avatarIndex } = body;

    if (!documentId) {
      log("❌ Eksik documentId");
      return res.json({ error: "Missing documentId" }, 400);
    }

    log("🧾 Güncellenecek veriler:");
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

    log("✅ Güncelleme başarılı:", result?.$id || result);

    const responsePayload = {
      success: true,
      updated: {
        id: result?.$id,
        username: result?.username,
        bio: result?.bio,
        avatarIndex: result?.avatarIndex,
      },
    };

    log("📤 Dönülen response:", JSON.stringify(responsePayload));
    return res.json(responsePayload);
  } catch (err) {
    log("❌ Hata oluştu:", err.message);
    return res.json({ error: "Update failed", details: err.message }, 500);
  }
};
