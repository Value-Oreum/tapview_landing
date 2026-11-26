/**
 * 탭뷰 신청 기록 + 메일 (Google Apps Script, 탭뷰 Gmail 계정의 스프레드시트에 붙여 씀)
 *
 * 스크립트 속성 (프로젝트 설정 ▸ 스크립트 속성)
 *   SECRET          Vercel APPS_SCRIPT_SECRET 과 같은 값 (필수)
 *   OPERATOR_EMAIL  새 신청 알림을 받을 주소 (예: tapview26@gmail.com)
 *   SITE_URL        https://tapview.app
 *   FROM_ALIAS      tapview@tapview.app  (Gmail '다른 주소에서 보내기' 설정을 마친 뒤에만 넣기)
 *
 * 처음 한 번 setup() 실행 → 웹 앱으로 배포(실행: 나, 액세스: 모든 사용자) → 배포 URL을 Vercel APPS_SCRIPT_URL 로.
 */

const TABS = {
  personal: { name: '개인', head: ['접수시각', '코드', '이름', '휴대폰', '이메일', '연령대', '기종', '불편상황', '알게된경로', '체험단', '사연', '사연공개', '소식수신', '초대코드', '유입', '브라우저'] },
  family: { name: '가족', head: ['접수시각', '코드', '신청자', '휴대폰', '이메일', '관계', '연령대', '기종', '불편상황', '알게된경로', '체험단', '사연', '사연공개', '본인동의', '소식수신', '초대코드', '유입', '브라우저'] },
  org: { name: '기관', head: ['접수시각', '기관명', '담당자', '직함', '연락처', '이메일', '지역', '예상이용자', '관심', '메모', '소식수신', '유입'] },
  contact: { name: '문의', head: ['접수시각', '유형', '이름', '이메일', '휴대폰', '내용'] },
  japan: { name: '일본알림', head: ['접수시각', '이름', '이메일', '유형', '메모', '소식수신', '유입'] },
};
const EXTRA = {
  invite: { name: '초대현황', head: ['초대코드', '초대수', '최근'] },
  queue: { name: '발송대기', head: ['접수시각', '받는사람', '유형', '코드', '체험단', '상태'] },
  news: { name: '소식', head: ['제목', '본문(HTML 가능)', '메모'] },
  newsLog: { name: '발송기록', head: ['발송시각', '받는사람', '제목'] },
};

/* ───────── 설치 ───────── */
function setup() {
  const ss = SpreadsheetApp.getActive();
  [...Object.values(TABS), ...Object.values(EXTRA)].forEach((t) => {
    let sh = ss.getSheetByName(t.name);
    if (!sh) sh = ss.insertSheet(t.name);
    if (sh.getLastRow() === 0) {
      sh.appendRow(t.head);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, t.head.length).setFontWeight('bold').setBackground('#e7f6ee');
    }
  });
  const news = ss.getSheetByName(EXTRA.news.name);
  if (news.getLastRow() === 1) news.appendRow(['[탭뷰] 개발 소식', '<p>안녕하세요, 탭뷰입니다.</p><p>여기에 소식을 적어 주세요.</p>', 'A2·B2 칸을 고친 뒤 메뉴 ▸ 탭뷰 ▸ 개발 소식 보내기']);
  const first = ss.getSheetByName('시트1') || ss.getSheetByName('Sheet1');
  if (first && first.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(first);
  // 발송 대기열을 한 시간마다 처리
  if (!ScriptApp.getProjectTriggers().some((t) => t.getHandlerFunction() === 'processQueue')) {
    ScriptApp.newTrigger('processQueue').timeBased().everyHours(1).create();
  }
  const p = PropertiesService.getScriptProperties().getProperties();
  const missing = ['SECRET', 'OPERATOR_EMAIL', 'SITE_URL'].filter((k) => !p[k]);
  const msg = missing.length ? '스크립트 속성이 비어 있습니다: ' + missing.join(', ') : '준비 완료. 이제 웹 앱으로 배포하세요.';
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { Logger.log(msg); }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('탭뷰')
    .addItem('개발 소식 보내기 (소식 탭)', 'sendNews')
    .addItem('발송 대기열 지금 처리', 'processQueue')
    .addItem('설치 점검', 'setup')
    .addToUi();
}

