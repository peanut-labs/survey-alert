#
# Copyright 2014 Peanut Labs Inc.
#
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 

# Simple util method to add default values to 'b' that are defined in 'a' and not defined in 'b'
class Util
  @extend: (a, b)->
    for key of b
      if b.hasOwnProperty(key)
        a[key] = b[key]
    a

class PeanutLabsAlert

  EL_ID = 'PL_Alert'
  API_URL = '/publisher/api/v1/campaigns_summary'
  DEFAULTS = 
    server: 'http://api.peanutlabs.com'
    alertWidth: 450
    positionVertical: 'bottom'
    positionHorizontal: 'right'
    hideAfter: 10 #seconds
    debugEnabled: no
    iframeURL: ''
    currency_name: 'Points'
    logoURL: 'http://ii.peanutlabs.com/PL_Logo.png'

  STYLING = 
    """
       #PL_Alert {
        background-color: rgba(237,239,242,.70);
        -webkit-border-radius: 4px;
        -webkit-box-shadow: 0 2px 5px rgba(0,0,0,.1), inset 0 -1px 0 rgba(255,255,255,.15), 0 0 6px rgba(0,0,0,.08), 0 0 0 1px rgba(35,47,64,.5);
        background-image: -webkit-linear-gradient(90deg, rgba(218,223,230,.45) 0%, rgba(218,223,230,0) 100%);
        color: rgba(67,76,89,.9);
        text-shadow: 0 1px 0 rgba(255,255,255,.85);
        font: 12px/1.5 \"Lucida Grande\", \"Lucida Sans Unicode\", \"Lucida Sans\", \"DejaVu Sans\", Verdana, sans-serif;
        position: absolute;
        overflow:hidden;
       }
       
       #PL_Alert > div {
        border: none;
        background-color: rgba(255,255,255,.15);
        -webkit-border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.55);
        background: -webkit-linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.75) 100%);
        height: 100%;
        width:100%;
        display: table;
       }
       
       #PL_Alert >div >div {
        border: none;
        background-color: rgba(255,255,255,.15);
        -webkit-border-radius: 4px;
        -webkit-box-shadow: inset 0 -3px 2px rgba(58,71,89,.04);
        overflow: hidden;
        position: relative;
        display: table-row;
       }

       #PL_Alert :hover {
        border-color: rgba(0,0,0,1);
        background-color: rgba(237,239,242,1);
        cursor:pointer;
       }

       #PL_Alert_icon {
        padding: 15px;
        display: table-cell;
        vertical-align: top;
        text-align: center;
        min-width: 48px;
        width: auto;
        min-height: 100%;
        height: 100%;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 0px;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: rgba(26,57,102,.05);
        -webkit-box-shadow: 1px 0 0 rgba(255,255,255,.35), inset -1px 0 0 rgba(58,71,89,.1);
        background-image: none !important;
       }

       #PL_Alert_icon img {
        min-width: 48px;
        min-height: 48px;
        max-width: 256px;
        max-height: 256px;
        vertical-align: top;
        margin: 0;
        padding: 0;
        float: left;
        border-radius: 3px;
       }

       #PL_Alert_content {
        display: table-cell;
        vertical-align: top;
        padding: 10px 15px;
       }

       #Peanut_id_hide {
        position: absolute;
        right:8px;
        top:6px;
        font-size: 12px;
        z-index: 999;
        display: none;
        opacity: 0.8;
       }

       #PL_Alert:hover #Peanut_id_hide{
        display: block;
       }

       #PL_Alert_content_title {
        color: rgba(67,76,89,.9);
        font-size: 12px;
        margin: 5px 0 0 0px;
       }

       PL_Alert_content_body {
        margin: 5px 10px 5px 0px;
       }

       #PL_Alert a, #PL_Alert a:active{
        background: none;
        font-weight: bold;
        color:rgba(67,76,89,.9);
        text-decoration:none;
       }

       #PL_Alert a:hover{
        background: none;
        color:rgba(0,0,0,0.81);
        text-decoration:none;
       }
    """
  # Initializes the alert with default options defined above, 
  # then sends the API request with user details.
  initialize: (options)->
    options ||= {}
    @ops = @options = Util.extend(DEFAULTS, options)
    @sendRequest() if @validated()
    
  # Does some simple validation on key parameters. 
  validated: ->
    unless @ops.userId.indexOf('-') >= 0
      @printDebug('Invalid Parameter: userId')
      return no
    unless @ops.iframeURL.indexOf('http') >= 0
      @printDebug('Invalid Parameter: iframeURL')
      return no
    yes
  
  # Appends a script to the head with the src pointing to the API request url.
  sendRequest: ->
    script = document.createElement('script')
    script.src = @getAPIUrl()
    head = document.getElementsByTagName('head')[0]
    head.appendChild(script)
  
  # Formats the API request url, using the userId, userIp and server url from the options.
  getAPIUrl: -> "#{@ops.server}#{API_URL}?user_id=#{@ops.userId}&user_ip=#{@ops.userIP}&jsonp=PeanutLabsAlert.handleAlert"
  
  # Only shows the alert if the API response returns surveys, or the profiler.
  canShowAlert: (data)-> 
    (data.surveys.status is 'profiled' and data.surveys.count > 0) or (data.surveys.status is 'profiler_available')
  
  # Method called by the JSONP response from the API request, 
  # checks for basic validation on the response then shows the alert.
  handleAlert: (data)=>
    data.surveys ||= {}
    return no unless @canShowAlert(data)
    @response = data
    @showAlert()
    
  # Formats the content to be displayed from the values in the returned API response.
  getContent: ->
    content = {}
    if @response.surveys.status is 'profiled'
      content = 
        title: "You have surveys waiting for you!"
        body: "You qualify for #{@response.surveys.count} survey#{('s' if @response.surveys.count > 1) ? ''}. Earn up to #{@response.surveys.total_reward} #{@options.currency_name}!"
        footer: ''
    else
      content = 
        title: 'Profile and earn!'
        body: 'Earn Mo money'
    content
  
  # Creates the alert element, styles it, sets the content, 
  # then sets it to animate it and animate out after the timeout period.
  showAlert: ()->
    style = document.createElement('style')
    style.innerHTML = STYLING
    document.getElementsByTagName('head')[0].appendChild(style)
    div = document.createElement('div')
    div.id = EL_ID
    div.style.zIndex = 100000
    div.style.position = 'fixed'
    div.style.padding = '0px'
    div.style.paddingLeft = '0px'
    div.style.paddingTop = '0px'
    div.style.width = "#{@ops.alertWidth}px"
    
    div.style[@ops.positionVertical] = 25
    div.style[@ops.positionHorizontal] = 25
    
    # Delay the hiding of the alert if the user mouses over it.
    div.onmouseover = ()=>clearTimeout(@hideTimer)
    div.onmouseout = ()=>@scheduleHideAlert()
    
    content = @getContent()
    div.innerHTML = @alertTplNew(content.title, content.body, content.footer)
    document.getElementsByTagName('body')[0].appendChild(div)
    div.className = 'notification'
    document.getElementById('Peanut_id_hide').onclick = ()=>@hideAlert()

    # Calcualte how for it should move, then start animating the alert in.
    @slideDistance = -1 * div.clientHeight
    @animateIn(div, @slideDistance, 25, ()=>@scheduleHideAlert())
    
  # Animate the alert, moving it in or out a bit,
  # then set a timeout to call the animation again.
  animate: (el, from, to, direction, doneAnimating)->
    if (direction is 'in' and from >= to) or (direction is 'out' and to >= from)
      doneAnimating() if doneAnimating
      return
    el.style[@ops.positionVertical] = "#{from}px" 
    if direction is 'in' then new_from = from + 25 else new_from = from - 25
    setTimeout (()=>@animate(el, new_from, to, direction, doneAnimating)), 25
  
  animateIn: (el, from, to, doneAnimating)-> @animate(el, from, to, 'in', doneAnimating)
  animateOut: (el, from, to, doneAnimating)-> @animate(el, from, to, 'out', doneAnimating)
  
  # Creates a timeout to hide the alert after the time specified in the options.
  scheduleHideAlert: -> 
    @hideTimer = setTimeout((()=>@hideAlert()), @ops.hideAfter * 1000)
  
  # Starts the alert animating out.
  hideAlert: -> 
    clearTimeout(@hideTimer)
    el = @getAlertElement()
    @animateOut(el, 0, @slideDistance, (()=>el.parentNode.removeChild(el)))
  
  getAlertElement: -> document.getElementById(EL_ID)
  
  # Template for the alert html. Gets styled from the styling defined earlier.
  alertTplNew: (title, body, footer)->
    html = """
        <a class="close" href="javascript: void(0);" id="Peanut_id_hide">&times;</a>
        <div>
          <div>
          	<span id="PL_Alert_icon"> <img width="128" alt="icon" src="#{@ops.logoURL}"></span>
            	<div id="PL_Alert_content">
                <h1 id="PL_Alert_content_title">#{title}</h1>
                <p id="PL_Alert_content_body">#{body} <a href="#{@ops.iframeURL}">Click here</a></p>
              </div>
          </div>
        </div>
    """
  
  # Simple message to log debug messages to the console if debugging is enabled.
  printDebug: (msg)->
    return unless @ops.debugEnabled
    console.log "Debug Msg: #{msg}"
    
window.PeanutLabsAlert = new PeanutLabsAlert()