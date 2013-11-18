/**
 * Key of ScriptProperty for Firtbit consumer key.
 * 
 * @type {String}
 * @const
 */
var CONSUMER_KEY_PROPERTY_NAME = "fitbitConsumerKey";

/**
 * Key of ScriptProperty for Fitbit consumer secret.
 * 
 * @type {String}
 * @const
 */
var CONSUMER_SECRET_PROPERTY_NAME = "fitbitConsumerSecret";

/**
 * Default loggable resources.
 * 
 * @type String[]
 * @const
 */
var LOGGABLES = [
      "activities/log/steps",
      "activities/log/distance",
      "activities/log/activeScore",
      "activities/log/minutesSedentary",
      "activities/log/minutesLightlyActive",
      "activities/log/minutesFairlyActive",
      "activities/log/minutesVeryActive",
      "sleep/startTime",
      "sleep/timeInBed",
      "sleep/minutesAsleep",
      "sleep/awakeningsCount",
      "sleep/minutesAwake",
      "sleep/minutesToFallAsleep",
      "sleep/minutesAfterWakeup",
      "sleep/efficiency"
    ];

function refreshTimeSeries() {
  // if the user has never configured ask him to do it here
  if (!isConfigured()) {
    renderFitbitConfigurationDialog();
    return;
  }
  
  var user = authorize();
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var t = doc.getLastRow();
  doc.setFrozenRows(1);

  var options = {
    "oAuthServiceName" : "fitbit",
    "oAuthUseToken" : "always",
    "method" : "GET"
  };

  var activities = LOGGABLES;
  for ( var activity in activities) {
    var currentActivity = activities[activity];
    try {
      var result = UrlFetchApp.fetch("http://api.fitbit.com/1/user/-/"
          + currentActivity + "/date/" + getStartDate() + "/" + getEndDate() + ".json", options);
    } catch (exception) {
      Logger.log(exception);
    }
    var o = Utilities.jsonParse(result.getContentText());

    var r = t + 1;
    var s = "a" + r;
    var cell = doc.getRange(s);

    // fill data
    var index = 0;
    for ( var i in o) {
      var row = o[i];
      for ( var j in row) {
        var val = row[j];
        cell.offset(index, 0).setValue(val["dateTime"]);
        // set the date index
        cell.offset(index, 1 + activity * 1.0).setValue(val["value"]);
        // set the value index index
        index++;
      }
    }
  }
}

function isConfigured() {
  return getConsumerKey() != "" && getConsumerSecret() != "";
}

/**
 * Get start and end dates and set them
*/
var newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
var yesterdayDate = new Date(newDate),
    formatDate = yesterdayDate.toISOString();
var dateString = formatDate.slice(0,10);

function getStartDate() {
  var startDate = ScriptProperties.getProperty("startDate");
  var newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
  var yesterdayDate = new Date(newDate),
      formatDate = yesterdayDate.toISOString();
  var dateString = formatDate.slice(0,10);
  if (startDate === '') {
    startDate = dateString;
  } else {
    startDate = startDate;
  }
  return startDate;
}

function setStartDate(startDate) {
  ScriptProperties.setProperty("startDate", startDate);
}

function getEndDate() {
  var endDate = ScriptProperties.getProperty("endDate");
  var newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
  var yesterdayDate = new Date(newDate),
      formatDate = yesterdayDate.toISOString();
  var dateString = formatDate.slice(0,10);
  if (endDate === '') {
    endDate = dateString;
  } else {
    endDate = endDate;
  }
  return endDate;
}

function setEndDate(endDate) {
  ScriptProperties.setProperty("endDate", endDate);
}

/**
 * @return String OAuth consumer key to use when tweeting.
 */
function getConsumerKey() {
  var key = ScriptProperties.getProperty(CONSUMER_KEY_PROPERTY_NAME);
  if (key == null) {
    key = "";
  }
  return key;
}

/**
 * @param String
 *      OAuth consumer key to use when tweeting.
 */
function setConsumerKey(key) {
  ScriptProperties.setProperty(CONSUMER_KEY_PROPERTY_NAME, key);
}

/**
 * @return String OAuth consumer secret to use when tweeting.
 */
function getConsumerSecret() {
  var secret = ScriptProperties.getProperty(CONSUMER_SECRET_PROPERTY_NAME);
  if (secret == null) {
    secret = "";
  }
  return secret;
}

/**
 * @param String
 *      OAuth consumer secret to use when tweeting.
 */
function setConsumerSecret(secret) {
  ScriptProperties.setProperty(CONSUMER_SECRET_PROPERTY_NAME, secret);
}

