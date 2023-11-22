// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import HeatMapToolNode, { HeatMapToolNodeOptions } from './HeatMapToolNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

/**
 * The AngleToolNode is a static tool that displays a heat map representation of angle data.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type AngleToolNodeOptions = SelfOptions & StrictOmit<HeatMapToolNodeOptions, 'titleStringProperty' | 'heatNodeShape' | 'binWidth' | 'minValue' | 'maxValue'>;

export default class AngleToolNode extends HeatMapToolNode {
  public constructor( providedOptions: AngleToolNodeOptions ) {
    const options = optionize<AngleToolNodeOptions, SelfOptions, HeatMapToolNodeOptions>()( {
      titleStringProperty: ProjectileDataLabStrings.launchAngleStringProperty,
      heatNodeShape: new Shape().rect( 0, 0, 10, 10 ),
      binWidth: 1,
      minValue: 0,
      maxValue: 10
    }, providedOptions );
    super( options );
  }
}

projectileDataLab.register( 'AngleToolNode', AngleToolNode );