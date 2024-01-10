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
import Multilink from '../../../../axon/js/Multilink.js';
import PDLConstants from '../../common/PDLConstants.js';
import { MeanLaunchSpeedForMechanism, SDLaunchSpeedForMechanism } from '../../common-vsm/model/LauncherMechanism.js';
import { VSMFieldIdentifierValues } from '../../common-vsm/model/VSMFieldIdentifier.js';
import MeasuresField from './MeasuresField.js';
import IntervalTool from './IntervalTool.js';

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MeasuresModel extends VSMModel<MeasuresField> {

  public readonly landedDistanceAverageProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  public readonly landedDistanceStandardDeviationProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  public readonly isLauncherCustomProperty: DynamicProperty<boolean, boolean, VSMField>;

  // Static tool visibility
  public readonly isDataMeasuresVisibleProperty: BooleanProperty;
  public readonly isIntervalToolVisibleProperty: BooleanProperty;
  public readonly intervalTool: IntervalTool;

  public constructor( providedOptions: PDLModelOptions ) {

    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    const fields = VSMFieldIdentifierValues.map( identifier => {
      return new MeasuresField( identifier, {
        tandem: fieldsTandem.createTandem( identifier ),
        phetioFeatured: true
      } );
    } );

    super( fields, true, providedOptions );

    this.landedDistanceAverageProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.landedDistanceAverageProperty
    } );

    this.landedDistanceStandardDeviationProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.landedDistanceStandardDeviationProperty
    } );

    this.isLauncherCustomProperty = new DynamicProperty<boolean, boolean, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.isLauncherCustomProperty
    } );

    const visiblePropertiesTandem = providedOptions.tandem.createTandem( 'visibleProperties' );

    this.isIntervalToolVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isIntervalToolVisibleProperty' ),
      phetioFeatured: true
    } );

    this.isDataMeasuresVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isDataMeasuresVisibleProperty' ),
      phetioFeatured: true
    } );

    fields.forEach( field => {
      Multilink.multilink( [ this.isLauncherCustomProperty, this.customLauncherTypeProperty, this.angleStabilizerProperty ],
        ( isLauncherCustom, customLauncherType, angleStabilizer ) => {
          if ( isLauncherCustom ) {
            field.meanLaunchSpeedProperty.value = MeanLaunchSpeedForMechanism( customLauncherType );
            field.launchSpeedStandardDeviationProperty.value = SDLaunchSpeedForMechanism( customLauncherType );
            field.launchAngleStandardDeviationProperty.value = angleStabilizer;
          }
          else {
            // TODO: Does measures model need to know about the mystery launcher? - see https://github.com/phetsims/projectile-data-lab/issues/25
            // Set the launch angle standard deviation to the value for the mystery launcher.
            const launcherConfig = PDLConstants.LAUNCHER_CONFIGS[ this.mysteryLauncherProperty.value - 1 ];
            field.meanLaunchSpeedProperty.value = MeanLaunchSpeedForMechanism( launcherConfig.launcherMechanism );
            field.launchSpeedStandardDeviationProperty.value = SDLaunchSpeedForMechanism( launcherConfig.launcherMechanism );
            field.launchAngleStandardDeviationProperty.value = launcherConfig.angleStandardDeviation;
          }
        } );
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

  public override launchProjectile(): void {
    const field = this.fieldProperty.value;
    const isCustom = this.isLauncherCustomProperty.value;
    field.launchProjectile( isCustom ? 'custom' : 'mystery', isCustom ? field.customLauncherTypeProperty.value : null, isCustom ? field.angleStabilizerProperty.value : null );
  }

  public override reset(): void {
    super.reset();

    this.isDataMeasuresVisibleProperty.reset();
    this.isIntervalToolVisibleProperty.reset();

    this.intervalTool.reset();
  }
}

projectileDataLab.register( 'MeasuresModel', MeasuresModel );