/** Retrieve config params from the UI and store them. */
function saveConfiguration(e) {
  setConsumerKey(e.parameter.consumerKey);
  setConsumerSecret(e.parameter.consumerSecret);
  setStartDate(e.parameter.startDate);
  setEndDate(e.parameter.endDate);
  var app = UiApp.getActiveApplication();
  app.close();
  return app;
}
/**
 * Configure all UI components and display a dialog to allow the user to
 * configure approvers.
 */
function renderFitbitConfigurationDialog() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var app = UiApp.createApplication().setTitle("Configure Fitbit");
  app.setStyleAttribute("padding", "10px");
  app.setHeight('0.9');

  var helpLabel = app
      .createLabel("From here you will configure access to fitbit -- Just supply your own"
          + "consumer key and secret \n\n"
          + "Important:  To authroize this app you need to load the script in the script editor"
          + " (tools->Script Manager) and then run the 'authorize' script.");
  helpLabel.setStyleAttribute("text-align", "justify");
  helpLabel.setWidth("95%");
  var consumerKeyLabel = app.createLabel("Fitbit OAuth Consumer Key:");
  var consumerKey = app.createTextBox();
  consumerKey.setName("consumerKey");
  consumerKey.setWidth("100%");
  consumerKey.setText(getConsumerKey());
  var consumerSecretLabel = app.createLabel("Fitbit OAuth Consumer Secret:");
  var consumerSecret = app.createTextBox();
  consumerSecret.setName("consumerSecret");
  consumerSecret.setWidth("100%");
  consumerSecret.setText(getConsumerSecret());
  var startDateLabel = app.createLabel('Data Start Date yyyy-mm-dd');
  var startDate = app.createTextBox();
  startDate.setName("startDate");
  startDate.setWidth("100%");
  startDate.setText(getStartDate());
  var endDateLabel = app.createLabel('Data End Date yyyy-mm-dd');
  var endDate = app.createTextBox();
  endDate.setName("endDate");
  endDate.setWidth("100%");
  endDate.setText(getEndDate());

  var saveHandler = app.createServerClickHandler("saveConfiguration");
  var saveButton = app.createButton("Save Configuration", saveHandler);

  var listPanel = app.createGrid(6, 4);
  listPanel.setWidget(1, 0, consumerKeyLabel);
  listPanel.setWidget(1, 1, consumerKey);
  listPanel.setWidget(2, 0, consumerSecretLabel);
  listPanel.setWidget(2, 1, consumerSecret);
  listPanel.setWidget(3, 0, startDateLabel);
  listPanel.setWidget(3, 1, startDate);
  listPanel.setWidget(4, 0, endDateLabel);
  listPanel.setWidget(4, 1, endDate);

  // Ensure that all form fields get sent along to the handler
  saveHandler.addCallbackElement(listPanel);

  var dialogPanel = app.createFlowPanel();
  dialogPanel.add(helpLabel);
  dialogPanel.add(listPanel);
  dialogPanel.add(saveButton);
  app.add(dialogPanel);
  doc.show(app);
}

function authorize() {
  var oAuthConfig = UrlFetchApp.addOAuthService("fitbit");
  oAuthConfig.setAccessTokenUrl("http://api.fitbit.com/oauth/access_token");
  oAuthConfig.setRequestTokenUrl("http://api.fitbit.com/oauth/request_token");
  oAuthConfig.setAuthorizationUrl("http://api.fitbit.com/oauth/authorize");
  oAuthConfig.setConsumerKey(getConsumerKey());
  oAuthConfig.setConsumerSecret(getConsumerSecret());

  var options = {
    "oAuthServiceName" : "fitbit",
    "oAuthUseToken" : "always"
  };
}

/** When the spreadsheet is opened, add a Fitbit menu. */
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {
    name : "Refresh fitbit Time Data",
    functionName : "refreshTimeSeries"
  }, {
    name : "Configure",
    functionName : "renderFitbitConfigurationDialog"
  } ];
  ss.addMenu("Fitbit", menuEntries);
  var newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
  var yesterdayDate = new Date(newDate),
      formatDate = yesterdayDate.toISOString();
  var dateString = formatDate.slice(0,10);
  setStartDate(dateString);
  setEndDate(dateString);
}

function onInstall() {
  onOpen();
  // put the menu when script is installed
}

function dump(arr, level) {
  var dumped_text = "";
  if (!level)
    level = 0;

  // The padding given at the beginning of the line.
  var level_padding = "";
  for ( var j = 0; j < level + 1; j++)
    level_padding += "  ";

  if (typeof (arr) == 'object') { // Array/Hashes/Objects
    for ( var item in arr) {
      var value = arr[item];

      if (typeof (value) == 'object') { // If it is an array,
        dumped_text += level_padding + "'" + item + "' ...\n";
        dumped_text += dump(value, level + 1);
      } else {
        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
      }
    }
  } else { // Stings/Chars/Numbers etc.
    dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
  }
  return dumped_text;
}
