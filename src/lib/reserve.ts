/** 신청 유형과 서버 쪽 검사. 화면(폼)과 API가 같은 규칙을 쓴다. */

export const TYPES = ["personal", "family", "org", "contact", "japan"] as const;
export type SubmitType = (typeof TYPES)[number];

export const TYPE_LABEL: Record<SubmitType, string> = {
  personal: "개인",
  family: "가족",
  org: "기관",
  contact: "문의",
  japan: "일본알림",
};

/** 휴대폰(숫자만): 010·011·016~019 */
const MOBILE = /^01[016789]\d{7,8}$/;
/** 기관 연락처(숫자만): 휴대폰 또는 지역번호 일반 전화 */
const ANY_PHONE = /^0\d{8,10}$/;
const digits = (v: unknown) => (typeof v === "string" ? v.replace(/\D/g, "") : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Data = Record<string, unknown>;

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, max = 10) => (Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, max).map((x) => (x as string).slice(0, 60)) : []);

/** 필드를 정리하고 필수 항목을 검사한다. 오류면 사람이 읽을 수 있는 메시지를 돌려준다. */
export function clean(type: SubmitType, d: Data): { ok: true; data: Data } | { ok: false; error: string } {
  const out: Data = {};
  const need = (k: string, label: string, max = 100) => {
    const v = str(d[k], max);
    if (!v) throw new Error(type === "japan" ? `${label}を入力してください。` : `${label}을(를) 입력해 주세요.`);
    out[k] = v;
  };
  const opt = (k: string, max = 200) => {
    const v = str(d[k], max);
    if (v) out[k] = v;
  };
  try {
    if (type === "japan") {
      opt("name", 60);
      need("email", "メールアドレス", 120);
      if (!EMAIL.test(out.email as string)) throw new Error("メールアドレスの形式をご確認ください。");
      opt("kind", 30);
      opt("memo", 1000);
    } else {
      need("name", type === "org" ? "담당자 이름" : "이름", 60);
      need("email", "이메일", 120);
      if (!EMAIL.test(out.email as string)) throw new Error("이메일 주소를 다시 확인해 주세요.");
      if (type !== "contact") {
        const phone = digits(d.phone);
        if (!phone) throw new Error(type === "org" ? "연락처를 입력해 주세요." : "휴대폰 번호를 입력해 주세요.");
        if (!(type === "org" ? ANY_PHONE : MOBILE).test(phone))
          throw new Error(type === "org" ? "연락처를 숫자만 다시 확인해 주세요. (예: 0212345678)" : "휴대폰 번호를 숫자만 다시 확인해 주세요. (예: 01012345678)");
        out.phone = phone;
      } else {
        opt("phone", 20);
      }
    }

    if (type === "personal" || type === "family") {
      opt("age", 20);
      opt("device", 30);
      out.pains = list(d.pains);
      opt("source", 30);
      out.beta = d.beta === true;
      if (out.beta) {
        opt("story", 300);
        out.storyPublic = d.storyPublic === true;
      }
    }
    if (type === "family") {
      need("relation", "사용하실 분과의 관계", 20);
      if (d.userConsent !== true) throw new Error("사용하실 분의 동의를 받았는지 확인해 주세요.");
      out.userConsent = true;
    }
    if (type === "org") {
      need("org", "기관명", 80);
      opt("title", 40);
      need("region", "지역", 20);
      opt("size", 20);
      out.interests = list(d.interests);
      opt("memo", 1000);
    }
    if (type === "contact") {
      need("topic", "문의 유형", 20);
      need("message", "문의 내용", 2000);
    }
    if (d.privacy !== true) throw new Error(type === "japan" ? "個人情報の取扱いに同意してください。" : "개인정보 수집·이용에 동의해 주세요.");
    out.privacy = true;
    out.marketing = d.marketing === true;
    return { ok: true, data: out };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

const ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
/** 눈도장 코드: 순번이 아닌 무작위 4자리 (예: TV-7K3Q) */
export function stampCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return "TV-" + Array.from(bytes, (b) => ALPHA[b % ALPHA.length]).join("");
}
