// Copyright 2023, University of Colorado Boulder

/**
 * The PDLModel is the base class for all models in Projectile Data Lab (PDL).
 * It contains model elements for the launcher, field, tools, histograms and overlays.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import TModel from '../../../../joist/js/TModel.js';
import projectileDataLab from '../../projectileDataLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Field from './Field.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { LauncherConfiguration } from './LauncherConfiguration.js';
import { ProjectileType } from './ProjectileType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

type SelfOptions = {
  timeSpeedValues: TimeSpeed[];
  fields: Field[];
};
export type PDLModelOptions = SelfOptions & { tandem: Tandem };

export default class PDLModel implements TModel {

  // isContinuousLaunchProperty is true when the launcher is in continuous launch (rapid fire) mode.
  public readonly isContinuousLaunchProperty: Property<boolean>;

  // isHistogramShowingProperty is true when the accordion box containing the histogram is open.
  public readonly isHistogramShowingProperty: Property<boolean>;

  // Bin width represents the distance between adjacent field lines. It also affects how data is grouped for the histogram.
  public readonly binWidthProperty: Property<number>;

  // Whether the simulation is playing (animating via the step() function)
  public readonly isPlayingProperty: Property<boolean>;

  // The rate of animation when the simulation is playing
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  public readonly timeSpeedValues: TimeSpeed[];

  private readonly fields: Field[];

  public readonly fieldProperty: Property<Field>;
  public readonly launcherConfigurationProperty: DynamicProperty<LauncherConfiguration, LauncherConfiguration, Field>;
  public readonly projectileTypeProperty: DynamicProperty<ProjectileType, ProjectileType, Field>;

  // TODO: Don't use number, see https://github.com/phetsims/projectile-data-lab/issues/7
  public readonly launcherTypeProperty: DynamicProperty<number, number, Field>;

  public readonly launcherAngleProperty: DynamicProperty<number, number, Field>;
  public readonly launcherHeightProperty: DynamicProperty<number, number, Field>;

  public constructor( providedOptions: PDLModelOptions ) {

    this.isContinuousLaunchProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'isContinuousLaunchProperty' ),
      phetioDocumentation: 'This property indicates whether the launcher is in continuous launch (rapid fire) mode.',
      phetioValueType: BooleanIO
    } );

    this.isHistogramShowingProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'isHistogramShowingProperty' ),
      phetioDocumentation: 'This property indicates whether the histogram is showing.',
      phetioValueType: BooleanIO
    } );

    this.binWidthProperty = new Property<number>( 1, {
      validValues: [ 1, 2, 5, 10 ],
      tandem: providedOptions.tandem.createTandem( 'binWidthProperty' ),
      phetioDocumentation: 'This property configures the bin width of the field and histogram.',
      phetioValueType: NumberIO
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: 'This property indicates whether the simulation is playing. When false, the simulation is paused.'
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: providedOptions.timeSpeedValues,
      tandem: providedOptions.tandem.createTandem( 'timeSpeedProperty' ),
      phetioDocumentation: 'This property indicates the rate of animation when the simulation is playing.'
    } );

    this.timeSpeedValues = providedOptions.timeSpeedValues;

    this.fields = providedOptions.fields;

    this.fieldProperty = new Property( this.fields[ 0 ], {
      validValues: this.fields,
      tandem: providedOptions.tandem.createTandem( 'fieldProperty' ),
      phetioDocumentation: 'This property indicates the active field.',
      phetioValueType: ReferenceIO( Field.FieldIO )
    } );

    this.launcherConfigurationProperty = new DynamicProperty<LauncherConfiguration, LauncherConfiguration, Field>( this.fieldProperty, {
      bidirectional: true,
      derive: 'launcherConfigurationProperty'
    } );

    this.projectileTypeProperty = new DynamicProperty<ProjectileType, ProjectileType, Field>( this.fieldProperty, {
      bidirectional: true,
      derive: 'projectileTypeProperty'
    } );

    this.launcherTypeProperty = new DynamicProperty<number, number, Field>( this.fieldProperty, {
      bidirectional: true,
      derive: 'launcherTypeProperty'
    } );

    this.launcherAngleProperty = new DynamicProperty<number, number, Field>( this.fieldProperty, {
      bidirectional: true,
      derive: 'launcherAngleProperty'
    } );

    this.launcherHeightProperty = new DynamicProperty<number, number, Field>( this.fieldProperty, {
      bidirectional: true,
      derive: 'launcherHeightProperty'
    } );
  }

  public step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      this.fieldProperty.value.step( dt );
    }
  }

  public reset(): void {
    this.isContinuousLaunchProperty.reset();
    this.isHistogramShowingProperty.reset();
    this.binWidthProperty.reset();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();

    this.fields.forEach( field => field.reset() );
  }
}
projectileDataLab.register( 'PDLModel', PDLModel );