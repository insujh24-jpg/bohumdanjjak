// data/posts.json 을 읽어 사례·관련 글을 그립니다. (관리자 페이지에서 글을 추가하면 자동 반영)
(function () {
  var BLOG = "https://blog.naver.com/cidertt";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function fdate(s) { var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(s || "")); return m ? m[1] + ". " + (+m[2]) + ". " + (+m[3]) + "." : (s || ""); }
  function img(p) { var i = p.image || ""; return i.charAt(0) === "/" ? i.slice(1) : i; }
  function caseHtml(p) {
    return '<a class="case" href="' + esc(p.url) + '" target="_blank" rel="noopener"><img src="' + esc(img(p)) + '" alt="' + esc(p.title) + ' 썸네일" loading="lazy" width="800" height="800"><span class="case-title">' + esc(p.title) + '</span><span class="case-date">' + esc(fdate(p.date)) + "</span></a>";
  }
  function pitemHtml(p) {
    var th = p.image ? '<img class="pitem-thumb" src="' + esc(img(p)) + '" alt="" loading="lazy" width="96" height="96">' : "";
    var sum = p.summary ? '<span class="pitem-sum">' + esc(p.summary) + "</span>" : "";
    var tag = esc(p.series || "") + (p.no ? " " + esc(p.no) : "");
    return '<a class="pitem' + (th ? "" : " noimg") + '" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + th + '<span class="pitem-body"><span class="pitem-tag">' + tag + '</span><span class="pitem-title">' + esc(p.title) + "</span>" + sum + '<span class="pitem-meta">' + esc(fdate(p.date)) + " · 블로그에서 읽기 →</span></span></a>";
  }
  function emptyHtml(name) {
    return '<a class="pitem noimg" href="' + BLOG + '" target="_blank" rel="noopener"><span class="pitem-body"><span class="pitem-tag">보험단짝 블로그</span><span class="pitem-title">' + esc(name) + ' 관련 글은 블로그에서 확인하세요</span><span class="pitem-meta">블로그로 이동 →</span></span></a>';
  }
  fetch("data/posts.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (d) {
    var posts = (d.posts || []).filter(function (p) { return p && p.title && p.url; }).map(function (p) {
      var ds = p.diseases || []; if (typeof ds === "string") ds = [ds]; p.diseases = ds; return p;
    }).sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
    document.querySelectorAll("[data-cases]").forEach(function (el) {
      var s = el.getAttribute("data-cases");
      var items = posts.filter(function (p) { return p.series === s; }).slice(0, 4);
      var row = el.closest("[data-case-row]");
      if (row) row.hidden = !items.length;
      el.innerHTML = items.map(caseHtml).join("");
    });
    document.querySelectorAll("[data-plist]").forEach(function (el) {
      var slug = el.getAttribute("data-plist");
      var items = posts.filter(function (p) { return p.diseases.indexOf(slug) > -1; }).slice(0, 8);
      el.innerHTML = items.length ? items.map(pitemHtml).join("") : emptyHtml(el.getAttribute("data-name"));
    });
  }).catch(function () { /* 실패하면 미리 그려둔 목록 유지 */ });
})();
