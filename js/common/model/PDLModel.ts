// Copyright 2023-2024, University of Colorado Boulder

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
import { LauncherConfiguration, LauncherConfigurationValues } from './LauncherConfiguration.js';
import { ProjectileType, ProjectileTypeValues } from './ProjectileType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { SingleOrContinuous, SingleOrContinuousValues } from './SingleOrContinuous.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { BIN_STRATEGY_PROPERTY } from '../PDLQueryParameters.js';
import PDLConstants from '../PDLConstants.js';
import { HistogramRepresentation, HistogramRepresentationValues } from './HistogramRepresentation.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import Launcher from './Launcher.js';

type SelfOptions<T extends Field> = {
  timeSpeedValues: TimeSpeed[];
  fields: T[];
  isPathsVisible: boolean;
  isPathVisibilityPhetioInstrumented: boolean;
  isFieldPropertyPhetioReadonly: boolean;
  fieldPropertyPhetioDocumentation: string;
};
export type PDLModelOptions<T extends Field> = SelfOptions<T> & { tandem: Tandem };

export default abstract class PDLModel<T extends Field> implements TModel {

  // Bin width represents the distance between adjacent field lines. It also affects how data is grouped for the histogram.
  // The prefix 'selected' means it is the value selected by the user, and may differ from the displayed bin width
  // depending on the BIN_STRATEGY_PROPERTY.
  public readonly selectedBinWidthProperty: Property<number>;

  // Total bins represents the number of bins in the histogram.
  // The prefix 'selected' means it is the value selected by the user, and may differ from the displayed bin width
  // depending on the BIN_STRATEGY_PROPERTY.
  public readonly selectedTotalBinsProperty: Property<number>;

  // Current bin width, selecting from the two strategies: binWidth or totalBins (see above)
  public readonly binWidthProperty: TReadOnlyProperty<number>;

  public readonly histogramRepresentationProperty: Property<HistogramRepresentation>;

  // Whether the simulation is playing (animating via the step() function)
  public readonly isPlayingProperty: Property<boolean>;

  // The rate of animation when the simulation is playing
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  public readonly timeSpeedValues: TimeSpeed[];

  public readonly fields: T[];

  public readonly fieldProperty: Property<T>;

  // single launch vs continuous launch (rapid fire) mode.
  public readonly singleOrContinuousProperty: Property<SingleOrContinuous>;

  public readonly launcherConfigurationProperty: DynamicProperty<LauncherConfiguration, LauncherConfiguration, T>;

  public readonly projectileTypeProperty: DynamicProperty<ProjectileType, ProjectileType, T>;

  public readonly meanLaunchAngleProperty: DynamicProperty<number, number, T>;

  public readonly launcherHeightProperty: DynamicProperty<number, number, T>;

  public readonly isContinuousLaunchingProperty: DynamicProperty<boolean, boolean, T>;

  public readonly isPathsVisibleProperty: BooleanProperty;

  public readonly abstract launcherProperty: TReadOnlyProperty<Launcher>;

