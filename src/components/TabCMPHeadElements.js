/* eslint react/no-danger: 0 */
import React from 'react'

// Head scripts for tab-cmp.
// https://github.com/gladly-team/tab-cmp
// https://github.com/gladly-team/tab-cmp/blob/master/src/tagModified.html
const TabCMPHeadElements = () => (
  <>
    <script
      src="//geoip-js.com/js/apis/geoip2/v2.1/geoip2.js"
      type="text/javascript"
    />
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
        // Gladly modified: add try/catch.
        try {
          (function() {
            // Gladly modified: create window object.
            window.tabCMP = window.tabCMP || {
              uspStubFunction: undefined
            }

            // Gladly modified: don't load the QC Choice script.
            // We'll import it ourselves.
            // var host = window.location.hostname;
            // var element = document.createElement('script');
            // var firstScript = document.getElementsByTagName('script')[0];
            // var url = 'https://cmp.quantcast.com'
            //   .concat('/choice/', 'FPBLJYpJgR9Zu', '/', host, '/choice.js?tag_version=V2');
            var uspTries = 0;
            var uspTriesLimit = 3;
            // element.async = true;
            // element.type = 'text/javascript';
            // element.src = url;

            // firstScript.parentNode.insertBefore(element, firstScript);

            // Gladly modified.
            // Add debug logging.
            let debug = false
            try {
              const urlStr = window.location.href
              const url = new URL(urlStr)
              const tabCMPDebug = url.searchParams.get('tabCMPDebug')
              debug = tabCMPDebug === 'true'
            } catch (e) {}
            const logPrefix = [
              '%ctab-cmp',
              'background: #7c7c7c; color: #fff; border-radius: 2px; padding: 2px 6px',
              '[head script]'
            ]

            function makeStub() {
              var TCF_LOCATOR_NAME = '__tcfapiLocator';
              var queue = [];
              var win = window;
              var cmpFrame;

              function addFrame() {
                var doc = win.document;
                var otherCMP = !!(win.frames[TCF_LOCATOR_NAME]);

                if (!otherCMP) {
                  if (doc.body) {
                    var iframe = doc.createElement('iframe');

                    iframe.style.cssText = 'display:none';
                    iframe.name = TCF_LOCATOR_NAME;
                    doc.body.appendChild(iframe);
                  } else {
                    setTimeout(addFrame, 5);
                  }
                }
                return !otherCMP;
              }

              function tcfAPIHandler() {
                var gdprApplies;
                var args = arguments;

                // Gladly modified.
                try {
                  if (!args.length) {
                    return queue
                  }
                  // Our modified code should handle some API calls for TCF v2.
                  const cmd = args[0]
                  const shouldHandle =
                    ['getTCData', 'ping', 'addEventListener', 'removeEventListener'].indexOf(cmd) > -1 &&
                    args[1] === 2 &&
                    typeof args[2] === 'function'
                  if (shouldHandle) {
                    if (cmd === 'removeEventListener') {
                      // Our stubbed "addEventListener" logic doesn't add a
                      // listener, so we don't need to remove anything.
                      return
                    } else {
                      // This item is set and updated in tab-cmp.
                      const storedTCFData = JSON.parse(localStorage.getItem('tabCMP.tcfv2.data'))
                      if (storedTCFData) {
                        const cb = args[2]
                        const data = {
                          ...storedTCFData,
                          // Google Ad Manager will consider the CMP failed if the
                          // "addEventListener" response doesn't contain a listenerId
                          // value, which is null in the response to "getTCData".
                          ...(cmd === 'addEventListener' && {
                            listenerId: 1, // a fake ID our stub won't use
                          }) 
                        }
                        cb(data, true)
                        return
                      } else {
                      }
                    }
                  } else {
                  }
                } catch (e) {
                  console.error('[tab-cmp]', e)
                }

                if (!args.length) {
                  return queue;
                } else if (args[0] === 'setGdprApplies') {
                  if (
                    args.length > 3 &&
                    args[2] === 2 &&
                    typeof args[3] === 'boolean'
                  ) {
                    gdprApplies = args[3];
                    if (typeof args[2] === 'function') {
                      args[2]('set', true);
                    }
                  }
                } else if (args[0] === 'ping') {
                  var retr = {
                    gdprApplies: gdprApplies,
                    cmpLoaded: false,
                    cmpStatus: 'stub'
                  };

                  if (typeof args[2] === 'function') {
                    args[2](retr);
                  }
                } else {
                  if(args[0] === 'init' && typeof args[3] === 'object') {
                    args[3] = Object.assign(args[3], { tag_version: 'V2' });
                  }
                  queue.push(args);
                }
              }

              function postMessageEventHandler(event) {
                var msgIsString = typeof event.data === 'string';
                var json = {};

                try {
                  if (msgIsString) {
                    json = JSON.parse(event.data);
                  } else {
                    json = event.data;
                  }
                } catch (ignore) {}

                var payload = json.__tcfapiCall;

                if (payload) {
                  window.__tcfapi(
                    payload.command,
                    payload.version,
                    function(retValue, success) {
                      var returnMsg = {
                        __tcfapiReturn: {
                          returnValue: retValue,
                          success: success,
                          callId: payload.callId
                        }
                      };
                      if (msgIsString) {
                        returnMsg = JSON.stringify(returnMsg);
                      }
                      if (event && event.source && event.source.postMessage) {
                        event.source.postMessage(returnMsg, '*');
                      }
                    },
                    payload.parameter
                  );
                }
              }

              // Gladly modified:
              // Don't try to use the parent frame, which may be the
              // new tab page.
              try {
                if (win.frames[TCF_LOCATOR_NAME]) {
                  cmpFrame = win;
                }
              } catch (ignore) {}

              // while (win) {
              //   try {
              //     if (win.frames[TCF_LOCATOR_NAME]) {
              //       cmpFrame = win;
              //       break;
              //     }
              //   } catch (ignore) {}
              // 
              //   if (win === window.top) {
              //     break;
              //   }
              //   win = win.parent;
              // }

              if (!cmpFrame) {
                addFrame();
                win.__tcfapi = tcfAPIHandler;
                win.addEventListener('message', postMessageEventHandler, false);
              }
            };

            makeStub();

            var uspStubFunction = function() {
              var arg = arguments;

              // Gladly modified.
              try {
                if (!arg.length) {
                  return queue
                }
                // Our modified code should handle some API calls for USP v1.
                const cmd = arg[0]
                const shouldHandle =
                  ['getUSPData', 'uspPing'].indexOf(cmd) > -1 &&
                  arg[1] === 1 &&
                  typeof arg[2] === 'function'
                if (shouldHandle) {
                  // These items are set and updated in tab-cmp.
                  if (cmd === 'getUSPData') {
                    const storedUSPData = JSON.parse(localStorage.getItem('tabCMP.usp.data'))
                    if (storedUSPData) {
                      const cb = arg[2]
                      cb(storedUSPData, true)
                      return
                    } else {
                    }
                  } else if (cmd === 'uspPing') {
                    const storedUSPPingData = JSON.parse(localStorage.getItem('tabCMP.uspPing.data'))
                    if (storedUSPPingData) {
                      const cb = arg[2]
                      cb(storedUSPPingData, true)
                      return
                    } else {
                    }
                  }
                } else {
                }
              } catch (e) {
                console.error('[tab-cmp]', e)
              }

              if (typeof window.__uspapi !== uspStubFunction) {
                setTimeout(function() {
                  if (typeof window.__uspapi !== 'undefined') {
                    window.__uspapi.apply(window.__uspapi, arg);
                  }
                }, 500);
              }
            };

            // Gladly modified: store the stub function so we know when
            // Quantcast Choice has finished initializing.
            window.tabCMP.uspStubFunction = uspStubFunction

            var checkIfUspIsReady = function() {
              uspTries++;
              if (window.__uspapi === uspStubFunction && uspTries < uspTriesLimit) {
                // Gladly modified: add [tab-cmp] prefix.
                console.error(...logPrefix, 'USP is not accessible.');
              } else {
                clearInterval(uspInterval);
              }
            };

            if (typeof window.__uspapi === 'undefined') {
              window.__uspapi = uspStubFunction;
              var uspInterval = setInterval(checkIfUspIsReady, 6000);
            }
          })();
        } catch (e) {
          console.error('[tab-cmp] Head tag errored:', e);
        }
        `,
      }}
    />
  </>
)

TabCMPHeadElements.displayName = 'TabCMPHeadElements'
TabCMPHeadElements.propTypes = {}
TabCMPHeadElements.defaultProps = {}

export default TabCMPHeadElements
