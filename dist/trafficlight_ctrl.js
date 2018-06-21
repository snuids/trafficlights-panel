'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/trafficlight-panel.css!'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, moment, _, TimeSeries, _createClass, panelDefaults, TrafficLightCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_cssTrafficlightPanelCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      panelDefaults = {
        bgColor: null,
        trafficLightSettings: {
          lightsPerLine: 5,
          width: 20,
          invertScale: false,
          showValue: true,
          showTrend: true,
          redThreshold: 20,
          greenThreshold: 80,
          max: 100,
          fontSize: '12px',
          units: '',
          digits: 1,
          spreadControls: false
        }
      };

      _export('TrafficLightCtrl', TrafficLightCtrl = function (_MetricsPanelCtrl) {
        _inherits(TrafficLightCtrl, _MetricsPanelCtrl);

        function TrafficLightCtrl($scope, $injector) {
          _classCallCheck(this, TrafficLightCtrl);

          var _this = _possibleConstructorReturn(this, (TrafficLightCtrl.__proto__ || Object.getPrototypeOf(TrafficLightCtrl)).call(this, $scope, $injector));

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
          _this.events.on('panel-initialized', _this.render.bind(_this));

          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));

          _this.percentPerLight = 100;

          _this.data = [];
          _this.updateTraffics();
          return _this;
        }

        _createClass(TrafficLightCtrl, [{
          key: 'onDataError',
          value: function onDataError() {
            this.series = [];
            this.render();
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            //this.data = this.parseSeries(this.series);
            //console.log("On Render");
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            var newseries = [];

            try {
              this.series = dataList.map(this.seriesHandler.bind(this));

              for (var i = 0; i < this.series.length; i++) {
                var newserie = {
                  "name": this.series[i].label,
                  "value": this.series[i].datapoints.slice(-1)[0][0]
                };

                if (this.series[i].datapoints.length > 1) {
                  newserie.trend = newserie.value - this.series[i].datapoints.slice(-2)[0][0];

                  if (newserie.trend > 0) {
                    if (this.panel.trafficLightSettings.invertScale) newserie.trendClass = 'traffic-light-trend-bad';else newserie.trendClass = 'traffic-light-trend-good';
                  } else if (newserie.trend < 0) {
                    if (this.panel.trafficLightSettings.invertScale) newserie.trendClass = 'traffic-light-trend-good';else newserie.trendClass = 'traffic-light-trend-bad';
                  } else newserie.trendClass = 'traffic-light-trend-neutral';
                }
                newseries.push(newserie);
              }
            } catch (e) {
              // This is not a time serie
              this.series = [];
              for (var i = 0; i < dataList[0].rows.length; i++) {
                var newserie = {
                  "name": dataList[0].rows[i][0],
                  "value": dataList[0].rows[i][1]
                };
                newseries.push(newserie);
              }
            }

            //    console.log(newseries)


            if (this.panel.trafficLightSettings.invertScale) this.data = _.orderBy(newseries, 'value', 'desc');else this.data = _.orderBy(newseries, 'value', 'asc');
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {
            var series = new TimeSeries({
              datapoints: seriesData.datapoints,
              alias: seriesData.target
            });
            return series;
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {

            this.addEditorTab('Options', 'public/plugins/snuids-trafficlights-panel/editor.html', 2);
          }
        }, {
          key: 'onPanelTeardown',
          value: function onPanelTeardown() {
            this.$timeout.cancel(this.nextTickPromise);
          }
        }, {
          key: 'updateTraffics',
          value: function updateTraffics() {

            var trafficsperline = this.panel.trafficLightSettings.lightsPerLine;

            if (this.panel.trafficLightSettings.spreadControls) {
              trafficsperline = this.data.length;
              if (this.data.length == 0) trafficsperline = 1;
              this.percentPerLight = 100 / trafficsperline;
            } else this.percentPerLight = 100 / trafficsperline;

            this.lines = [];
            var metrics = [];
            for (var i = 0; i < this.data.length; i++) {
              if (i % trafficsperline == 0) {
                metrics = [];
                this.lines.push(metrics);
              }
              metrics.push(this.data[i]);
            }
            this.nextTickPromise = this.$timeout(this.updateTraffics.bind(this), 1000);
          }
        }, {
          key: 'link',
          value: function link(scope, elem) {
            var _this2 = this;

            this.events.on('render', function () {
              var $panelContainer = elem.find('.panel-container');

              if (_this2.panel.bgColor) {
                $panelContainer.css('background-color', _this2.panel.bgColor);
              } else {
                $panelContainer.css('background-color', '');
              }
            });
          }
        }]);

        return TrafficLightCtrl;
      }(MetricsPanelCtrl));

      _export('TrafficLightCtrl', TrafficLightCtrl);

      TrafficLightCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=trafficlight_ctrl.js.map
