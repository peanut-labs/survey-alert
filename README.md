Survey-Alert
============


## DESCRIPTION

Survey Alert is a small standalone Javascript alert which ties into the [PeanutLabs Monetization API](http://peanut-labs.github.io/publisher-doc/#overview) and is intended to help inform and direct users if they have surveys available to complete.

It's entirely vanilla Javascript and has no dependencies, so can be included on a webpage by itself to easily allow for a custom alert to be shown on the page. It is also meant as an example of how to interface with the [PeanutLabs Monetization API](http://peanut-labs.github.io/publisher-doc/#overview), showing a sample implementation of the Campaigns Summary method.

Survey Alert can either be used as is, or act as a jumping off point for building your own custom integration and alert into your website.

## EXAMPLE USAGE

Basic usage of the Survey Alert is shown in the included html file. To see the alert, a valid user ID and user IP need to be entered before clicking the 'Check' button ([for more information on these, see the Parameters section in the API guide](http://peanut-labs.github.io/publisher-doc/#methodcampaigns)). The alert should appear similar to that below:

![Example screenshot](../blob/master/example-screenshot.png?raw=true)

The way it is included into the page is very simple. Firstly the single javascript file is included in the head:

```html
<script type="text/javascript" src="js/alert.js"></script>
```

A function is also added to the head for initializing the alert with the needed parameters and the custom options (more information on these can be found in the Basic Customization section below):

```html
<script type="text/javascript">
  function initAlert() {
    PeanutLabsAlert.initialize({
      userId: document.getElementById('user_id').value,
      userIP: document.getElementById('user_ip').value,
      debugEnabled: true,
      hideAfter: 4, // seconds
      iframeURL: 'http://peanutlabs.com/sampleIframe.php?userId=' + document.getElementById('user_id').value,
      positionHorizontal: 'right',
      positionVertical: 'bottom',
      server: 'http://api.peanutlabs.com',
      currency_name: 'Peanuts'
    });
  }
</script>
```

And finally something on the page needs to call this function, which in this example is just tied to a button:

```html
<a class="btn btn-lg btn-primary" href="javascript: initAlert();" role="button">Check</a>
```

In an actual usage of the alert it would be more likely that you would call this differently, for example automatically after a page loads, passing it the user id and user ip.

## BASIC CUSTOMIZATION

Some basic customization can be done while still using the Survey Alert exactly as it is, by passing optional parameters to initialize() method. These are:

 - **userId (required)**

   The id of the user for which you wish to look up surveys. For more details on this check the API documentation.  

 - **userIP (required)**

   The IP adress of the user for which you wish to look up surveys. For more details on this check the API documentation.  

 - **iframeURL (required)**

   The url which is included on the alert and a user is prompted to click to go complete surveys.  This will most likely point to the page on which you have the iframe hosted.  

 - **server**

   The server to which the api request will be sent.  It defaults to api.peanutlabs.com, and in most cases can be left as this.  

 - **alertWidth**

   The width of the alert. Defaults to 450px and the text it contains will wrap accordingly.  

 - **positionVertical**

   Determines wheather the alert will appear from the top or the bottom of the page. Can be set either to 'top' or 'bottom' and defaults to 'bottom'.  

 - **positionHorizontal**

   Determines wheather the alert will appear from the left or the right of the page. Can be set either to 'left' or 'right' and defaults to 'right'.  

 - **hideAfter**

   How many seconds the alert will stay on screen before hiding. Note that this will be delayed if the user mouses over the alert and start again when they move the mouse off of it. Defaults to 10 seconds.  

 - **currency_name**

   The name of your virtual currency which the alert will use in the message. Defaults to 'Points'.  

 - **logoURL**

   The url for the image which will be displayed next to the alert message. Defaults to a PeanutLabs logo hosted at http://ii.peanutlabs.com/PL_Logo.png.  

 - **debugEnabled**

   A boolean which if set to true, will cause debug messages to be logged to the console. Defaults to false and should only be set to true for testing purposes.  
	
