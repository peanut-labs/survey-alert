Survey-Alert
============

## Description

Survey Alert is a small standalone Javascript alert which ties into the [PeanutLabs Monetization API](http://peanut-labs.github.io/publisher-doc/#overview) and is intended to help inform and direct users if they have surveys available to complete.

It's entirely vanilla Javascript and has no dependencies, so can be included on a webpage by itself to easily allow for a custom alert to be shown on the page. It is also meant as an example of how to interface with the [PeanutLabs Monetization API](http://peanut-labs.github.io/publisher-doc/#overview), showing a sample implementation of the Campaigns Summary method.

Survey Alert can either be used as is, or act as a jumping off point for building your own custom integration and alert into your website.

## Example Usage

Basic usage of the Survey Alert is shown in the included html file. To see the alert in action, you first will need to change the `iframeURL` in the exmaple html to the url you have the iframe hosted on. Then after loading the html page, a valid user ID needs to be entered before clicking the 'Check' button ([for more information on this, see the Parameters section in the API guide](http://peanut-labs.github.io/publisher-doc/#methodcampaigns)). The alert should appear similar to that below:

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
      userId: document.getElementById('user_id').value,
      debugEnabled: true,
      hideAfter: 4, // Makes the alert hide after 4 seconds. Can be left out, and will default to 10 seconds.
      iframeURL: 'YOUR_IFRAME_URL_GOES_HERE',
      positionHorizontal: 'right',
      positionVertical: 'bottom',
      currency_name: 'Peanuts'
    });
  }
</script>
```

And finally something on the page needs to call this function, which in this example is just tied to a button:

```html
<a class="btn btn-lg btn-primary" href="javascript: initAlert();" role="button">Check</a>
```

In an actual usage of the alert it would be more likely that you would call this differently, for example automatically after a page loads, passing it the user id.

## Parameters and Basic Customization

When initializing the Survey Alert there are a few parameters you are required to pass to it, along with several optional parameters which allow for some basic customization:

### Required parameters:

 - **userId (required):**  
   The id of the user for which you wish to look up surveys. For more details on this check the API documentation.

 - **iframeURL (required):**  
   The url which is included on the alert and the user is prompted to click to go complete surveys.  In the example code this currently has a placeholder, but in practice it will point to the page on which you have the iframe hosted.

### Optional Parameters:

 - **userIP:**  
   The IP adress of the user for which you wish to look up surveys. This is not required if you are issuing the API request from the users browser, but will be needed if you wish to make the call server to server. For more details on this check the API documentation.

 - **server:**  
   The server to which the api request will be sent.  It generally be left as the default of api.peanutlabs.com, but can be changed if you want to have it use https or a different server.

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
	
## Further Customization and Integration

Although it is completely possible to use the Survey Alert as is, it is highly encouraged to dig right into the code and just use this example as a jumpping off point for integrating the Monetization API more directly into your site.

For customizing, rewriting or just looking through the Survey Alert as an example, it is reccommended you look at the coffeescript file in the `/src/` folder. This is the main commented source file, which is compiled with Cake into the javascript found in the root.

### Custom Styling:

If you are just looking to modify the look of the alert, styling is done with the `STYLE` string. This string is injected the into the page, and then gets applied to the elements in the template html defined in `alertTplNew`.

### Using the API Result:

The actual API request itself if made with the `sendRequest` and `getAPIUrl` methods:

```CoffeeScript
# Appends a script to the head with the src pointing to the API request url.
sendRequest: ->
  script = document.createElement('script')
  script.src = @getAPIUrl()
  head = document.getElementsByTagName('head')[0]
  head.appendChild(script)

# Formats the API request url, using the userId and server url from the options, and passing in the JSONP parameter with the callback method you wish to trigger.
getAPIUrl: -> "#{@ops.server}#{API_URL}?user_id=#{@ops.userId}&jsonp=PeanutLabsAlert.handleAlert"
```

`sendRequest` appends a script element to the head, with the source pointing to the actual API request url itself. For more detail on the format of this request, look at the [API documentation itself](http://peanut-labs.github.io/publisher-doc/#methodcampaignssummary), but the key thing to note is the `jsonp=PeanutLabsAlert.handleAlert` parameter passed in. This causes the reseult returned by the API call to be wrapped with the `PeanutLabsAlert.handleAlert()` method call, passing the JSON result to that as a parameter.
