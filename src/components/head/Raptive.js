/* eslint react/no-danger: 0 */
import React from 'react'
import PropTypes from 'prop-types'

export default function Raptive({ causeId }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w, d) {
              w.adthrive = w.adthrive || {};
              w.adthrive.cmd = w.adthrive.cmd || [];
              w.adthrive.plugin = 'adthrive-ads-manual';
              w.adthrive.host = 'ads.adthrive.com';
              var s = d.createElement('script');
              s.async = true;
              s.referrerpolicy='no-referrer-when-downgrade';
              s.src = 'https://' + w.adthrive.host + '/sites/655cd66352dfc71af0778a48/ads.min.js?referrer=' + w.encodeURIComponent(w.location.href) + '&cb=' + (Math.floor(Math.random() * 100) + 1);
              var n = d.getElementsByTagName('script')[0];
              n.parentNode.insertBefore(s, n);
              })(window, document);`,
        }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `(function() { 
            window.adthrive.cmd.push(function() {
              window.adthrive.siteAds.targeting.push( {key: 'at_custom_1', value: '${causeId}'} );
            });
          })();`,
        }}
      />
    </>
  )
}

Raptive.propTypes = {
  causeId: PropTypes.string,
}

Raptive.defaultProps = {
  causeId: '',
}
