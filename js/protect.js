(function () {
  'use strict';

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function (e) {
    const ctrl  = e.ctrlKey  || e.metaKey;   // Ctrl on Windows, Cmd on Mac
    const shift = e.shiftKey;
    const key   = e.key;

    const blocked =
      key === 'F12' ||                                        // F12
      (ctrl && shift && ['I','i','J','j','C','c','K','k'].includes(key)) || // Ctrl+Shift+I/J/C/K
      (ctrl && ['u','U','s','S'].includes(key));              // Ctrl+U (view-source) / Ctrl+S (save)

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  function warnConsole() {
    console.clear();
    console.log(
      '%c⛔ Stop!',
      'color:#C9A96E;font-size:52px;font-weight:bold;'
    );
    console.log(
      '%cThis is a private wedding invitation.\nSource inspection is not permitted.',
      'font-size:14px;color:#888;'
    );
  }
  warnConsole();
  setInterval(warnConsole, 3000);

}());
