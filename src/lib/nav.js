import { useCallback, useEffect, useRef, useState } from "react";

// 화면 스택 내비게이션. 브라우저 뒤로 가기(스와이프 포함)와 맞물리고, 전환 방향(dir)을 기억한다.
// dir: 1 = 들어감, -1 = 뒤로, 0 = 탭 이동
export function useStackNav(first) {
  const [nav, setNav] = useState({ stack: [{ name: first, params: {} }], dir: 0 });
  const depth = useRef(1);

  useEffect(() => {
    history.replaceState({ d: 1 }, "");
    const onPop = () => {
      setNav((n) => (n.stack.length > 1 ? { stack: n.stack.slice(0, -1), dir: -1 } : n));
      depth.current = Math.max(1, depth.current - 1);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = useCallback((name, params = {}) => {
    depth.current += 1;
    history.pushState({ d: depth.current }, "");
    setNav((n) => ({ stack: [...n.stack, { name, params }], dir: 1 }));
  }, []);
  const back = useCallback(() => history.back(), []);
  const tab = useCallback((name, params = {}) => {
    setNav({ stack: [{ name, params }], dir: 0 }); // 남은 history는 뒤로 가기 때 한 장짜리 스택에서 그냥 무시된다
  }, []);

  return { page: nav.stack[nav.stack.length - 1], depth: nav.stack.length, dir: nav.dir, go, back, tab };
}