  protected constructor( providedOptions: PDLModelOptions<T> ) {

    const visiblePropertiesTandem = providedOptions.tandem.createTandem( 'visibleProperties' );

    const histogramTandem = providedOptions.tandem.createTandem( 'histogram' );

    this.selectedBinWidthProperty = new Property<number>( 1, {
      validValues: [ 0.5, 1, 2, 5, 10 ],
      tandem: histogramTandem.createTandem( 'selectedBinWidthProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the bin width of the field and histogram. It is used when the bin strategy is "bin width".',
      phetioValueType: NumberIO
    } );

    this.selectedTotalBinsProperty = new Property<number>( 10, {
      validValues: [ 10, 20, 50, 100, 200 ],
      tandem: histogramTandem.createTandem( 'selectedTotalBinsProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the total number of bins in the histogram. It is used when the bin strategy is "total bins".',
      phetioValueType: NumberIO
    } );

    this.binWidthProperty = new DerivedProperty( [ BIN_STRATEGY_PROPERTY, this.selectedBinWidthProperty, this.selectedTotalBinsProperty ],
      ( binStrategy, selectedBinWidth, totalBins ) => {
        return binStrategy === 'binWidth' ? selectedBinWidth : PDLConstants.MAX_FIELD_DISTANCE / totalBins;
      } );

    this.histogramRepresentationProperty = new StringUnionProperty<HistogramRepresentation>( 'blocks', {
      validValues: HistogramRepresentationValues,
      tandem: histogramTandem.createTandem( 'representationProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property indicates whether the histogram is showing bars (one per bin) or blocks (one per projectile).'
    } );

    const timeControlTandem = providedOptions.tandem.createTandem( 'timeControl' );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: timeControlTandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property indicates whether the simulation is playing. When false, the simulation is paused.'
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: providedOptions.timeSpeedValues,
      tandem: timeControlTandem.createTandem( 'timeSpeedProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property indicates the rate of animation when the simulation is playing.'
    } );

    this.timeSpeedValues = providedOptions.timeSpeedValues;

    this.fields = providedOptions.fields;

    this.fieldProperty = new Property( this.fields[ 0 ], {
      validValues: this.fields,
      tandem: providedOptions.tandem.createTandem( 'fieldProperty' ),
      phetioFeatured: true,
      phetioDocumentation: providedOptions.fieldPropertyPhetioDocumentation,
      phetioValueType: ReferenceIO( Field.FieldIO ),
      phetioReadOnly: providedOptions.isFieldPropertyPhetioReadonly
    } );

    this.singleOrContinuousProperty = new Property<SingleOrContinuous>( 'single', {
      validValues: SingleOrContinuousValues,
      tandem: providedOptions.tandem.createTandem( 'singleOrContinuousProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property indicates whether the launcher is in single or continuous launch mode.',
      phetioValueType: StringUnionIO( SingleOrContinuousValues )
    } );

    this.launcherConfigurationProperty = new DynamicProperty<LauncherConfiguration, LauncherConfiguration, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.launcherConfigurationProperty,

      // The DynamicProperty is instrumented if and only if the field launcherConfigurationProperty is instrumented.
      tandem: this.fieldProperty.value.launcherConfigurationProperty.isPhetioInstrumented() ? providedOptions.tandem.createTandem( 'launcherConfigurationProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'This property indicates the current launcher configuration.',
      phetioValueType: StringUnionIO( LauncherConfigurationValues ),
      phetioReadOnly: true,
      phetioState: false,

      // Take whatever valid values were specified for the field launcherConfigurationProperty. In the sampling screen,
      // it is constrained to angle45
      validValues: this.fieldProperty.value.launcherConfigurationProperty.validValues
    } );

    this.projectileTypeProperty = new DynamicProperty<ProjectileType, ProjectileType, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.projectileTypeProperty,

      // The DynamicProperty is instrumented if and only if the field projectileTypeProperty is instrumented.
      tandem: this.fieldProperty.value.projectileTypeProperty.isPhetioInstrumented() ? providedOptions.tandem.createTandem( 'projectileTypeProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'This property indicates the type of projectile being launched.',
      phetioValueType: StringUnionIO( ProjectileTypeValues ),
      phetioReadOnly: true,
      phetioState: false,

      // Take whatever valid values were specified for the field projectileTypeProperty. In the sampling screen,
      // it is constrained to a cannonball
      validValues: this.fieldProperty.value.projectileTypeProperty.validValues
    } );

    this.meanLaunchAngleProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.meanAngleProperty
    } );

    this.launcherHeightProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.launchHeightProperty
    } );

    this.isContinuousLaunchingProperty = new DynamicProperty<boolean, boolean, T>( this.fieldProperty, {
      bidirectional: true, // So that launching the last projectile can automatically pause continuous mode in the selected field.
      derive: t => t.isContinuousLaunchingProperty
    } );

    this.isPathsVisibleProperty = new BooleanProperty( providedOptions.isPathsVisible, {
      tandem: providedOptions.isPathVisibilityPhetioInstrumented ? visiblePropertiesTandem.createTandem( 'isPathsVisibleProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.singleOrContinuousProperty.link( singleOrContinuous => {
      if ( singleOrContinuous === 'single' ) {
        this.fieldProperty.value.isContinuousLaunchingProperty.value = false;
      }
    } );
  }

  public abstract launchButtonPressed(): void;

  public reset(): void {
    this.singleOrContinuousProperty.reset();
    this.selectedBinWidthProperty.reset();
    this.selectedTotalBinsProperty.reset();
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