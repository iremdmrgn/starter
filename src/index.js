import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log }) => {
  log("🚀 Function başladı");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    // ✅ GitHub function'larda payload yerine bodyRaw çözülmeli
    let rawBody = req.bodyRaw || req.body || "{}";
    if (typeof rawBody !== "string") {
      rawBody = Buffer.from(rawBody).toString("utf-8");
    }
    const body = JSON.parse(rawBody);

    log("📦 Parsed body:", JSON.stringify(body));

    const { documentId, username, bio, avatarIndex } = body;

    if (!documentId) {
      log("❌ Eksik documentId");
      return res.send(JSON.stringify({ error: "Missing documentId" }), 400);
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
    return res.send(JSON.stringify({ success: true, updated: result }));
  } catch (err) {
    log("❌ Function error:", err instanceof Error ? err.message : String(err));
    return res.send(
      JSON.stringify({
        error: "Update failed",
        details: err instanceof Error ? err.message : String(err),
      }),
      500
    );
  }
};


