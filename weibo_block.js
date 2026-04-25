// 需要屏蔽的11个账号UID列表
const BLOCKED_UIDS = new Set([
  "3349262214",  // 大白糖film
  "5737015304",  // 放牧某某汪x
  "7925005096",
  "2788092855",
  "6910476762",
  "2786743450",
  "7952241599",
  "6487833349",
  "2670855470",
  "1769011094",
  "3964876137"
]);

// 从 referer 中提取 uid
function getUidFromReferer(referer) {
  if (!referer) return null;
  let match = referer.match(/[?&]uid=(\d+)/);
  if (match) return match[1];
  match = referer.match(/\/u\/(\d+)/);
  if (match) return match[1];
  match = referer.match(/\/detail\/\d+\?uid=(\d+)/);
  if (match) return match[1];
  return null;
}

// 从 body 中提取博主 uid
function getUidFromBody(body) {
  try {
    let obj = JSON.parse(body);
    if (obj.status && obj.status.user && obj.status.user.id) {
      return String(obj.status.user.id);
    }
    if (obj.user && obj.user.id) {
      return String(obj.user.id);
    }
  } catch(e) {}
  return null;
}

let referer = $request.headers["Referer"] || $request.headers["referer"] || "";
let uid = getUidFromReferer(referer);

if (!uid && $response.body) {
  uid = getUidFromBody($response.body);
}

if (uid && BLOCKED_UIDS.has(uid)) {
  $done({ body: "{}" });
} else {
  $done({ body: $response.body });
}
