// Copyright 2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
import projectileDataLab from './projectileDataLab.js';

type StringsType = {
  'projectile-data-lab': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'variabilityStringProperty': LocalizedStringProperty;
    'sourcesStringProperty': LocalizedStringProperty;
    'measuresStringProperty': LocalizedStringProperty;
    'samplingStringProperty': LocalizedStringProperty;
  };
  'noAirResistanceStringProperty': LocalizedStringProperty;
  'configurationStringProperty': LocalizedStringProperty;
  'projectile10kgStringProperty': LocalizedStringProperty;
  'fieldStringProperty': LocalizedStringProperty;
};

const ProjectileDataLabStrings = getStringModule( 'PROJECTILE_DATA_LAB' ) as StringsType;

projectileDataLab.register( 'ProjectileDataLabStrings', ProjectileDataLabStrings );

export default ProjectileDataLabStrings;
