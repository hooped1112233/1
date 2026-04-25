// 需要屏蔽的UID列表
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
// referer 格式: https://m.weibo.cn/detail/123456?uid=3349262214
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

// 从 body 中提取博主 uid（备用方案）
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

// 获取请求头（Loon 需要在脚本中声明）
let referer = $request.headers["Referer"] || $request.headers["referer"] || "";
let uid = getUidFromReferer(referer);

// 如果 referer 没找到，再从 body 里找
if (!uid) {
  uid = getUidFromBody($response.body);
}

if (uid && BLOCKED_UIDS.has(uid)) {
  // 命中屏蔽列表，返回空
  $done({ body: "{}" });
} else {
  // 正常返回
  $done({ body: $response.body });
}
