// Copyright 2023, University of Colorado Boulder

/**
 * The VSMModel is the base class for the Variability, Sources, and Measurement (VSM) models.
 */
import projectileDataLab from '../../projectileDataLab.js';
import PDLModel, { ProjectileDataLabModelOptions } from './PDLModel.js';
import Property from '../../../../axon/js/Property.js';
import { LauncherConfiguration, LauncherConfigurationValues } from './LauncherConfiguration.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { ProjectileType, ProjectileTypeValues } from './ProjectileType.js';
import PDLConstants from '../PDLConstants.js';

type SelfOptions = EmptySelfOptions;
export type VSMModelOptions = SelfOptions & ProjectileDataLabModelOptions;

export default class VSMModel extends PDLModel {
  public readonly launcherConfigurationProperty: Property<LauncherConfiguration>;
  public readonly projectileTypeProperty: Property<ProjectileType>;

  public constructor( providedOptions: VSMModelOptions ) {
    super( providedOptions );

    this.launcherConfigurationProperty = new Property<LauncherConfiguration>( 'ANGLE_30', {
      validValues: LauncherConfigurationValues,
      tandem: providedOptions.tandem.createTandem( 'launcherConfigurationProperty' ),
      phetioDocumentation: 'This property configures the angle and height of the cannon. When set to ANGLE_0, the cannon is raised.',
      phetioValueType: StringUnionIO( LauncherConfigurationValues )
    } );

    this.projectileTypeProperty = new Property<ProjectileType>( 'CANNONBALL', {
      validValues: ProjectileTypeValues,
      tandem: providedOptions.tandem.createTandem( 'projectileTypeProperty' ),
      phetioDocumentation: 'This property configures the type of projectile.',
      phetioValueType: StringUnionIO( ProjectileTypeValues )
    } );

    this.launcherConfigurationProperty.link( configuration => {

      // REVIEW: Should these be DerivedProperties?
      this.launcherAngleProperty.value = this.angleForConfiguration( configuration );
      this.launcherHeightProperty.value = configuration === 'ANGLE_0' ? PDLConstants.RAISED_LAUNCHER_HEIGHT : 0;
    } );
  }

  private angleForConfiguration( configuration: LauncherConfiguration ): number {
    switch( configuration ) {
      case 'ANGLE_45':
        return 45;
      case 'ANGLE_60':
        return 60;
      case 'ANGLE_30':
        return 30;
      default:
        return 0;
    }
  }

  public override reset(): void {
    super.reset();
    this.launcherConfigurationProperty.reset();
    this.projectileTypeProperty.reset();
  }
}
projectileDataLab.register( 'VSMModel', VSMModel );