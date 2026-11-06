// 서버 대신 정적 JSON을 읽는 가짜 API. 실제 서비스처럼 지연을 줘서 로딩 화면이 보이게 한다.
// 주소에 ?fail 을 붙이면 오류 화면을, ?fast 를 붙이면 지연 없이 동작한다.
const q = new URLSearchParams(location.search);
const FAIL = q.has("fail");
const FAST = q.has("fast");
let cache = null;

const wait = (ms) => new Promise((r) => setTimeout(r, FAST ? 0 : ms));

async function load() {
  if (!cache) cache = fetch("/data/shops.json").then((r) => { if (!r.ok) throw new Error("load"); return r.json(); });
  return cache;
}

export async function getShops() {
  await wait(650);
  if (FAIL) throw new Error("인허가 자료를 불러오지 못했어요");
  return load();
}

export async function getShop(id) {
  await wait(420);
  const { meta, shops } = await load();
  return { meta, shop: shops.find((s) => s.id === id) };
}