/* ───────── 접수 ───────── */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const req = JSON.parse(e.postData.contents);
    const P = PropertiesService.getScriptProperties();
    if (!req.secret || req.secret !== P.getProperty('SECRET')) return json_({ ok: false, error: 'unauthorized' });
    const tab = TABS[req.type];
    if (!tab) return json_({ ok: false, error: 'bad type' });
    const d = req.data || {};
    const now = new Date();
    const yn = (v) => (v ? 'Y' : '');
    const joinList = (v) => (Array.isArray(v) ? v.join(', ') : '');
    let row;
    switch (req.type) {
      case 'personal':
        row = [now, req.code, d.name, d.phone, d.email, d.age, d.device, joinList(d.pains), d.source, yn(d.beta), d.story, yn(d.storyPublic), yn(d.marketing), req.ref, req.utm, req.ua];
        break;
      case 'family':
        row = [now, req.code, d.name, d.phone, d.email, d.relation, d.age, d.device, joinList(d.pains), d.source, yn(d.beta), d.story, yn(d.storyPublic), yn(d.userConsent), yn(d.marketing), req.ref, req.utm, req.ua];
        break;
      case 'org':
        row = [now, d.org, d.name, d.title, d.phone, d.email, d.region, d.size, joinList(d.interests), d.memo, yn(d.marketing), req.utm];
        break;
      case 'contact':
        row = [now, d.topic, d.name, d.email, d.phone, d.message];
        break;
      case 'japan':
        row = [now, d.name, d.email, d.kind, d.memo, yn(d.marketing), req.utm];
        break;
    }
    // 수식으로 해석되지 않게 '=' '+' '-' '@'로 시작하는 글자는 앞에 ' 를 붙인다
    row = row.map((v) => (typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v == null ? '' : v));
    SpreadsheetApp.getActive().getSheetByName(tab.name).appendRow(row);
    if (req.ref) bumpInvite_(req.ref, now);

    try { notifyOperator_(req, d); } catch (err) { Logger.log('operator mail: ' + err); }
    try {
      if (MailApp.getRemainingDailyQuota() > 1) sendWelcome_(req.type, d.email, req.code, d.beta, d.name);
      else queue_(now, d.email, req.type, req.code, d.beta);
    } catch (err) {
      queue_(now, d.email, req.type, req.code, d.beta);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'tapview-intake' });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function bumpInvite_(code, now) {
  const sh = SpreadsheetApp.getActive().getSheetByName(EXTRA.invite.name);
  const vals = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1).getValues();
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === code) {
      const c = sh.getRange(i + 1, 2);
      c.setValue((Number(c.getValue()) || 0) + 1);
      sh.getRange(i + 1, 3).setValue(now);
      return;
    }
  }
  sh.appendRow([code, 1, now]);
}

function queue_(now, email, type, code, beta) {
  SpreadsheetApp.getActive().getSheetByName(EXTRA.queue.name).appendRow([now, email, type, code || '', beta ? 'Y' : '', '대기']);
}

/** 하루 발송 한도(무료 Gmail 약 100명)를 넘은 확인 메일을 이어서 보낸다 */
function processQueue() {
  const sh = SpreadsheetApp.getActive().getSheetByName(EXTRA.queue.name);
  const last = sh.getLastRow();
  if (last < 2) return;
  const rows = sh.getRange(2, 1, last - 1, 6).getValues();
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][5] !== '대기') continue;
    if (MailApp.getRemainingDailyQuota() < 2) break;
    try {
      sendWelcome_(rows[i][2], rows[i][1], rows[i][3], rows[i][4] === 'Y');
      sh.getRange(i + 2, 6).setValue('보냄 ' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'MM-dd HH:mm'));
    } catch (err) {
      sh.getRange(i + 2, 6).setValue('오류: ' + err);
    }
  }
}

