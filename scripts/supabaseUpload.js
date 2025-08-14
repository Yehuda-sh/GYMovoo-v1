/*
  Supabase Upload Script (CLI)
  שימוש: 
    $env:SUPABASE_URL="https://<project>.supabase.co"
    $env:SUPABASE_SERVICE_ROLE_KEY="<SERVICE_ROLE_KEY>"
    npm run supabase:upload -- --bucket public --prefix videos/ path/to/file1.mp4 path/to/file2.png

  הערה: אל תשתמש במפתח Service Role בצד לקוח/אפליקציה. רק מקומית/שרת/CI.
*/
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = { bucket: "public", prefix: "", files: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--bucket") args.bucket = argv[++i] || args.bucket;
    else if (a === "--prefix") args.prefix = argv[++i] || args.prefix;
    else if (!a.startsWith("--")) args.files.push(a);
  }
  if (args.prefix && !args.prefix.endsWith("/")) args.prefix += "/";
  return args;
}

function guessContentType(p) {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    case ".mov":
      return "video/quicktime";
    case ".mp3":
      return "audio/mpeg";
    case ".wav":
      return "audio/wav";
    case ".json":
      return "application/json";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

async function main() {
  const SUPABASE_URL = (
    process.env.SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    ""
  ).trim();
  const SERVICE_ROLE = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error("❌ חסר SUPABASE_URL או SUPABASE_SERVICE_ROLE_KEY בסביבה.");
    process.exit(1);
  }
  const { bucket, prefix, files } = parseArgs(process.argv.slice(2));
  if (!files.length) {
    console.error(
      "⚠️ לא סופקו קבצים להעלאה. שימוש: --bucket public --prefix videos/ <files...>"
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  let success = 0;
  for (const filePath of files) {
    try {
      const abs = path.resolve(filePath);
      const stat = fs.statSync(abs);
      if (!stat.isFile()) {
        console.warn(`⏭️ דילוג – לא קובץ: ${filePath}`);
        continue;
      }
      const body = fs.readFileSync(abs);
      const key = prefix + path.basename(abs);
      const contentType = guessContentType(abs);
      const { error } = await supabase.storage
        .from(bucket)
        .upload(key, body, {
          upsert: true,
          contentType,
          cacheControl: "public, max-age=31536000, immutable",
        });
      if (error) throw error;
      console.log(`✅ הועלה: ${bucket}/${key} (${contentType})`);
      success++;
    } catch (e) {
      console.error(`❌ כשל בהעלאה עבור ${filePath}:`, e.message || e);
    }
  }

  console.log(`\nסיום: ${success}/${files.length} הועלו בהצלחה.`);
  process.exit(success === files.length ? 0 : 2);
}

main().catch((e) => {
  console.error("❌ שגיאה כללית:", e);
  process.exit(1);
});
