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

  var _devOpen = false;
  var _overlay  = null;

  function createOverlay() {
    if (_overlay) return;
    _overlay = document.createElement('div');
    Object.assign(_overlay.style, {
      position:       'fixed',
      inset:          '0',
      zIndex:         '999999',
      background:     'rgba(0,0,0,0.96)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      fontFamily:     'Georgia, serif',
      color:          '#C9A96E',
      textAlign:      'center',
      padding:        '2rem',
    });
    _overlay.innerHTML =
      '<p style="font-size:2.4rem;margin:0 0 .6rem">⚠</p>' +
      '<p style="font-size:1.1rem;letter-spacing:.12em;margin:0">Please close developer tools to continue.</p>';
    document.body.appendChild(_overlay);
  }

  function removeOverlay() {
    if (_overlay) { _overlay.remove(); _overlay = null; }
  }

  function checkDevTools() {
    var threshold = 160;
    var widthDiff  = window.outerWidth  - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;
    var open = widthDiff > threshold || heightDiff > threshold;

    if (open && !_devOpen) {
      _devOpen = true;
      createOverlay();
    } else if (!open && _devOpen) {
      _devOpen = false;
      removeOverlay();
    }
  }


  window.addEventListener('resize', checkDevTools);
  setInterval(checkDevTools, 1500);
  checkDevTools();

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