/* ───────── 메일 ───────── */
function send_(to, subject, html, text) {
  const P = PropertiesService.getScriptProperties();
  const alias = P.getProperty('FROM_ALIAS');
  const opts = { htmlBody: html, name: '탭뷰 TapView' };
  if (alias) {
    opts.from = alias;
    opts.replyTo = alias;
    GmailApp.sendEmail(to, subject, text, opts);
  } else {
    MailApp.sendEmail(to, subject, text, opts);
  }
}

function frame_(inner, lang) {
  const site = PropertiesService.getScriptProperties().getProperty('SITE_URL') || 'https://tapview.app';
  const foot = lang === 'ja'
    ? 'このメールは TapView（tapview.app）のお知らせ登録により送信されました。配信停止はこのメールに返信してください。'
    : '이 메일은 탭뷰(tapview.app) 신청에 따라 보내 드렸습니다. 수신을 원하지 않으시면 이 메일에 답장해 주세요.';
  return (
    '<div style="background:#f2f4ef;padding:24px 12px;font-family:\'Apple SD Gothic Neo\',\'Malgun Gothic\',sans-serif;">' +
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;">' +
    '<div style="background:#013f15;padding:28px 32px;"><img src="' + site + '/brand/logo-white.png" alt="TapView" height="30" style="height:30px;"></div>' +
    '<div style="padding:32px;color:#151916;font-size:17px;line-height:1.7;">' + inner + '</div>' +
    '<div style="padding:20px 32px;background:#f7f8f5;color:#8a8f8b;font-size:13px;line-height:1.6;">' + foot + '<br><a href="' + site + '" style="color:#013f15;">' + site.replace('https://', '') + '</a></div>' +
    '</div></div>'
  );
}

function sendWelcome_(type, to, code, beta, name) {
  if (!to) return;
  const site = PropertiesService.getScriptProperties().getProperty('SITE_URL') || 'https://tapview.app';
  const hi = name ? esc_(name) + '님, ' : '';
  let subject, inner, text;
  if (type === 'personal' || type === 'family') {
    const invite = site + '/?ref=' + code;
    subject = '[탭뷰] 첫눈도장이 찍혔어요 (' + code + ')';
    inner =
      '<p style="font-size:22px;font-weight:800;margin:0 0 12px;">' + hi + '첫눈도장, 쾅!</p>' +
      '<p>탭뷰 사전 예약이 접수되었습니다. 이제 <b>탭뷰어</b>가 되셨어요.</p>' +
      '<div style="margin:24px 0;padding:20px;border:2px solid #ffd45a;border-radius:16px;text-align:center;">' +
      '<div style="font-size:14px;color:#6b706c;">내 눈도장 코드</div>' +
      '<div style="font-size:30px;font-weight:800;letter-spacing:1px;margin-top:4px;">' + code + '</div>' +
      '<div style="margin-top:8px;font-weight:700;color:#013f15;">출시 후 첫 1년 무료 · 본인+가족 2명</div></div>' +
      (beta ? '<p>체험단(평생 눈도장) 신청도 함께 받았습니다. 선발되시면 따로 연락드릴게요.</p>' : '') +
      '<p>아래 내 링크로 <b>3명이 첫눈도장을 찍으면</b> 평생 눈도장 체험단에 우선 선발됩니다.<br>' +
      '<a href="' + invite + '" style="color:#013f15;font-weight:700;">' + invite + '</a></p>' +
      '<p style="color:#6b706c;">출시 소식과 혜택은 이 메일과 문자로 가장 먼저 알려 드릴게요. #첫눈에탭</p>';
    text = '첫눈도장이 찍혔어요. 코드 ' + code + ' / 출시 후 첫 1년 무료(본인+가족 2명). 내 링크: ' + invite;
  } else if (type === 'org') {
    subject = '[탭뷰] 기관 신청을 잘 받았습니다';
    inner = '<p style="font-size:22px;font-weight:800;margin:0 0 12px;">기관 신청 감사합니다.</p><p>' + hi + '보내 주신 내용을 살펴보고 담당자가 연락드리겠습니다. 스마트폰 교실에서 함께 설치하는 방식과 복지관 전용 화면을 안내해 드릴게요.</p>';
    text = '탭뷰 기관 신청을 잘 받았습니다. 담당자가 연락드리겠습니다.';
  } else if (type === 'contact') {
    subject = '[탭뷰] 문의를 잘 받았습니다';
    inner = '<p style="font-size:22px;font-weight:800;margin:0 0 12px;">문의 감사합니다.</p><p>' + hi + '보내 주신 문의에 이 메일 주소로 답장드리겠습니다.</p>';
    text = '탭뷰 문의를 잘 받았습니다. 곧 답장드리겠습니다.';
  } else if (type === 'japan') {
    subject = '【TapView】日本リリースのお知らせ登録ありがとうございます';
    inner = '<p style="font-size:22px;font-weight:800;margin:0 0 12px;">ご登録ありがとうございます。</p><p>TapView の日本リリース（2028年予定）が近づきましたら、このメールアドレスにいち早くお知らせします。</p>';
    text = 'TapView 日本リリースのお知らせ登録ありがとうございます。';
  } else return;
  send_(to, subject, frame_(inner, type === 'japan' ? 'ja' : 'ko'), text);
}

