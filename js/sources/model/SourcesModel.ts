// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMModel from '../../common-vsm/model/VSMModel.js';
import { CustomLauncherSpeedForType, CustomLauncherSpeedSDForType } from '../../common-vsm/model/CustomLauncherType.js';

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SourcesModel extends VSMModel {

  public constructor( providedOptions: PDLModelOptions ) {

    super( providedOptions );

    this.fields.forEach( field => {
      field.angleStabilizerProperty.link( angleStabilizer => {
        field.launchAngleStandardDeviationProperty.value = angleStabilizer;
      } );
      field.customLauncherTypeProperty.link( customLauncherType => {
        field.launchSpeedAverageProperty.value = CustomLauncherSpeedForType( customLauncherType );
        field.launchSpeedStandardDeviationProperty.value = CustomLauncherSpeedSDForType( customLauncherType );
      } );
    } );
  }
}

projectileDataLab.register( 'SourcesModel', SourcesModel );