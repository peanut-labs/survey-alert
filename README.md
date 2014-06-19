PeanutLabs Survey-Alert
=======================

## Description

Survey Alert is a small standalone Javascript alert which ties into the [PeanutLabs Monetization API](http://peanut-labs.github.io/publisher-doc/#overview) and is intended to help inform and direct users if they have surveys available to complete.

It's entirely vanilla Javascript and has no dependencies, so can be included on a webpage by itself to easily allow for a custom alert to be shown on the page. It is also meant as an example of how to interface with the [PeanutLabs Monetization API](http://peanut-labs.github.io/publisher-doc/#overview), showing a sample implementation of the Campaigns Summary method.

Survey Alert can either be used as is, or act as a jumping off point for building your own custom integration and alert into your website.

## Example Usage

Basic usage of the Survey Alert is shown in the included html file. To see the alert in action, you first will need to change the `iframeURL` in the example html to the url you have the iframe hosted on. Then after loading the html page, a valid user ID needs to be entered before clicking the 'Check' button ([for more information on this, see the Parameters section in the API guide](http://peanut-labs.github.io/publisher-doc/#methodcampaigns)). The alert should appear similar to that below:

![Example screenshot](../master/example-screenshot.png?raw=true)

The way it is included into the page is very simple. Firstly the single javascript file is included in the head:

```html
<script type="text/javascript" src="alert.js"></script>
```

A function is also added to the head for initializing the alert with the needed parameters and the custom options (more information on these can be found in the Parameters and Basic Customization section below):

```html
<script type="text/javascript">
  function initAlert() {
    PeanutLabsAlert.initialize({
      userId: 'ID_OF_THE_USER_YOU_WANT_TO_MAKE_THE_CALL_FOR', // This needs to be changed to the user's ID.
      hideAfter: 4, // Makes the alert hide after 4 seconds. Can be left out, and will default to 10 seconds.
      iframeURL: 'YOUR_IFRAME_URL_GOES_HERE', // This URL needs to be changed to the url for the iframe.
      positionHorizontal: 'right',
      positionVertical: 'bottom',
      currencyName: 'Peanuts',
      debugEnabled: true
    });
  }
</script>
```

And finally something on the page needs to call this function, which in the example html is just tied to a button:

```html
<a class="btn btn-lg btn-primary" href="javascript: initAlert();" role="button">Check</a>
```

**NOTE:**
In an actual usage of the alert it would be more likely that you would call this differently, for example automatically after a page loads, passing it the id of the user visiting that page and the url you have the iframe hosted on.

## Parameters and Basic Customization

When initializing the Survey Alert there are a few parameters you are required to pass to it, along with several optional parameters which allow for some basic customization:

### Required parameters:

 - **userId (required):**  
   The id of the user for which you wish to look up surveys. For more details on this check the API documentation.

 - **iframeURL (required):**  
   The url which is included on the alert and the user is prompted to click to go complete surveys.  In the example code this currently has a placeholder, but in practice it will point to the page on which you have the iframe hosted.

### Optional Parameters:

 - **alertWidth**  
   The width of the alert. Defaults to 450px and the text it contains will wrap accordingly.

 - **positionVertical**  
   Determines whether the alert will appear from the top or the bottom of the page. Can be set either to 'top' or 'bottom' and defaults to 'bottom'.

 - **positionHorizontal**  
   Determines whether the alert will appear from the left or the right of the page. Can be set either to 'left' or 'right' and defaults to 'right'.

 - **hideAfter**  
   How many seconds the alert will stay on screen before hiding. Note that this will be delayed if the user mouses over the alert and start again when they move the mouse off of it. Defaults to 10 seconds.

 - **currencyName**  
   The name of your virtual currency which the alert will use in the message. Defaults to 'Points'.

 - **logoURL**  
   The url for the image which will be displayed next to the alert message. Defaults to a PeanutLabs logo hosted at http://ii.peanutlabs.com/PL_Logo.png.

 - **debugEnabled**  
   A boolean which if set to true, will cause debug messages to be logged to the console. Defaults to false and should only be set to true for testing purposes.
  
## Further Customization and Integration

Although it is completely possible to use the Survey Alert as is, it is highly encouraged to dig right into the code and just use this example as a jumping off point for integrating the Monetization API more directly into your site.

For customizing, rewriting or just looking through the Survey Alert as an example, it is recommended you look at the coffeescript file in the `/src/` folder. This is the main commented source file, which is compiled with Cake into the javascript found in the root.

### Custom Styling:

If you are just looking to modify the look of the alert, styling is done with the `STYLE` string. This string is injected the into the page, and then gets applied to the elements in the template html defined in `alertTplNew`.

### Further Customization:
If you wish to do further customization or integrate the API more deeply in your site, check out the [API documentation itself](http://peanut-labs.github.io/publisher-doc/#methodcampaignssummary). 