function notifyOperator_(req, d) {
  const to = PropertiesService.getScriptProperties().getProperty('OPERATOR_EMAIL');
  if (!to) return;
  const label = TABS[req.type].name;
  const who = req.type === 'org' ? d.org + ' · ' + d.name : d.name || d.email;
  const lines = Object.keys(d).map((k) => k + ': ' + (Array.isArray(d[k]) ? d[k].join(', ') : d[k]));
  MailApp.sendEmail(to, '[탭뷰 신청] ' + label + ' · ' + who + (req.code ? ' · ' + req.code : ''), lines.join('\n') + (req.ref ? '\n초대코드: ' + req.ref : ''));
}

function esc_(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/* ───────── 개발 소식 일괄 발송 ───────── */
function sendNews() {
  const ss = SpreadsheetApp.getActive();
  const ui = SpreadsheetApp.getUi();
  const news = ss.getSheetByName(EXTRA.news.name);
  const subject = String(news.getRange('A2').getValue()).trim();
  const body = String(news.getRange('B2').getValue()).trim();
  if (!subject || !body) return ui.alert('소식 탭 A2(제목)와 B2(본문)를 먼저 채워 주세요.');
  // 소식 수신에 동의한 사람만 (중복 제거)
  const targets = new Set();
  [['개인', 4, 12], ['가족', 4, 14], ['일본알림', 2, 5]].forEach(([name, emailCol, mkCol]) => {
    const sh = ss.getSheetByName(name);
    if (!sh || sh.getLastRow() < 2) return;
    sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues().forEach((r) => {
      if (r[mkCol] === 'Y' && r[emailCol]) targets.add(String(r[emailCol]).trim().toLowerCase());
    });
  });
  const log = ss.getSheetByName(EXTRA.newsLog.name);
  const sent = new Set(
    log.getLastRow() > 1 ? log.getRange(2, 2, log.getLastRow() - 1, 2).getValues().filter((r) => r[1] === subject).map((r) => r[0]) : [],
  );
  const todo = [...targets].filter((t) => !sent.has(t));
  if (!todo.length) return ui.alert('보낼 사람이 없습니다. (이미 모두 보냈거나 수신 동의자가 없음)');
  if (ui.alert('수신 동의자 ' + todo.length + '명에게 "' + subject + '"를 보낼까요?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  let n = 0;
  for (const to of todo) {
    if (MailApp.getRemainingDailyQuota() < 2) break;
    send_(to, subject, frame_(body, 'ko'), body.replace(/<[^>]+>/g, ' '));
    log.appendRow([new Date(), to, subject]);
    n++;
  }
  ui.alert(n + '명에게 보냈습니다.' + (n < todo.length ? ' 오늘 발송 한도에 닿아 ' + (todo.length - n) + '명이 남았습니다. 내일 다시 실행하면 이어서 보냅니다.' : ''));
}
