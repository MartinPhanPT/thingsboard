///
/// Copyright © 2016-2024 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Component } from '@angular/core';
import {
  legendPositions,
  legendPositionTranslationMap,
  WidgetSettings,
  WidgetSettingsComponent
} from '@shared/models/widget.models';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { formatValue, mergeDeep } from '@core/utils';
import {
  LatestChartTooltipValueType,
  latestChartTooltipValueTypes,
  latestChartTooltipValueTypeTranslations
} from '@home/components/widget/lib/chart/latest-chart.models';
import {
  barChartWidgetDefaultSettings,
  BarChartWidgetSettings
} from '@home/components/widget/lib/chart/bar-chart-widget.models';

@Component({
  selector: 'tb-bar-chart-widget-settings',
  templateUrl: './bar-chart-widget-settings.component.html',
  styleUrls: []
})
export class BarChartWidgetSettingsComponent extends WidgetSettingsComponent {

  legendPositions = legendPositions;

  legendPositionTranslationMap = legendPositionTranslationMap;

  latestChartTooltipValueTypes = latestChartTooltipValueTypes;

  latestChartTooltipValueTypeTranslationMap = latestChartTooltipValueTypeTranslations;

  barChartWidgetSettingsForm: UntypedFormGroup;

  valuePreviewFn = this._valuePreviewFn.bind(this);

  tooltipValuePreviewFn = this._tooltipValuePreviewFn.bind(this);

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected settingsForm(): UntypedFormGroup {
    return this.barChartWidgetSettingsForm;
  }

  protected defaultSettings(): WidgetSettings {
    return mergeDeep<BarChartWidgetSettings>({} as BarChartWidgetSettings, barChartWidgetDefaultSettings);
  }

  protected onSettingsSet(settings: WidgetSettings) {
    this.barChartWidgetSettingsForm = this.fb.group({

      sortSeries: [settings.sortSeries, []],

      barSettings: [settings.barSettings, []],

      axisMin: [settings.axisMin, []],
      axisMax: [settings.axisMax, []],
      axisTickLabelFont: [settings.axisTickLabelFont, []],
      axisTickLabelColor: [settings.axisTickLabelColor, []],

      animation: [settings.animation, []],

      showLegend: [settings.showLegend, []],
      legendPosition: [settings.legendPosition, []],
      legendLabelFont: [settings.legendLabelFont, []],
      legendLabelColor: [settings.legendLabelColor, []],
      legendValueFont: [settings.legendValueFont, []],
      legendValueColor: [settings.legendValueColor, []],

      showTooltip: [settings.showTooltip, []],
      tooltipValueType: [settings.tooltipValueType, []],
      tooltipValueDecimals: [settings.tooltipValueDecimals, []],
      tooltipValueFont: [settings.tooltipValueFont, []],
      tooltipValueColor: [settings.tooltipValueColor, []],
      tooltipBackgroundColor: [settings.tooltipBackgroundColor, []],
      tooltipBackgroundBlur: [settings.tooltipBackgroundBlur, []],

      background: [settings.background, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['showLegend', 'showTooltip'];
  }

  protected updateValidators(emitEvent: boolean) {
    const showLegend: boolean = this.barChartWidgetSettingsForm.get('showLegend').value;
    const showTooltip: boolean = this.barChartWidgetSettingsForm.get('showTooltip').value;

    if (showLegend) {
      this.barChartWidgetSettingsForm.get('legendPosition').enable();
      this.barChartWidgetSettingsForm.get('legendLabelFont').enable();
      this.barChartWidgetSettingsForm.get('legendLabelColor').enable();
      this.barChartWidgetSettingsForm.get('legendValueFont').enable();
      this.barChartWidgetSettingsForm.get('legendValueColor').enable();
    } else {
      this.barChartWidgetSettingsForm.get('legendPosition').disable();
      this.barChartWidgetSettingsForm.get('legendLabelFont').disable();
      this.barChartWidgetSettingsForm.get('legendLabelColor').disable();
      this.barChartWidgetSettingsForm.get('legendValueFont').disable();
      this.barChartWidgetSettingsForm.get('legendValueColor').disable();
    }
    if (showTooltip) {
      this.barChartWidgetSettingsForm.get('tooltipValueType').enable();
      this.barChartWidgetSettingsForm.get('tooltipValueDecimals').enable();
      this.barChartWidgetSettingsForm.get('tooltipValueFont').enable();
      this.barChartWidgetSettingsForm.get('tooltipValueColor').enable();
      this.barChartWidgetSettingsForm.get('tooltipBackgroundColor').enable();
      this.barChartWidgetSettingsForm.get('tooltipBackgroundBlur').enable();
    } else {
      this.barChartWidgetSettingsForm.get('tooltipValueType').disable();
      this.barChartWidgetSettingsForm.get('tooltipValueDecimals').disable();
      this.barChartWidgetSettingsForm.get('tooltipValueFont').disable();
      this.barChartWidgetSettingsForm.get('tooltipValueColor').disable();
      this.barChartWidgetSettingsForm.get('tooltipBackgroundColor').disable();
      this.barChartWidgetSettingsForm.get('tooltipBackgroundBlur').disable();
    }
  }

  private _valuePreviewFn(): string {
    const units: string = this.widgetConfig.config.units;
    const decimals: number = this.widgetConfig.config.decimals;
    return formatValue(110, decimals, units, false);
  }

  private _tooltipValuePreviewFn(): string {
    const tooltipValueType: LatestChartTooltipValueType = this.barChartWidgetSettingsForm.get('tooltipValueType').value;
    const decimals: number = this.barChartWidgetSettingsForm.get('tooltipValueDecimals').value;
    if (tooltipValueType === LatestChartTooltipValueType.percentage) {
      return formatValue(35, decimals, '%', false);
    } else {
      const units: string = this.widgetConfig.config.units;
      return formatValue(110, decimals, units, false);
    }
  }

}
