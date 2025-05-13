import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    const body = JSON.parse(req.body || "{}");
    log("📦 Gelen body:", JSON.stringify(body));

    const { documentId, username, bio, avatarIndex } = body;

    if (!documentId) {
      log("❌ Eksik documentId");
      return res.json({ error: "Missing documentId" }, 400);
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
    return res.json({ success: true, updated: result }); // ✅ Bu satır çalışmalı
  } catch (err) {
    log("❌ Function error:", err.message);
    return res.json({ error: "Update failed", details: err.message }, 500);
  }
};
