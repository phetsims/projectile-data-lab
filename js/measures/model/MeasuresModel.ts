// Copyright 2023-2024, University of Colorado Boulder

/**
 * The Measures Model for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMModel from '../../common-vsm/model/VSMModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import { VSMFieldIdentifierValues } from '../../common-vsm/model/VSMFieldIdentifier.js';
import MeasuresField from './MeasuresField.js';
import IntervalTool from './IntervalTool.js';
import Launcher, { MYSTERY_LAUNCHERS } from '../../common/model/Launcher.js';
import PDLConstants from '../../common/PDLConstants.js';
import { MysteryOrCustom } from '../../common/model/MysteryOrCustom.js';
import { SPRING } from '../../common-vsm/model/LauncherMechanism.js';

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MeasuresModel extends VSMModel<MeasuresField> {

  // The mean distance of the landed projectiles
  public readonly meanDistanceProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  // The standard deviation of the distance of the landed projectiles
  public readonly standardDeviationDistanceProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  // The standard error of the mean distance of landed projectiles
  public readonly standardErrorDistanceProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  // Whether the launcher is custom or mystery
  public readonly mysteryOrCustomProperty: DynamicProperty<MysteryOrCustom, MysteryOrCustom, VSMField>;

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

  public constructor( providedOptions: PDLModelOptions ) {

    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    const fields = VSMFieldIdentifierValues.map( ( identifier, index ) => {
      const fieldTandem = fieldsTandem.createTandem( identifier );

      const lastMysteryLauncherNumber = MYSTERY_LAUNCHERS[ MYSTERY_LAUNCHERS.length - 1 ].launcherNumber;

      const customLauncher = new Launcher(
        'custom',
        SPRING,
        PDLConstants.CUSTOM_LAUNCHER_DEFAULT_STANDARD_DEVIATION_ANGLE,
        lastMysteryLauncherNumber + 1, {
          tandem: fieldTandem.createTandem( `customLauncher${index + 1}` )
        } );

      return new MeasuresField( [ ...MYSTERY_LAUNCHERS, customLauncher ], identifier, {
        tandem: fieldsTandem.createTandem( identifier ),
        phetioFeatured: true
      } );
    } );

    super( fields, true, providedOptions );

    this.meanDistanceProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.meanDistanceProperty
    } );

    this.standardDeviationDistanceProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.standardDeviationDistanceProperty
    } );

    this.standardErrorDistanceProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.standardErrorDistanceProperty
    } );

    this.mysteryOrCustomProperty = new DynamicProperty<MysteryOrCustom, MysteryOrCustom, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.mysteryOrCustomProperty
    } );

    const visiblePropertiesTandem = providedOptions.tandem.createTandem( 'visibleProperties' );

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
      tandem: providedOptions.tandem.createTandem( 'intervalTool' )
    } );

    // Compute the percent of data within the interval tool, only considering the landedProjectiles.
    const updateIntervalToolDataPercentage = () => {
      const min = Math.min( this.intervalTool.edge1, this.intervalTool.edge2 );
      const max = Math.max( this.intervalTool.edge1, this.intervalTool.edge2 );
      const field = this.fieldProperty.value;
      const count = field.landedProjectiles.filter( projectile => {
        return projectile.x >= min && projectile.x <= max;
      } ).length;
      this.intervalTool.dataFractionProperty.value = field.landedProjectiles.length === 0 ? null : count / field.landedProjectiles.length;
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