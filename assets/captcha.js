      var verifyCallback = function(response) {
        alert(response);
      };
      let widgetId1,
       widgetId2,
       widgetId3,
       widgetId4;

      var onloadCallback = function() {
        // Renders the HTML element with id 'example1' as a reCAPTCHA widget.
        // The id of the reCAPTCHA widget is assigned to 'widgetId1'.
        widgetId1 = grecaptcha.render('indexHtmlForm', {
          'sitekey' : '6Ld7ur8qAAAAANtr_xQ7Q59y-_wlUM4Ue5a6BX7p',
          'theme' : 'dark'
        });
        widgetId2 = grecaptcha.render(document.getElementById('modal1Form'), {
          'sitekey' : '6Ld7ur8qAAAAANtr_xQ7Q59y-_wlUM4Ue5a6BX7p',
          'theme' : 'dark'
        });
        widgetId3 = grecaptcha.render(document.getElementById('contactForm'), {
          'sitekey' : '6Ld7ur8qAAAAANtr_xQ7Q59y-_wlUM4Ue5a6BX7p',
          'theme' : 'dark'
        });
        widgetId4 = grecaptcha.render(document.getElementById('contact3Form'), {
          'sitekey' : '6Ld7ur8qAAAAANtr_xQ7Q59y-_wlUM4Ue5a6BX7p',
          'theme' : 'dark',
          'callback' : verifyCallback,
          });
      };