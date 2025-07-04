// URBVERDE-GCMES/src/constants/layers.js

// Declare allowed years
const VECTOR_YEARS = [2016, 2017, 2018, 2019, 2020, 2021];
const RASTER_YEARS = [2016, 2017, 2018, 2019, 2020, 2021, '2016-2021'];
const PARKS_YEARS = [2021];
const CENSUS_YEARS = [2022];

/**
 * A single file that holds all layer definitions.
 * Each layer defines:
 * - type: either 'raster' or 'vector'
 * - label: human-readable name
 * - source or source: either a function that returns a dynamic vector source or a static source object (for raster layers)
 * - property: the feature property used for color interpolation (only for vector layers)
 * - stops: an array of value/color pairs for use in interpolations
 * - unit: any measurement unit for display in popups
 * - popup: a standard configuration for popups (the same for all layers)
 */

export const LAYER_CONFIGS = {

  population: {
    type: 'vector',
    label: 'População',
    allowedYears: CENSUS_YEARS,
    filterable: false, // Para o caso de vetores que não devem ser filtrados para determinado município
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_setores_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_setores_2022'
    }),
    property: 'v0001',
    // Using a more varied color palette - Viridis (blue to green to yellow)
    stops: [
      [0, '#440154'],     // Dark purple
      [250, '#3b528b'],   // Blue
      [500, '#21918c'],   // Teal
      [750, '#5ec962'],   // Green
      [1000, '#fde725']   // Yellow
    ],
    unit: 'hab',
    popup: {
      label: 'População',
      unit: 'habitantes',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  setores: {
    type: 'vector',
    label: 'Setores Censitários',
    allowedYears: VECTOR_YEARS,
    source: (year, scale, municipioId) => {
      if (scale !== 'intraurbana' || !municipioId) {
        return null;
      }

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geom_setores/{z}/{x}/{y}.pbf?cql_filter=cd_mun=${municipioId}`
        ],
        minzoom: 0,
        maxzoom: 22,
        sourceLayer: 'public.geom_setores'
      };
    },
    paint: {
      'fill-color': 'transparent',
      'fill-outline-color': '#7c99f4',
      'fill-opacity': 0.3
    }
  },

  // Climate layers
  surface_temp: {
    type: 'raster',
    label: 'Temperatura de Superfície',
    allowedYears: RASTER_YEARS,
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:tst-intraurbana-rel-30m-2021a2016&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.65,
      'raster-resampling': 'nearest'
    },
    stops: [
      [-8, '#3288bd'],
      [-6, '#66c2a5'],
      [-4, '#abdda4'],
      [-2, '#e6f598'],
      [0, '#fee08b'],
      [2, '#fdae61'],
      [4, '#f46d43'],
      [8, '#d53e4f']
    ],
    unit: '°C',
    popup: {
      label: 'Temperatura Relativa',
      unit: '°C',
      format: (v) => (v >= 0 ? '+' : '') + Number(v).toFixed(2)
    }
  },

  max_surface_temp: {
    type: 'vector',
    label: 'Temperatura Máxima de Superfície',
    allowedYears: VECTOR_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_temperatura_por_setor_${year}`
        : `public.geodata_temperatura_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        minzoom: 0,
        maxzoom: 22,
        sourceLayer
      };
    },
    property: 'c3',
    stops: [
      [27, '#3288bd'],
      [32, '#99d594'],
      [37, '#e6f598'],
      [42, '#fee08b'],
      [47, '#fc8d59'],
      [52, '#d53e4f']
    ],
    unit: '°C'
  },

  heat_island: {
    type: 'vector',
    label: 'Nível de exposição à ilha de calor',
    allowedYears: VECTOR_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_temperatura_por_setor_${year}`
        : `public.geodata_temperatura_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'c1',
    stops: [
      [0, '#3288bd'],
      [2.8, '#99d594'],
      [4.5, '#e6f598'],
      [19, '#fee08b'],
      [36, '#fc8d59'],
      [44, '#d53e4f']
    ],
    unit: ''
  },

  // Vegetation layers
  pcv: {
    type: 'vector',
    label: 'Percentual de Cobertura Vegetal',
    allowedYears: VECTOR_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_vegetacao_por_setor_${year}`
        : `public.geodata_vegetacao_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'b1',
    stops: [
      [0.04, '#ffffe5'],
      [0.14, '#f7fcb9'],
      [0.15, '#d9f0a3'],
      [0.18, '#addd8e'],
      [0.21, '#78c679'],
      [0.25, '#41ab5d'],
      [0.28, '#238443'],
      [0.31, '#006837'],
      [0.44, '#004529']
    ],
    unit: '%',
    popup: {
      label: 'PCV',
      unit: '%',
      multiplier: 100
    }
  },

  icv: {
    type: 'vector',
    label: 'Índice de Cobertura Vegetal',
    allowedYears: VECTOR_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_vegetacao_por_setor_${year}`
        : `public.geodata_vegetacao_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'b2',
    stops: [
      [730, '#ffffe5'],
      [1323, '#d9f0a3'],
      [2083, '#78c679'],
      [3385, '#238443'],
      [4033, '#004529']
    ],
    unit: 'm²/hab'
  },

  idsa: {
    type: 'vector',
    label: 'Índice de Desigualdade Socioambiental',
    allowedYears: VECTOR_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_vegetacao_por_setor_${year}`
        : `public.geodata_vegetacao_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'b3',
    stops: [
      [0.33, '#2b83ba'],
      [0.455, '#abdda4'],
      [0.555, '#fdae61'],
      [0.685, '#d7191c']
    ],
    unit: ''
  },

  cvp: {
    type: 'raster',
    label: 'Cobertura Vegetal por Pixel',
    allowedYears: RASTER_YEARS,
    source: (year) => ({
      type: 'raster',
      tiles: [
        `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:PCV-30m-8bits-${year}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`
      ],
      tileSize: 256
    }),
    paint: {
      'raster-opacity': 0.7
    },
    /**
     * Example stops array with 12 colors from 0% to 100%
     * If you have 12 exact colors, you can split 0–100 into 11 segments,
     * e.g. every 10% or ~9%.  Below is an example with each 9% increment.
     */
    stops: [
      [0, '#ff4903'],
      [9, '#ff7100'],
      [18, '#ff9300'],
      [27, '#ffb200'],
      [36, '#ffd000'],
      [45, '#edd500'],
      [54, '#dadb00'],
      [63, '#c5df00'],
      [72, '#9bcc05'],
      [81, '#73b90f'],
      [90, '#49a416'],
      [100, '#10901b']
    ],
    unit: '%',
    popup: {
      label: 'PCV',
      unit: '',
      multiplier: -1
    }
  },

  ndvi: {
    type: 'raster',
    label: 'Vigor da Vegetação (NDVI)',
    allowedYears: RASTER_YEARS,
    source: (year) => ({
      type: 'raster',
      tiles: [
        `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:NDVI-10m-${year}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`
      ],
      tileSize: 256
    }),
    paint: {
      'raster-opacity': 0.7
    },
    /**
     * For NDVI 0–100%, define your color gradient stops:
     */
    stops: [
      [0, '#addd8e'],
      [20, '#78c679'],
      [40, '#41ab5d'],
      [60, '#238443'],
      [80, '#006837'],
      [100, '#004529']
    ],
    unit: '%',
    popup: {
      label: 'NDVI',
      unit: '',
      multiplier: 1
    }
  },

  // Parks layers
  parks: {
    type: 'vector',
    label: 'Praças',
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geom_pracas/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geom_pracas'
    }),
    paint: {
      'fill-color': '#40826D',
      'fill-opacity': 0.7,
      'fill-outline-color': '#40826D'
    }
  },

  avg_distance_to_squares: {
    type: 'vector',
    label: 'Distância Média até as Praças',
    allowedYears: PARKS_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_pracas_por_setor_${year}`
        : `public.geodata_pracas_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'a4',
    stops: [
      [1.23, '#1a9850'],
      [1.69, '#91cf60'],
      [2.83, '#d9ef8b'],
      [7.45, '#ffffbf'],
      [18.97, '#fee08b'],
      [35.07, '#fc8d59'],
      [46.76, '#d73027']
    ],
    unit: 'm'
  },

  square_area_per_capita: {
    type: 'vector',
    label: 'Área de Praças por Habitante',
    allowedYears: PARKS_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_pracas_por_setor_${year}`
        : `public.geodata_pracas_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'a2',
    stops: [
      [0, '#d53e4f'],
      [40, '#f46d43'],
      [50, '#fdae61'],
      [60, '#fee08b'],
      [70, '#e6f598'],
      [85, '#abdda4']
    ],
    unit: 'm²/hab'
  },

  square_served_area: {
    type: 'vector',
    label: 'Área Atendida pelas Praças',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_pracas_por_setor_${year}`
        : `public.geodata_pracas_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'a3',
    stops: [
      [0, '#d53e4f'],
      [20, '#f46d43'],
      [40, '#fdae61'],
      [60, '#fee08b'],
      [80, '#e6f598'],
      [100, '#3288bd']
    ],
    unit: '%'
  },

  served_population: {
    type: 'vector',
    label: 'População Atendida pelas Praças',
    allowedYears: PARKS_YEARS,
    source: (year, scale) => {
      // pick the correct tile url for scale
      const sourceLayer =
        scale === 'intraurbana'
          ? `public.geodata_pracas_por_setor_${year}`
          : `public.geodata_pracas_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'a1',

    // "Default" stops (for estadual)
    // E.g. 0 -> 100% coverage
    stops: [
      [0, '#d53e4f'],
      [14.3, '#f46d43'],
      [28.6, '#fdae61'],
      [42.9, '#fee08b'],
      [57.9, '#e6f598'],
      [71.5, '#abdda4'],
      [85.8, '#66c2a5'],
      [100, '#3288bd']
    ],
    unit: 'habitantes',

    popup: {
      label: 'População Atendida',
      unit: '%',
      format: (v) => v.toFixed(0)
    }
  },
};

// Helper function to get layer config
export function getLayerConfig(layerId, year, scale) {
  const base = LAYER_CONFIGS[layerId];
  if (!base) { return null; }

  // If base.source is a function, call it
  const source = typeof base.source === 'function'
    ? base.source(year, scale)
    : base.source;

  return { ...base, source };
}

// Helper to get layer paint properties
export function getLayerPaint(config, { scale, municipioId, statistics } = {}) {
  if (config.type === 'raster') {
    return config.paint;
  }

  // Handle vector layers
  const property = config.property;

  // If we're in intraurbana scale and have stats
  if (scale === 'intraurbana' && statistics && municipioId) {
    // Get min/mean/max for the property (e.g. a1_min, a1_mean, a1_max)
    const min = statistics[`${property}_min`];
    const mean = statistics[`${property}_mean`];
    const max = statistics[`${property}_max`];

    if (min !== undefined && mean !== undefined && max !== undefined) {
      return {
        'fill-opacity': 0.7,
        'fill-color': [
          'case',
          ['==', ['get', 'cd_mun'], municipioId],
          [
            'interpolate',
            ['linear'],
            ['get', property],
            min, '#d53e4f',
            mean, '#fee08b',
            max, '#3288bd'
          ],
          'transparent'  // All other features become transparent
        ]
      };
    }
  }

  // Default estadual scale paint or fallback
  return {
    'fill-opacity': 0.7,
    'fill-color': [
      'interpolate',
      ['linear'],
      ['to-number', ['get', property]],
      ...config.stops.flat()
    ]
  };
}
