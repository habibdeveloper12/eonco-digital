/**
 * Packages the WordPress plugin for self-updates. Runs before every build
 * (npm "prebuild"), so deploying the website also publishes the plugin:
 *
 *   public/wp-plugin/eonco-headless.zip    the plugin (forward-slash paths, works on Linux hosts)
 *   public/wp-plugin/eonco-headless.json   { version, package, ... } read by the plugin's updater
 *   wordpress/eonco-headless.zip           same zip, for the very first manual upload
 *
 * To ship a plugin change: edit wordpress/eonco-headless/eonco-headless.php,
 * bump "Version:" and VERSION in that file, then deploy. WordPress updates itself.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "wordpress", "eonco-headless");
const outDir = path.join(root, "public", "wp-plugin");
const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.eoncodigital.com").replace(/\/+$/, "");

const main = fs.readFileSync(path.join(src, "eonco-headless.php"), "utf8");
const version = main.match(/^\s*\*\s*Version:\s*([0-9.]+)/m)?.[1];
if (!version) throw new Error("Could not read Version: from eonco-headless.php");

// --- minimal ZIP writer (deflate) -------------------------------------------
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function zip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const { name, data } of files) {
    const nameBuf = Buffer.from(name, "utf8");
    const comp = zlib.deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
    local.writeUInt32LE(0, 10); local.writeUInt32LE(crc, 14); local.writeUInt32LE(comp.length, 18); local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26); local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, comp);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(8, 10);
    central.writeUInt32LE(0, 12); central.writeUInt32LE(crc, 16); central.writeUInt32LE(comp.length, 20); central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28); central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);
    offset += 30 + nameBuf.length + comp.length;
  }
  const centralBuf = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, centralBuf, end]);
}

// --- collect plugin files ----------------------------------------------------
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else files.push({ name: "eonco-headless/" + path.relative(src, full).split(path.sep).join("/"), data: fs.readFileSync(full) });
  }
})(src);

const archive = zip(files);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "eonco-headless.zip"), archive);
fs.writeFileSync(path.join(root, "wordpress", "eonco-headless.zip"), archive);
fs.writeFileSync(
  path.join(outDir, "eonco-headless.json"),
  JSON.stringify(
    {
      name: "Eonco Headless",
      slug: "eonco-headless",
      version,
      // Relative: the plugin resolves it against its own Website URL setting.
      package: `eonco-headless.zip?v=${version}`,
      homepage: site,
      requires: "6.2",
      tested: "6.8",
      changelog: `<p>Version ${version}, published with the Eonco Digital website.</p>`,
    },
    null,
    2,
  ),
);
console.log(`[plugin] eonco-headless ${version} packaged (${files.length} file, ${archive.length} bytes) → public/wp-plugin/`);
