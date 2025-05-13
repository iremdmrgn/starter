import { Client, Databases } from "node-appwrite";

// Bu log build sırasında çıkar
console.log("✅ index.js yüklendi");

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

    log("📦 Gelen body:", JSON.stringify(body));
    const { documentId, username, bio, avatarIndex } = body;

    if (!documentId) {
      log("❌ Eksik documentId");
      return res.json({ error: "Missing documentId" }, 400);
    }

    log("📄 Güncellenen alanlar:");
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

    const finalResponse = { success: true, updated: result };
    log("📤 Final response:", JSON.stringify(finalResponse));

    return res.json(finalResponse); // ✅ bu JSON app'e döner
  } catch (err) {
    log("❌ Function error:", JSON.stringify(err, null, 2));
    return res.json({ error: "Update failed", details: err.message }, 500);
  }
};
    return res.json({ error: "Update failed", details: err.message }, 500);
  }
};
