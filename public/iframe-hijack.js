// iframe-hijack.js
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (a && a.href && !a.target) {
    e.preventDefault();
    window.parent.postMessage({type:'openNewTab', url:a.href}, '*');
  }
});

document.addEventListener('submit', e => {
  const f = e.target;
  e.preventDefault();
  const action = f.action || window.location.href;
  window.parent.postMessage({type:'openNewTab', url:action}, '*');
});

const origAssign = window.location.assign;
window.location.assign = function(url){ window.parent.postMessage({type:'openNewTab', url:url}, '*'); };

const origReplace = window.location.replace;
window.location.replace = function(url){ window.parent.postMessage({type:'openNewTab', url:url}, '*'); };
