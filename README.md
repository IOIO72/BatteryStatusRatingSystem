# Battery Status Rating System

*ioio.api.battery.js*

A javascript that writes the **battery status** and **calculated ratings** to the *data attributes* of the *body* tag.

The script is based on the [Battery Status API draft specification](http://www.w3.org/TR/battery-status/)
which is supported by modern web browsers.

Some browser implementations don't fully support the latest draft of the *Battery Status API specification*. The
*Battery Status Rating System* script generally tries to cope with the different implementations, but compatibility to
unfinished implementations is not the objective of this script.

# Possible use cases

## Critical battery status

* Reduce client side calculations, like heavy javascript algorithms, complex CSS layout renderings or animations.
* Reduce data transfers, like the frequency and volume of AJAX calls, unimportant data, already cached data, etc.
* Redirect to a light weight variation of your solution.

## Devices in charging state

* You can deliver more sophisticated features, which need more data transfer bandwidth and client side calculations.
* You can start synchronisation processes to save data into the offline storage.
* You can follow the hypothesis that the user is in a relaxed environment and would use other parts of your service than
  in on the go situations.

## Combined data and more

* You may combine the *battery status rating system* data with more data, like geo location, acceleration sensor data,
  network mode and much more, to interpret the usage scenarios and adapt your service to them.
* You may have additional ideas.

# Documentation

## Data attributes

The script adds the following HTML 5 data attributes into your body tag:

```html
<body data-bat-percent="95" data-bat-level="full" data-bat-charge="discharging" data-bat-time-charging="false"
      data-bat-time-discharging="much" data-bat-rating="good">
```

* **data-bat-percent:** The battery energy level as a percentage value from **0** to **100**
* **data-bat-level:** A classification of the battery energy level with these values: **full**, **high**, **okay**,
  **low**, **critical**
* **data-bat-charge:** Charging state: **charging** or **discharging**
* **data-bat-time-charging:** A classification of the estimated time to finish the charging: **verylittle**, **little**,
  **normal**, **much**, **verymuch**
* **data-bat-time-discharging:** A classification of the estimated time until the device may switch off: **verylittle**,
  **little**, **normal**, **much**, **verymuch**
* **data-bat-rating:** An interpretation of the battery level, discharging time and charging state as a classification:
  **best**, **good**, **mediocre**, **bad**, **worst**

*Note: **data-bat-time-charging** and **data-bat-time-discharging** may have the value **false** or **Infinity**, if time estimation is not possible.*

You can use these attributes for *JavaScript* or *CSS*.

## SCSS (CSS)

`source/sass/battery.scss`

The delivered *SCSS* file is an example of how you could use the data attributes of the body tag for *css*.

## JavaScript

`source/js/app/ioio.api.battery.js`

This is the core of the *Battery Status Rating System*.

There are certain objects and methods that you can change for your own purposes.

### Config

The easiest way of customization besides CSS is the configuration object `window.batteryStatus.Config`:

#### EnergyLevel, TimeLevel, EnergyRating

* You can change the classification names and values of the time, energy and rating levels.
* By default the classification scale of energy level, times and rating is set to five. You can change the scale number,
  but always use the same scale number for each classification. If you want to reduce the scale of energy levels from
  five to three, you also have to reduce the time and rating scale number from five to three.
* The order of the classifications and its scales is important and shouldn't be changed.

#### Data

The object `Data.classification` contains the label names for the data attributes of the body tag.

Here you can change the values of the object only. Don't change the label names.

### Widget

Another easy way to customize the script, is to add widgets into the object `window.batteryStatus.Widget`

1. Just add your new widget as a new object.
1. Add the function call to update the widget data to the desired event in the event object:
   `window.batteryStatus.Event`

### Events

Just use the existing event methods in `window.batteryStatus.Event` to call your own methods.

### Views

Just use your own views in `window.batteryStatus.View` by adding new methods or modifying or overwriting existing ones.

### Controller

The controller object contains the core methods and is not meant to be changed, except for bug fixes or new features.
However, do what you think and feel free and encouraged to submit pull requests.

# Build system

**Note:** For those, who don't want to use the build system, I've included the directory `build` into the repository.

## Full setup

1. Install [Node.js](https://nodejs.org/en/)
1. Install [Gulp.js](http://gulpjs.com/)
1. Install [Bower](http://bower.io/)
1. Enter `npm install`
1. Enter `bower install`

## Development workflow

### Serve and watch

```sh
gulp serve
```

This command builds the project, watches code changes and launches web browser and updates on code changes.

### Watch (Default)

```sh
gulp watch
```

or

```sh
gulp
```

This is basically the same as the `serve` task, but without the web browser launching and updating.

### Build

```sh
gulp build
```

This task builds the project without watching and doing anything else afterwards.

# Demonstration

I began coding this script on CodePen. You can see the first version of it there. *Note:* This script may not be the
recent version: <http://codepen.io/IOIO72/pen/QjOmob/>

I wrote an article in german about this project and the user experience aspects:
<http://www.honma.de/auf-kurs/2015/10/der-batteriestatus/>

# Contributing

You are very welcome to contribute your feedback to this project. The *Battery Status API* is a draft specification and
it may change in the future. Additionally the implementations in the web browsers are currently
[incomplete](http://caniuse.com/#feat=battery-status). Therefore the *Battery Status API - Rating System* depends highly
on contributions.

Be encouraged to ...

* send ideas, thoughts, feedback
* bug reports
* feature requests
* pull requests / merge requests

# Get in touch

You can chat with me about this and other projects of me on Slack.

[Join my Slack-Chat](https://tamiohonma.typeform.com/to/z1YOoo)

# License

MIT licenced

Copyright (c) 2015 Tamio Patrick Honma, <http://honma.de>
