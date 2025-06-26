<!-- URBVERDE-GCMES/src/components/cards/graphics/LineGraphic.vue -->
<!-- LineGraphic.vue -->
<template>
  <div class="line-chart-wrapper" ref="chartContainer">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  name: 'LineGraphic',
  props: {
    xData: {
      type: Array,
      default: () => [],
    },
    yData: {
      type: Array,
      default: () => [],
    },
    xLabel: {
      type: String,
      default: '',
    },
    yLabel: {
      type: String,
      default: '',
    },
    dataType: {
      type: String,
      default: 'Data',
    },
    chartColor: {
      type: String,
      default: '#4CAF50',
    },
    chartBgColor: {
      type: String,
      default: 'rgba(76, 175, 80, 0.1)',
    },
    suggestYScale: {
      type: Boolean,
      default: true,
    },
    paddingFactor: {
      type: Number,
      default: 0.1,
    },
    showAverage: {
      type: Boolean,
      default: true,
    },
    averageLineColor: {
      type: String,
      default: 'rgba(255, 99, 132, 1)',
    },
    averageLineDash: {
      type: Array,
      default: () => [5, 5],
    },
    averageLineWidth: {
      type: Number,
      default: 2,
    },
    averageLabel: {
      type: String,
      default: 'Média histórica',
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    // Calculate suggested min and max for Y axis
    yAxisRange() {
      if (!this.yData || this.yData.length === 0) {
        return { min: 0, max: 100 };
      }

      const validValues = this.yData.filter(val => val !== null && val !== undefined && !isNaN(val));
      if (validValues.length === 0) {
        return { min: 0, max: 100 };
      }

      const minValue = Math.min(...validValues);
      const maxValue = Math.max(...validValues);

      // Calculate range and add padding
      const range = maxValue - minValue;
      const padding = range * this.paddingFactor;

      // Ensure min is never negative unless data values are negative
      const calculatedMin = minValue >= 0 ? Math.max(0, minValue - padding) : minValue - padding;
      const calculatedMax = maxValue + padding;

      return {
        min: calculatedMin,
        max: calculatedMax
      };
    },
    // Calculate historical average from yData
    historicalAverage() {
      if (!this.yData || this.yData.length === 0) {
        return 0;
      }

      const validValues = this.yData.filter(val => val !== null && val !== undefined && !isNaN(val));
      if (validValues.length === 0) {
        return 0;
      }

      const sum = validValues.reduce((acc, val) => acc + val, 0);

      return sum / validValues.length;
    },
    chartDependencies() {
      return {
        xData: this.xData,
        yData: this.yData,
        suggestYScale: this.suggestYScale,
        paddingFactor: this.paddingFactor,
        showAverage: this.showAverage,
        averageLineColor: this.averageLineColor,
        averageLineDash: this.averageLineDash,
        averageLineWidth: this.averageLineWidth,
        averageLabel: this.averageLabel,
      };
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      if (!this.$refs.chartCanvas) {return;}

      const ctx = this.$refs.chartCanvas.getContext('2d');
      const yAxisSettings = this.getYAxisSettings();

      // Create chart configuration
      const config = {
        type: 'line',
        data: {
          labels: this.xData,
          datasets: [{
            label: this.dataType,
            data: this.yData,
            borderColor: this.chartColor,
            backgroundColor: this.chartBgColor,
            borderWidth: 2,
            pointBackgroundColor: this.chartColor,
            tension: 0.4,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: !!this.xLabel,
                text: this.xLabel
              }
            },
            y: {
              title: {
                display: !!this.yLabel,
                text: this.yLabel
              },
              ...yAxisSettings
            }
          }
        }
      };

      // Add historical average line if enabled
      if (this.showAverage && this.yData && this.yData.length > 0) {
        this.addAverageLineToConfig(config);
      }

      // Create the chart
      this.chart = new Chart(ctx, config);
    },

    addAverageLineToConfig(config) {
      const avgValue = this.historicalAverage;

      // Add horizontal average line as an annotation
      if (!config.options.plugins) {
        config.options.plugins = {};
      }

      // Configure annotation plugin
      config.options.plugins.annotation = {
        annotations: {
          averageLine: {
            type: 'line',
            yMin: avgValue,
            yMax: avgValue,
            borderColor: this.averageLineColor,
            borderWidth: this.averageLineWidth,
            borderDash: this.averageLineDash,
            label: {
              display: true,
              content: `${this.averageLabel}: ${avgValue.toFixed(1)}`,
              position: 'end',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: this.averageLineColor,
              font: {
                weight: 'bold'
              },
              padding: 4
            }
          }
        }
      };

      // Add average line to legend
      config.data.datasets.push({
        label: this.averageLabel,
        data: Array(this.xData.length).fill(avgValue),
        borderColor: this.averageLineColor,
        borderDash: this.averageLineDash,
        borderWidth: this.averageLineWidth,
        pointRadius: 0,
        fill: false,
        tension: 0
      });
    },

    getYAxisSettings() {
      if (!this.suggestYScale) {
        return { beginAtZero: true };
      }

      return {
        min: this.yAxisRange.min,
        max: this.yAxisRange.max,
        beginAtZero: this.yAxisRange.min >= 0
      };
    },

    updateChart() {
    if (!this.chart) { return; }

    this._updateCoreData();
    this._updateYAxisScale();
    this._updateOrRemoveAverageLine();

    this.chart.update();
  }

  },
  watch: {
    xData() {
      this.updateChart();
    },
    yData() {
      this.updateChart();
    },
    suggestYScale() {
      this.updateChart();
    },
    paddingFactor() {
      this.updateChart();
    },
    showAverage() {
      this.updateChart();
    },
    averageLineColor() {
      this.updateChart();
    },
    averageLineDash() {
      this.updateChart();
    },
    averageLineWidth() {
      this.updateChart();
    },
    averageLabel() {
      this.updateChart();
    },
    chartDependencies: {
    handler() {
      this.updateChart();
    },
    deep: true
    },
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
};
</script>

  <style scoped>
  .line-chart-wrapper {
    width: 100%;
    min-height: 0;
  }

  canvas {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    min-height: 300px;
    max-height: 350px;
  }
  </style>
