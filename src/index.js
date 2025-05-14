import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log }) => {
  log("🚀 Function başladı");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    const raw = req.bodyRaw;

    if (!raw) {
      log("❌ Gövde boş geldi");
      return res.send(JSON.stringify({ error: "Empty request body" }), 400);
    }

    const body = JSON.parse(raw); // ✅ işte burada çözüm

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

