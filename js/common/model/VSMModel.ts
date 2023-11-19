// Copyright 2023, University of Colorado Boulder

/**
 * The VSMModel is the base class for the Variability, Sources, and Measurement models.
 * // REVIEW: A better name would be nice.
 */
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabModel, { ProjectileDataLabModelOptions } from './ProjectileDataLabModel.js';
import Property from '../../../../axon/js/Property.js';
import { LauncherConfiguration, LauncherConfigurationValues } from './LauncherConfiguration.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { ProjectileType, ProjectileTypeValues } from './ProjectileType.js';
import ProjectileDataLabConstants from '../ProjectileDataLabConstants.js';

type SelfOptions = EmptySelfOptions;
export type VSMModelOptions = SelfOptions & ProjectileDataLabModelOptions;

export default class VSMModel extends ProjectileDataLabModel {
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

    this.launcherConfigurationProperty.link( launcherAngle => {
      let angle = 0;
      let height = 0;
      switch( launcherAngle ) {
        case 'ANGLE_45':
          angle = 45;
          break;
        case 'ANGLE_60':
          angle = 60;
          break;
        case 'ANGLE_30':
          angle = 30;
          break;
        case 'ANGLE_0':
          height = ProjectileDataLabConstants.RAISED_LAUNCHER_HEIGHT;
          break;
        default:
          break;
      }

      this.launcherAngleProperty.value = angle;
      this.launcherHeightProperty.value = height;
    } );
  }

  public override reset(): void {
    this.launcherConfigurationProperty.reset();
    this.projectileTypeProperty.reset();
  }
}
projectileDataLab.register( 'VSMModel', VSMModel );