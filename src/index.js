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
    // 🔥 Sadece req.bodyRaw kullan (Expo'dan gelen fetch için bu gerekli)
    const rawBody = req.bodyRaw || "{}";
    log("📥 rawBody:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody); // 👈 Sadece string parse
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

    const payload = {
      username: username || "",
      bio: bio || "",
      avatarIndex: typeof avatarIndex === "number" ? avatarIndex : 0,
      avatarUrl: `avatar-${avatarIndex}`,
    };

    const result = await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.USERS_COLLECTION_ID,
      documentId,
      payload
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



