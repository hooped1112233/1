// 需要屏蔽的UID列表（请把中文名的两个填进来）
const BLOCKED_UIDS = new Set([
  "7925005096",
  "2788092855",
  "6910476762",
  "2786743450",
  "7952241599",
  "6487833349",
  "2670855470",
  "1769011094",
  "3964876137"
  // 这里添加"大白糖film"和"放牧某某汪x"的数字uid
]);

let body = $response.body;
if (body) {
  try {
    let obj = JSON.parse(body);
    let needBlock = false;
    
    // 尝试从响应体中提取博主uid
    if (obj.status && obj.status.user && obj.status.user.id) {
      needBlock = BLOCKED_UIDS.has(String(obj.status.user.id));
    } else if (obj.user && obj.user.id) {
      needBlock = BLOCKED_UIDS.has(String(obj.user.id));
    } else if (obj.id && BLOCKED_UIDS.has(String(obj.id))) {
      needBlock = true;
    }
    
    if (needBlock) {
      $done({ body: "{}" });
      return;
    }
  } catch(e) {}
}
$done({ body: body });
