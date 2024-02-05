// Copyright 2023-2024, University of Colorado Boulder

/**
 * The Measures Model for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { VSMFieldIdentifierValues } from '../../common-vsm/model/VSMFieldIdentifier.js';
import MeasuresField from './MeasuresField.js';
import IntervalTool from './IntervalTool.js';
import Launcher, { MYSTERY_LAUNCHERS } from '../../common/model/Launcher.js';
import PDLConstants from '../../common/PDLConstants.js';
import { MysteryOrCustom } from '../../common/model/MysteryOrCustom.js';
import { SPRING } from '../../common-vsm/model/LauncherMechanism.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import SMModel, { SMModelOptions } from '../../common-sm/model/SMModel.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;

type Parent = WithRequired<SMModelOptions, 'tandem'>;
type MeasuresModelOptions = SelfOptions & StrictOmit<Parent, 'isStandardDeviationAnglePropertyPhetioInstrumented'>;

export default class MeasuresModel extends SMModel<MeasuresField> {

  // The mean distance of the landed projectiles
  public readonly meanDistanceProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  // The standard deviation of the distance of the landed projectiles
  public readonly standardDeviationDistanceProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  // The standard error of the mean distance of landed projectiles
  public readonly standardErrorDistanceProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  // Whether the launcher is custom or mystery
  public readonly mysteryOrCustomProperty: DynamicProperty<MysteryOrCustom, MysteryOrCustom, MeasuresField>;

  // Whether the mean is visible on the field and histogram
  public readonly isMeanVisibleProperty: BooleanProperty;

  // Whether the standard deviation is visible on the field and histogram
  public readonly isStandardDeviationVisibleProperty: BooleanProperty;

  // Whether the values are visible on the field and histogram
  public readonly isValuesVisibleProperty: BooleanProperty;

  // Whether the interval tool is visible on the field and histogram
  public readonly isIntervalToolVisibleProperty: BooleanProperty;

  // The interval tool
  public readonly intervalTool: IntervalTool;

  public readonly mysteryLauncherProperty: DynamicProperty<Launcher, Launcher, MeasuresField>;

  public constructor( providedOptions: MeasuresModelOptions ) {

    const options = optionize<MeasuresModelOptions, SelfOptions, SMModelOptions>()( {
      isStandardDeviationAnglePropertyPhetioInstrumented: true
    }, providedOptions );

    const fieldsTandem = options.tandem.createTandem( 'fields' );
    const fields = VSMFieldIdentifierValues.map( ( identifier, index ) => {
      const fieldTandem = fieldsTandem.createTandem( identifier );

      const lastMysteryLauncherNumber = MYSTERY_LAUNCHERS[ MYSTERY_LAUNCHERS.length - 1 ].launcherNumber;

      const customLauncher = new Launcher(
        'custom',
        SPRING,
        PDLConstants.CUSTOM_LAUNCHER_DEFAULT_STANDARD_DEVIATION_ANGLE,
        lastMysteryLauncherNumber + 1, {
          tandem: fieldTandem.createTandem( 'customLauncher' ),
          phetioFeatured: true
        } );

      return new MeasuresField( [ ...MYSTERY_LAUNCHERS, customLauncher ], identifier, {
        tandem: fieldsTandem.createTandem( identifier ),
        phetioFeatured: true
      } );
    } );

    super( fields, options );

    this.mysteryOrCustomProperty = new DynamicProperty<MysteryOrCustom, MysteryOrCustom, MeasuresField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.mysteryOrCustomProperty
    } );

    this.mysteryLauncherProperty = new DynamicProperty<Launcher, Launcher, MeasuresField>( this.fieldProperty, {
      bidirectional: true,
      derive: field => field.mysteryLauncherProperty
    } );

    this.meanDistanceProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.meanDistanceProperty,
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'meanDistanceProperty' ),
      phetioDocumentation: 'The mean distance of the landed projectiles, or null if no projectiles have landed.',
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioState: false
    } );

    this.standardDeviationDistanceProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.standardDeviationDistanceProperty,
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'standardDeviationDistanceProperty' ),
      phetioDocumentation: 'The standard deviation of the distance of the landed projectiles, or null if no projectiles have landed.',
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioState: false
    } );

    this.standardErrorDistanceProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.standardErrorDistanceProperty,
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'standardErrorDistanceProperty' ),
      phetioDocumentation: 'The standard error of the mean distance of landed projectiles, or null if no projectiles have landed.',
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true,
      phetioState: false
    } );

    const visiblePropertiesTandem = options.tandem.createTandem( 'visibleProperties' );

    this.isIntervalToolVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isIntervalToolVisibleProperty' ),
      phetioFeatured: true
    } );

    this.isMeanVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isMeanVisibleProperty' ),
      phetioFeatured: true
    } );

    this.isStandardDeviationVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isStandardDeviationVisibleProperty' ),
      phetioFeatured: true
    } );

    this.isValuesVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isValuesVisibleProperty' ),
      phetioFeatured: true
    } );

    this.intervalTool = new IntervalTool( {
      tandem: options.tandem.createTandem( 'intervalTool' )
    } );

    // Compute the percent of data within the interval tool, only considering the landedProjectiles.
    const updateIntervalToolDataPercentage = () => {
      const min = Math.min( this.intervalTool.edge1, this.intervalTool.edge2 );
      const max = Math.max( this.intervalTool.edge1, this.intervalTool.edge2 );
      const field = this.fieldProperty.value;
      const count = field.landedProjectiles.filter( projectile => {
        return projectile.x >= min && projectile.x <= max;
      } ).length;
      this.intervalTool.dataFractionProperty.value = field.landedProjectiles.length === 0 ? 0 : count / field.landedProjectiles.length;
    };

    updateIntervalToolDataPercentage();

    this.fields.forEach( field => {
      field.projectileLandedEmitter.addListener( updateIntervalToolDataPercentage );
      field.projectilesClearedEmitter.addListener( updateIntervalToolDataPercentage );
    } );
    this.fieldProperty.link( field => updateIntervalToolDataPercentage() );
    this.intervalTool.changedEmitter.addListener( updateIntervalToolDataPercentage );
  }

  public override reset(): void {
    super.reset();

    this.isMeanVisibleProperty.reset();
    this.isStandardDeviationVisibleProperty.reset();
    this.isValuesVisibleProperty.reset();
    this.isIntervalToolVisibleProperty.reset();

    this.intervalTool.reset();
  }
}

projectileDataLab.register( 'MeasuresModel', MeasuresModel );