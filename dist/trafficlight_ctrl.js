'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/trafficlight-panel.css!', '@grafana/data'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, moment, _, TimeSeries, stringToJsRegex, _createClass, panelDefaults, TrafficLightCtrl;

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
    }, function (_cssTrafficlightPanelCss) {}, function (_grafanaData) {
      stringToJsRegex = _grafanaData.stringToJsRegex;
    }],
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
          useDiffAsColor: false,
          showTrend: true,
          redThreshold: 20,
          greenThreshold: 80,
          noValueNumber: null,
          max: 100,
          fontSize: '12px',
          fontColor: 'black',
          units: '',
          digits: 1,
          transformationDict: 'source1=target1;source2=target2',
          spreadControls: false,
          sortLights: false,
          renderLink: false,
          linkUrl: "",
          linkTooltip: "",
          linkTargetBlank: false
        }
      };

      _export('TrafficLightCtrl', TrafficLightCtrl = function (_MetricsPanelCtrl) {
        _inherits(TrafficLightCtrl, _MetricsPanelCtrl);

        function TrafficLightCtrl($scope, $injector, templateSrv) {
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
          _this.templateSrv = templateSrv;
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
            this.applyRegex();
          }
        }, {
          key: 'applyRegex',
          value: function applyRegex() {
            var _this2 = this;

            var seriesList = this.series;
            if (seriesList && seriesList.length > 0) {
              for (var i = 0; i < seriesList.length; i++) {
                if (this.panel.trafficLightSettings.regexPattern !== '' && this.panel.trafficLightSettings.regexPattern !== undefined) {
                  var regexVal = stringToJsRegex(this.panel.trafficLightSettings.regexPattern);
                  if (seriesList[i].id && regexVal.test(seriesList[i].id.toString())) {
                    var _ret = function () {
                      var temp = regexVal.exec(seriesList[i].id.toString());
                      if (!temp) {
                        return 'continue';
                      }
                      var extractedtxt = '';
                      if (temp.length > 1) {
                        temp.slice(1).forEach(function (value, i) {
                          if (value) {
                            extractedtxt += extractedtxt.length > 0 ? ' ' + value.toString() : value.toString();
                          }
                        });
                        _this2.data[i].name = extractedtxt;
                      }
                    }();

                    if (_ret === 'continue') continue;
                  } else {
                    this.data[i].name = seriesList[i].id;
                    seriesList[i].label = seriesList[i].id;
                  }
                } else {
                  this.data[i].name = seriesList[i].id;
                  seriesList[i].label = seriesList[i].id;
                }
              }
            }
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            var newseries = [];
            var transformationDict = this.panel.trafficLightSettings.transformationDict;

            var transHt = {};

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = transformationDict.split(';')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var tra = _step.value;

                var cols = tra.split('=');
                if (cols.length >= 2) {
                  transHt[cols[0]] = cols[1];
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

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
                newserie.realvalue = newserie.value;
                if (this.panel.trafficLightSettings.useDiffAsColor) newserie.value = newserie.trend;
                if (transHt[newserie["name"]]) newserie["tname"] = transHt[newserie["name"]];else newserie["tname"] = newserie["name"];
                newseries.push(newserie);
              }
            } catch (e) {
              // This is not a time serie
              this.series = [];
              for (var i = 0; i < dataList[0].rows.length; i++) {
                var newserie = {
                  "name": dataList[0].rows[i][0],
                  "value": dataList[0].rows[i][1],
                  "realvalue": dataList[0].rows[i][1]
                };

                if (transHt[newserie["name"]]) newserie["tname"] = transHt[newserie["name"]];else newserie["tname"] = newserie["name"];

                newseries.push(newserie);
              }
            }

            if (this.panel.trafficLightSettings.sortLights) {
              this.data = _.sortBy(newseries, [function (o) {
                return o.name.replace(":", "").replace(" ", "").replace("}", "").replace("{", "");
              }]);
            } else {
              if (this.panel.trafficLightSettings.invertScale) this.data = _.orderBy(newseries, 'value', 'desc');else this.data = _.orderBy(newseries, 'value', 'asc');
            }
            this.applyRegex();
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
          key: 'renderLink',
          value: function renderLink(link, scopedVars, format) {
            var scoped = {};
            for (var key in scopedVars) {
              scoped[key] = { value: scopedVars[key] };
            }
            if (format) {
              return this.templateSrv.replace(link, scoped, format);
            } else {
              return this.templateSrv.replace(link, scoped);
            }
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
          value: function link(scope, elem, attrs, ctrl) {
            var _this3 = this;

            this.events.on('render', function () {
              var $panelContainer = elem.find('.panel-container');

              if (_this3.panel.bgColor) {
                $panelContainer.css('background-color', _this3.panel.bgColor);
              } else {
                $panelContainer.css('background-color', '');
              }
              setTimeout(function () {
                return ctrl.renderingCompleted();
              }, 1250);
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
