"use client";

import { useState } from "react";

/** 자주 쓰는 메일 주소. '직접 입력'을 고르면 @ 뒤를 직접 적는다 */
const DOMAINS = ["naver.com", "gmail.com", "daum.net", "hanmail.net", "kakao.com", "nate.com", "icloud.com", "hotmail.com", "outlook.com"];
const DIRECT = "direct";

/**
 * 이메일: 앞부분은 직접 쓰고, @ 뒤는 목록에서 고른다.
 * 앞칸에 전체 주소를 붙여 넣으면 알아서 나눈다. 합친 값(앞@뒤)을 onChange로 넘긴다.
 */
export default function EmailField({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const init = value.split("@");
  const [local, setLocal] = useState(init[0] || "");
  const [domain, setDomain] = useState(init[1] ? (DOMAINS.includes(init[1]) ? init[1] : DIRECT) : "");
  const [custom, setCustom] = useState(init[1] && !DOMAINS.includes(init[1]) ? init[1] : "");

  const emit = (l: string, dm: string, c: string) => {
    const right = dm === DIRECT ? c.trim() : dm;
    onChange(l.trim() ? `${l.trim()}@${right}` : "");
  };

  const onLocal = (v: string) => {
    // 전체 주소를 붙여 넣은 경우: 앞·뒤로 나눈다
    if (v.includes("@")) {
      const [l, r = ""] = v.split("@");
      const dm = DOMAINS.includes(r) ? r : r ? DIRECT : domain;
      setLocal(l);
      setDomain(dm);
      if (dm === DIRECT) setCustom(r);
      emit(l, dm, dm === DIRECT ? r : custom);
      return;
    }
    setLocal(v);
    emit(v, domain, custom);
  };

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <input
          id={id}
          className="field"
          name="email-local"
          type="text"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="아이디"
          value={local}
          onChange={(e) => onLocal(e.target.value)}
        />
        <span aria-hidden className="text-[1.125rem] font-semibold text-paper/60">
          @
        </span>
        <select
          className="field"
          aria-label="이메일 @ 뒤 주소"
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            emit(local, e.target.value, custom);
          }}
        >
          <option value="">선택해 주세요</option>
          {DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
          <option value={DIRECT}>직접 입력</option>
        </select>
      </div>
      {domain === DIRECT && (
        <input
          className="field"
          type="text"
          inputMode="url"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="이메일 @ 뒤 주소 직접 입력"
          placeholder="예: company.co.kr"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            emit(local, DIRECT, e.target.value);
          }}
        />
      )}
    </div>
  );
}
