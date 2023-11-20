// Copyright 2023, University of Colorado Boulder

/**
 * Base class for all models in the Projectile Data Lab.
 */
import TModel from '../../../../joist/js/TModel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PDLConstants from '../PDLConstants.js';

type SelfOptions = EmptySelfOptions;
export type ProjectileDataLabModelOptions = SelfOptions & { tandem: Tandem };

export default class PDLModel implements TModel {

  public readonly launcherAngleProperty: Property<number>;
  public readonly launcherHeightProperty: Property<number>;

  public readonly launcherTypeProperty: Property<number>;
  public readonly binWidthProperty: Property<number>;

  public constructor( providedOptions: ProjectileDataLabModelOptions ) {

    this.launcherAngleProperty = new Property<number>( 30, {
      validValues: [ 0, 30, 45, 60 ],
      tandem: Tandem.OPT_OUT
    } );

    this.launcherHeightProperty = new Property<number>( 0, {
      validValues: [ 0, PDLConstants.RAISED_LAUNCHER_HEIGHT ],
      tandem: Tandem.OPT_OUT
    } );

    this.launcherTypeProperty = new Property<number>( 1, {
      validValues: _.range( 1, 6 ),
      tandem: providedOptions.tandem.createTandem( 'launcherTypeProperty' ),
      phetioDocumentation: 'This property configures the active launcher by number.',
      phetioValueType: NumberIO
    } );

    this.binWidthProperty = new Property<number>( 1, {
      validValues: [ 1, 2, 5, 10 ],
      tandem: providedOptions.tandem.createTandem( 'binWidthProperty' ),
      phetioDocumentation: 'This property configures the bin width of the field and histogram.',
      phetioValueType: NumberIO
    } );
  }

  public reset(): void {
    this.launcherAngleProperty.reset();
    this.launcherHeightProperty.reset();
    this.launcherTypeProperty.reset();
    this.binWidthProperty.reset();
  }
}
projectileDataLab.register( 'PDLModel', PDLModel );