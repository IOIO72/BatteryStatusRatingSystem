// Experimenting on Battery Status API draft specification
// https://dvcs.w3.org/hg/dap/raw-file/default/battery/Overview.html
// Author: Tamio Patrick Honma <tamio@honma.de>
// Licence: MIT
window.batteryStatus = {

    Config: {

        // The percentage of the battery energy levels classified by sections.
        // Label names and ranges can be customized.
        EnergyLevel: {
            critical:	[0		, 0.05], // 0% to 5%
            low:		[0.06	, 0.15], // 6% to 15%
            okay:		[0.16	, 0.5], // etc.
            high:		[0.51	, 0.8],
            full:		[0.81	, 1]
        },

        // Time level classification for charging and discharging times.
        // Label names and ranges can be customized.
        TimeLevel: {
            verylittle: [0		, 300], // 0 to 5 minutes (300 seconds)
            little:		[301	, 1800], // 5.1 to 30 minutes (1800 seconds)
            normal:		[1801	, 3600], // etc.
            much:		[3601	, 7200],
            verymuch:	[7201	, 'Infinity']
        },

        // Rating classification by combinations of energy and time levels from above.
        EnergyRating: {
            best: {
                EnergyLevels:	['full'],
                TimeLevels:		['verymuch']
            },
            good: {
                EnergyLevels:	['high','full'],
                TimeLevels:		['much','verymuch']
            },
            mediocre: {
                EnergyLevels:	['okay','high','full'],
                TimeLevels:		['normal','much','verymuch']
            },
            bad: {
                EnergyLevels:	['low','okay','high','full'],
                TimeLevels:		['little','normal','much','verymuch']
            },
            worst: {
                EnergyLevels:	['critical','low','okay','high','full'],
                TimeLevels:		['verylittle','little','normal','much','verymuch']
            }
        },
        DefaultRatingWhileCharging: 'charging',

        // Labels for charging state
        BatteryCharge: {
            charging: "charging",
            discharging: "discharging"
        },

        // HTML5 data attribute labels
        Data: {
            classification: {
                batterylevelperc:		'bat-percent',
                batterylevel: 			'bat-level',
                timelevelcharging:		'bat-time-charging',
                timeleveldischarging:	'bat-time-discharging',
                rating:					'bat-rating',
                charging:				'bat-charge'
            }
        }
    },

    API: {
        init: function() {
            var self = this;
            navigator.getBattery().then(
                function(battery) {
                    self.batteryAPI = battery;
                    batteryStatus.View.$body.trigger('battery:set');
                }
            );
        },
        batteryAPI: {}
    },

    Event: {
        init: function() {
            $(document).ready(this.onDocumentReady);
        },
        batteryready: false,
        onDocumentReady: function() {
            batteryStatus.View.init();
            batteryStatus.API.init();
            batteryStatus.View.$body
                .on('battery:set', batteryStatus.Event.onBatteryReady)
            ;
        },
        onBatteryReady: function() {
            batteryStatus.Event.batteryready = true;
            $(batteryStatus.API.batteryAPI)
                .on('chargingchange', 			batteryStatus.Event.onChargingChange)
                .on('chargingtimechange', 		batteryStatus.Event.onChargingTimeChange)
                .on('dischargingtimechange',    batteryStatus.Event.onDischargingTimeChange)
                .on('levelchange', 				batteryStatus.Event.onBatteryLevelChange)
            ;
            batteryStatus.View.showBatteryStatus();
            batteryStatus.Widget.BatterySymbol.update();
            batteryStatus.Widget.BatteryFillSymbol.update();
        },
        onChargingChange: function() {
            batteryStatus.View.showLog('<b>charging change</b>');
            batteryStatus.View.showBatteryCharge();
            batteryStatus.View.showRating();
        },
        onChargingTimeChange: function() {
            batteryStatus.View.showLog('<b>charging time change</b>');
            batteryStatus.View.showBatteryChargingTime();
            batteryStatus.View.showBatteryChargingTimeLevelName();
            batteryStatus.View.showRating();
        },
        onDischargingTimeChange: function() {
            batteryStatus.View.showLog('<b>discharging time change</b>');
            batteryStatus.View.showBatteryDischargingTime();
            batteryStatus.View.showBatteryDischargingTimeLevelName();
            batteryStatus.View.showRating();
        },
        onBatteryLevelChange: function() {
            batteryStatus.View.showLog('<b>battery level change</b>');
            batteryStatus.View.showBatteryLevel();
            batteryStatus.View.showBatteryLevelPercentage();
            batteryStatus.View.showBatteryLevelName();
            batteryStatus.View.showRating();
            batteryStatus.Widget.BatterySymbol.update();
            batteryStatus.Widget.BatteryFillSymbol.update();
        }
    },

    View: {
        init: function() {
            this.$log = $('#log');
            this.$body = $('body');
        },
        showLog: function(text, type) {
            if (this.$log.length > 0) {
                type = (type) ? type : 'log';
                this.$log.prepend('<li class="' + type + '">' + text + '</li>');
            }
        },
        showBatteryStatus: function() {
            this.showBatteryLevel();
            this.showBatteryLevelPercentage();
            this.showBatteryLevelName();
            this.showBatteryCharge();
            this.showBatteryChargingTime();
            this.showBatteryChargingTimeLevelName();
            this.showBatteryDischargingTime();
            this.showBatteryDischargingTimeLevelName();
            this.showRating();
        },
        showBatteryChargingTime: function() {
            this.showLog('Charging time: <u>' + batteryStatus.Controller.getBatteryChargingTime() + '</u> seconds');
        },
        showBatteryDischargingTime: function() {
            this.showLog('Discharging time: <u>' + batteryStatus.Controller.getBatteryDischargingTime() + '</u> seconds');
        },
        showBatteryChargingTimeLevelName: function() {
            var _chargingtime = batteryStatus.Controller.getBatteryChargingTime();
            this.$body.attr(
                'data-' + batteryStatus.Config.Data.classification.timelevelcharging,
                batteryStatus.Controller.getTimeLevelName(_chargingtime)
            );
            this.showTimeLevelName(_chargingtime);
        },
        showBatteryDischargingTimeLevelName: function() {
            var _dischargingtime = batteryStatus.Controller.getBatteryDischargingTime();
            this.$body.attr(
                'data-' + batteryStatus.Config.Data.classification.timeleveldischarging,
                batteryStatus.Controller.getTimeLevelName(_dischargingtime)
            );
            this.showTimeLevelName(_dischargingtime);
        },
        showBatteryLevel: function() {
            this.showLog('Battery level: <u>' + batteryStatus.Controller.getEnergyLevel() + '</u>');
        },
        showBatteryLevelPercentage: function() {
            var _levelpercentage = batteryStatus.Controller.getEnergyLevelPercentage();
            this.$body.attr('data-' + batteryStatus.Config.Data.classification.batterylevelperc, _levelpercentage);
            this.showLog('Battery level percentage: <u>' + _levelpercentage + '</u> %');
        },
        showBatteryLevelName: function() {
            var _levelname = batteryStatus.Controller.getEnergyLevelName();
            this.$body.attr('data-' + batteryStatus.Config.Data.classification.batterylevel, _levelname);
            this.showLog('Battery level name: <u>' + _levelname + '</u>');
        },
        showBatteryCharge: function() {
            this.$body.attr(
                'data-' + batteryStatus.Config.Data.classification.charging,
                (batteryStatus.Controller.isBatteryCharging()) ? batteryStatus.Config.BatteryCharge.charging : batteryStatus.Config.BatteryCharge.discharging
            );
            if (batteryStatus.Controller.isBatteryCharging()) {
                this.showLog('Battery charging: <u>' + batteryStatus.Config.BatteryCharge.charging + '</u>');
            } else {
                this.showLog('Battery charging: <u>' + batteryStatus.Config.BatteryCharge.discharging + '</u>');
            }
        },
        showTimeLevelName: function(timelevel) {
            this.showLog('Time level name: <u>' + batteryStatus.Controller.getTimeLevelName(timelevel) + '</u>');
        },
        showRating: function() {
            var _rating = batteryStatus.Controller.getRating();
            this.$body.attr('data-' + batteryStatus.Config.Data.classification.rating, _rating);
            this.showLog('Rating: <u>' + _rating + '</u>');
        }
    },

    Controller: {
        getBattery: function() {
            return batteryStatus.API.batteryAPI;
        },
        checkBatteryReady: function() {
            return batteryStatus.Event.batteryready;
        },
        getBatteryChargingTime: function() {
            return (this.checkBatteryReady()) ? this.getBattery().chargingTime : false;
        },
        getBatteryDischargingTime: function() {
            return (this.checkBatteryReady()) ? this.getBattery().dischargingTime : false;
        },
        getEnergyLevel: function() {
            return (this.checkBatteryReady()) ? this.getBattery().level : false;
        },
        getEnergyLevelPercentage: function(energylevel) {
            if (!this.checkBatteryReady()) return false;
            var _EnergyLevel = (energylevel) ? energylevel : this.getEnergyLevel();
            return Math.trunc(_EnergyLevel * 100);
        },
        getEnergyLevelName: function(energylevel) {
            if (!this.checkBatteryReady()) return false;
            var _EnergyLevel = (energylevel) ? energylevel : this.getEnergyLevel(),
                _LevelName = false;
            $.each(batteryStatus.Config.EnergyLevel, function(_className, _arrRange) {
                if (_EnergyLevel >= _arrRange[0] && _EnergyLevel <= _arrRange[1]) {
                    _LevelName = _className;
                    return false;
                }
            });
            return _LevelName;
        },
        getTimeLevelName: function(timelevel) {
            if (!this.checkBatteryReady()) return false;
            var _TimeLevel = timelevel || null,
                _LevelName = false;
            if (_TimeLevel === null) {
                _TimeLevel = this.getBatteryDischargingTime();
                if (!$.isNumeric(_TimeLevel)) {
                    _TimeLevel = this.getBatteryChargingTime();
                }
            }
            if (!$.isNumeric(_TimeLevel)) return false;
            $.each(batteryStatus.Config.TimeLevel, function(_className, _arrRange) {
                if ($.isNumeric(_arrRange[1])) {
                    if (_TimeLevel >= _arrRange[0] && _TimeLevel <= _arrRange[1]) {
                        _LevelName = _className;
                        return false;
                    }
                } else {
                    if (_TimeLevel >= _arrRange[0]) {
                        _LevelName = _className;
                        return false;
                    }
                }
            });
            return _LevelName;
        },
        getRating: function() {
            if (!this.checkBatteryReady()) return false;
            if (this.isBatteryCharging()) return batteryStatus.Config.DefaultRatingWhileCharging;
            var _LevelName = false,
                _EnergyLevelName = this.getEnergyLevelName(),
                _TimeLevelName = this.getTimeLevelName(this.getBatteryDischargingTime());
            if (_EnergyLevelName === false) {batteryStatus.View.showLog('<b>Energy Level: ' + _EnergyLevelName + '</b>', 'warn');} // debug
            if (_TimeLevelName === false) {batteryStatus.View.showLog('<b>Time Level: ' + _TimeLevelName + '</b>', 'warn');} // debug
            $.each(batteryStatus.Config.EnergyRating, function(_className, _arrNames) {
                if (($.inArray(_EnergyLevelName, _arrNames.EnergyLevels) > -1) && ((_TimeLevelName === false) || ($.inArray(_TimeLevelName, _arrNames.TimeLevels) > -1))) {
                    _LevelName = _className;
                    return false;
                }
            });
            return _LevelName;
        },
        isBatteryCharging: function() {
            return (this.checkBatteryReady()) ? this.getBattery().charging : false;
        }
    },

    Widget: {

        // Battery widget, which contains the percentage level
        BatterySymbol: {
            init: function() {
                this.$batterySymbol = $('.battery');
                if (this.$batterySymbol.length === 0) {
                    $('<div class="battery">BAT</div>').prependTo(batteryStatus.View.$body);
                    this.$batterySymbol = $('.battery');
                }
            },
            update: function() {
                if (typeof this.$batterySymbol === "undefined") this.init();
                $(this.$batterySymbol).html(batteryStatus.Controller.getEnergyLevelPercentage());
            }
        },

        // Battery widget with javascript generated background gradient to represent the energy level.
        BatteryFillSymbol: {
            init: function() {
                this.$batteryFillSymbol = $('.battery_js');
                if (this.$batteryFillSymbol.length === 0) {
                    $('<div class="battery_js">BAT</div>').prependTo(batteryStatus.View.$body);
                    this.$batteryFillSymbol = $('.battery_js');
                }
            },
            update: function() {
                if (typeof this.$batteryFillSymbol === "undefined") this.init();
                var _percent = batteryStatus.Controller.getEnergyLevelPercentage();
                $(this.$batteryFillSymbol).html(_percent);
                $(this.$batteryFillSymbol)
                    .css('background', '-webkit-linear-gradient(to top, rgba(120,255,10,1) 0%, rgba(120,200,10,1) ' + _percent + '%, rgba(255,255,255,1) ' + (_percent + 15) + '%, rgba(255,255,255,1) 100%)')
                    .css('background', '-moz-linear-gradient(to top, rgba(120,255,10,1) 0%, rgba(120,200,10,1) ' + _percent + '%, rgba(255,255,255,1) ' + (_percent + 15) + '%, rgba(255,255,255,1) 100%)')
                    .css('background', '-o-linear-gradient(to top, rgba(120,255,10,1) 0%, rgba(120,200,10,1) ' + _percent + '%, rgba(255,255,255,1) ' + (_percent + 15) + '%, rgba(255,255,255,1) 100%)')
                    .css('background', 'linear-gradient(to top, rgba(120,255,10,1) 0%, rgba(120,200,10,1) ' + _percent + '%, rgba(255,255,255,1) ' + (_percent + 15) + '%, rgba(255,255,255,1) 100%)')
                ;
            }
        }

    },

    init: function() {
        batteryStatus.Event.init();
    }

};
batteryStatus.init();
