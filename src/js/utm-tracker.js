// UTM & Google Ads Parameter Tracker
// Captures URL parameters and populates hidden form fields

const params = new URLSearchParams(window.location.search);

const trackingParams = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_id',
  'utm_term',
  'utm_content',
  'device',
  'matchtype',
  'network',
  'gclid'
];

trackingParams.forEach(param => {
  const field = document.getElementById(param);
  if (field) {
    field.value = params.get(param) || '';
  }
});
