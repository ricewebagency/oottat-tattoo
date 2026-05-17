// Custom Form Submit Handler for Make.com Webhook
// Intercepts form submission and sends JSON data

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[action*="make.com"]');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect all form data
    const formData = new FormData(form);
    
    // Build JSON payload
    const payload = {
      // Form fields
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      preferred_date: formData.get('preferred_date') || '',
      message: formData.get('message') || '',
      body_location: formData.get('body_location') || '',
      tattoo_size: formData.get('tattoo_size') || '',
      
      // UTM & Google Ads parameters
      utm_source: formData.get('utm_source') || '',
      utm_medium: formData.get('utm_medium') || '',
      utm_campaign: formData.get('utm_campaign') || '',
      utm_id: formData.get('utm_id') || '',
      utm_term: formData.get('utm_term') || '',
      utm_content: formData.get('utm_content') || '',
      device: formData.get('device') || '',
      matchtype: formData.get('matchtype') || '',
      network: formData.get('network') || '',
      gclid: formData.get('gclid') || '',
      
      // Meta data
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
      subject: formData.get('subject') || 'Nieuwe tattoo boeking via website',
      from_name: formData.get('from_name') || 'Oottat Tattoo Boekingsformulier'
    };

    const webhookUrl = form.getAttribute('action');
    const redirectUrl = formData.get('redirect') || 'https://oottattattoo.nl/bedankt';

    try {
      // Disable submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Versturen...';

      // Send JSON to Make.com webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Successful submission - redirect to thank you page
        window.location.href = redirectUrl;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }

    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Er ging iets mis bij het versturen. Probeer het opnieuw of neem contact op via WhatsApp.');
      
      // Re-enable submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
