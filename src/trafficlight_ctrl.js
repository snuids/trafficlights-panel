import {MetricsPanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import TimeSeries from 'app/core/time_series';

import './css/trafficlight-panel.css!';

const panelDefaults = {  
  bgColor: null  
  ,trafficLightSettings:
  { 
    lightsPerLine:5,
    width:20,
    invertScale:false,
    showValue:true,
    redThreshold:80,
    greenThreshold:20,
    max:100,
    fontSize:'12px'
  }
};

export class TrafficLightCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    _.defaultsDeep(this.panel, panelDefaults);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
    this.events.on('panel-initialized', this.render.bind(this));

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));

    this.percentPerLight=100;

    this.data=[]
    this.updateTraffics();
  }



  onDataError() {
    this.series = [];
    this.render();
  }

  onRender() {
    //this.data = this.parseSeries(this.series);
    console.log("On Render");
  }



  onDataReceived(dataList) {
    this.series = dataList.map(this.seriesHandler.bind(this));
    
    var newseries=[]
    for(var i =0;i<this.series.length;i++)
    {
      var newserie={
        "name":this.series[i].label,
        "value":this.series[i].datapoints.slice(-1)[0][0]
      }
      newseries.push(newserie);
    }
    console.log(JSON.stringify(newseries));
    
    if(this.panel.trafficLightSettings.invertScale)
      this.data=_.orderBy(newseries, 'value','desc');
    else
      this.data=_.orderBy(newseries, 'value','asc');
  }

  seriesHandler(seriesData) {
    var series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target
    });
    return series;
  }

  onInitEditMode() {
    
    this.addEditorTab('Options', 'public/plugins/grafana-traffic-lights/editor.html', 2);
  }

  onPanelTeardown() {
    this.$timeout.cancel(this.nextTickPromise);
  }

  updateTraffics() {
    this.percentPerLight=100/this.panel.trafficLightSettings.lightsPerLine;
    
    this.lines=[];
    var metrics=[];
    for(var i=0;i<this.data.length;i++)
    {
      if((i%this.panel.trafficLightSettings.lightsPerLine)==0)
			{
				metrics=[];
				this.lines.push(metrics);
      }
      metrics.push(this.data[i]);
    }
    this.nextTickPromise = this.$timeout(this.updateTraffics.bind(this), 1000);
  }

  



  
  link(scope, elem) {
    this.events.on('render', () => {
      const $panelContainer = elem.find('.panel-container');

      if (this.panel.bgColor) {
        $panelContainer.css('background-color', this.panel.bgColor);
      } else {
        $panelContainer.css('background-color', '');
      }
    });
  }
}

TrafficLightCtrl.templateUrl = 'module.html';