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
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';

type SelfOptions<T extends Field> = {
  timeSpeedValues: TimeSpeed[];
  fields: T[];
  isPathsVisible: boolean;
};
export type PDLModelOptions<T extends Field> = SelfOptions<T> & { tandem: Tandem };

export default abstract class PDLModel<T extends Field> implements TModel {

  // single launch vs continuous launch (rapid fire) mode.
  public readonly launchAmountProperty: Property<'single' | 'continuous'>;

  // isHistogramShowingProperty is true when the accordion box containing the histogram is open.
  public readonly isHistogramShowingProperty: Property<boolean>;

  // Bin width represents the distance between adjacent field lines. It also affects how data is grouped for the histogram.
  public readonly binWidthProperty: Property<number>;

  // Whether the simulation is playing (animating via the step() function)
  public readonly isPlayingProperty: Property<boolean>;

  // The rate of animation when the simulation is playing
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  public readonly timeSpeedValues: TimeSpeed[];

  public readonly fields: T[];

  public readonly fieldProperty: Property<T>;
  public readonly launcherConfigurationProperty: DynamicProperty<LauncherConfiguration, LauncherConfiguration, T>;
  public readonly projectileTypeProperty: DynamicProperty<ProjectileType, ProjectileType, T>;

  public readonly launcherAngleProperty: DynamicProperty<number, number, T>;
  public readonly launcherHeightProperty: DynamicProperty<number, number, T>;

  public readonly isPathsVisibleProperty: BooleanProperty;

  // In the VSM screens, the field can be chosen, then the launcher can be chosen independently within that field.
  // In the Sampling screen, choosing a launcher + number of samples combination determines the field uniquely.
  public abstract launcherTypeProperty: TProperty<number>;
  public abstract selectedSampleProperty: TReadOnlyProperty<number>;

  public readonly isContinuousLaunchingProperty: Property<boolean>;

  protected constructor( providedOptions: PDLModelOptions<T> ) {

    this.launchAmountProperty = new Property<'single' | 'continuous'>( 'single', {
      validValues: [ 'single', 'continuous' ],
      tandem: providedOptions.tandem.createTandem( 'launchAmountProperty' ),
      phetioDocumentation: 'This property indicates whether the launcher is in continuous launch (rapid fire) mode.',
      phetioValueType: StringUnionIO( [ 'single', 'continuous' ] as const )
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
      phetioValueType: ReferenceIO( Field.FieldIO ),
      reentrant: true
    } );

    this.launcherConfigurationProperty = new DynamicProperty<LauncherConfiguration, LauncherConfiguration, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.launcherConfigurationProperty
    } );

    this.projectileTypeProperty = new DynamicProperty<ProjectileType, ProjectileType, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.projectileTypeProperty
    } );

    this.launcherAngleProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.launchAngleAverageProperty
    } );

    this.launcherHeightProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.launchHeightProperty
    } );

    this.isPathsVisibleProperty = new BooleanProperty( providedOptions.isPathsVisible, {
      tandem: providedOptions.tandem.createTandem( 'isPathsVisibleProperty' )
    } );

    this.isContinuousLaunchingProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isContinuousLaunchingProperty' )
    } );

    this.launchAmountProperty.link( launchAmount => {
      if ( launchAmount === 'single' ) {
        this.isContinuousLaunchingProperty.value = false;
      }
    } );
  }

  public launchButtonPressed(): void {
    if ( this.launchAmountProperty.value === 'single' ) {
      this.fieldProperty.value.launchButtonPressed();
    }
    else {
      if ( !this.isContinuousLaunchingProperty.value ) {
        this.fieldProperty.value.launchButtonPressed();
      }
      this.isContinuousLaunchingProperty.value = !this.isContinuousLaunchingProperty.value;
    }
  }

  public reset(): void {
    this.isContinuousLaunchingProperty.reset();
    this.launchAmountProperty.reset();
    this.isHistogramShowingProperty.reset();
    this.binWidthProperty.reset();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();

    this.fields.forEach( field => field.reset() );
    this.fieldProperty.reset();

    this.isPathsVisibleProperty.reset();
  }

  public clearCurrentField(): void {
    this.fieldProperty.value.clearProjectiles();
  }
}
projectileDataLab.register( 'PDLModel', PDLModel );