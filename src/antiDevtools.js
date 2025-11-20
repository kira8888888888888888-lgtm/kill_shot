// // src/antiDevtools.js
// export default function initAntiDevtools(options = {}) {
//   const {
//     productionOnly = true,
//     showOverlay = true,
//     redirectOnOpen = true,
//     redirectUrl = 'about:blank',
//     redirectDelay = 10,
//     checkInterval = 10,
//     sizeThreshold = 100,
//     debugDelayThreshold = 100
//   } = options;

//   // try {
//   //   if (productionOnly && process.env.NODE_ENV !== 'production') return;
//   //   const host = window?.location?.hostname || '';
//   //   if (host === 'localhost' || host === '127.0.0.1') return;
//   // } catch (e) {}

//   function sizeDetector() {
//     return (window.outerWidth - window.innerWidth > sizeThreshold) ||
//            (window.outerHeight - window.innerHeight > sizeThreshold);
//   }

//   function consoleGetterDetector() {
//     try {
//       let opened = false;
//       const el = new Image();
//       Object.defineProperty(el, 'id', {
//         get() {
//           opened = true;
//           return '';
//         }
//       });
//       console.log(el);
//       return opened;
//     } catch (e) {
//       return false;
//     }
//   }

//   function debuggerDetector() {
//     try {
//       const start = performance.now();
//       // eslint-disable-next-line no-debugger
//       debugger;
//       const end = performance.now();
//       return (end - start) > debugDelayThreshold;
//     } catch (e) {
//       return false;
//     }
//   }

//   function detect() {
//     return sizeDetector() || consoleGetterDetector() || debuggerDetector();
//   }

//   function showOverlayMessage() {
//     if (document.getElementById('__anti_devtools_overlay')) return;
//     const div = document.createElement('div');
//     div.id = '__anti_devtools_overlay';
//     Object.assign(div.style, {
//       position: 'fixed',
//       inset: '0',
//       background: '#fff',
//       color: '#b00',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 2147483647,
//       fontFamily: 'Arial, sans-serif',
//       textAlign: 'center',
//       padding: '24px'
//     });
//     div.innerHTML = `
//       <h1 style="margin:0 0 8px">Access Denied</h1>
//       <p style="margin:0">Developer tools are open. You will be redirected.</p>
//     `;
//     div.addEventListener('contextmenu', e => e.preventDefault());
//     document.body.appendChild(div);
//     document.documentElement.style.overflow = 'hidden';
//   }

//   function removeOverlay() {
//     const d = document.getElementById('__anti_devtools_overlay');
//     if (d) d.remove();
//     document.documentElement.style.overflow = '';
//   }

//   try {
//     console.log = console.info = console.warn = console.error = () => {};
//   } catch (e) {}

//   let lastState = false;
//   let redirectTimeout = null;

//   const loop = () => {
//     const open = detect();
//     if (open && !lastState) {
//       lastState = true;
//       if (showOverlay) showOverlayMessage();
//       if (redirectOnOpen) {
//         if (redirectTimeout) clearTimeout(redirectTimeout);
//         redirectTimeout = setTimeout(() => {
//           try {
//             window.location.replace(redirectUrl);
//           } catch {
//             window.location.href = redirectUrl;
//           }
//         }, redirectDelay);
//       }
//     } else if (!open && lastState) {
//       lastState = false;
//       if (redirectTimeout) clearTimeout(redirectTimeout);
//       removeOverlay();
//     }
//   };

//   loop();
//   const intervalId = setInterval(loop, checkInterval);

//   return {
//     stop: () => {
//       clearInterval(intervalId);
//       if (redirectTimeout) clearTimeout(redirectTimeout);
//       removeOverlay();
//     }
//   };
// }
