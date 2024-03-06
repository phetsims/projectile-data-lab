// Copyright 2024, University of Colorado Boulder

//REVIEW This doc looks seems sort of incorrect, looks like it was copied from LauncherNode and sort of changed.
/**
 * The LauncherIconNode is the visual representation of the projectile launcher used in the UI of Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Shape } from '../../../../kite/js/imports.js';
import { LauncherConfiguration, MEAN_LAUNCH_ANGLES } from '../model/LauncherConfiguration.js';
import { MysteryOrCustom, MysteryOrCustomValues } from '../model/MysteryOrCustom.js';
import Launcher, { MYSTERY_LAUNCHERS } from '../model/Launcher.js';
import LauncherMechanism, { SPRING } from '../../common-vsm/model/LauncherMechanism.js';
import CustomLauncherNode from '../../common-vsm/view/CustomLauncherNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PDLConstants from '../PDLConstants.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

type SelfOptions = EmptySelfOptions;
type LauncherIconNodeOptions = SelfOptions & NodeOptions;

export default class LauncherIconNode extends Node {

  // Create adapters that will reflect the values for the selected launcher.
  private launcherConfigurationProperty = new Property<LauncherConfiguration>( 'angle30' );
  private launchAngleProperty = new NumberProperty( 30 );
  private launchHeightProperty = new NumberProperty( 0 );
  private mysteryOrCustomProperty = new StringUnionProperty<MysteryOrCustom>( 'mystery', {
    validValues: MysteryOrCustomValues
  } );
  private mysteryLauncherProperty = new Property( MYSTERY_LAUNCHERS[ 0 ] );
  private launcherMechanismProperty = new Property<LauncherMechanism>( SPRING );
  private standardDeviationAngleProperty = new Property( 0 );
  private latestLaunchSpeedProperty = new Property( 0 );

  public constructor( providedOptions?: LauncherIconNodeOptions ) {

    super( providedOptions );

    const launcherNode = new CustomLauncherNode(
      ModelViewTransform2.createIdentity(),
      this.launcherConfigurationProperty,
      this.launchAngleProperty,
      this.launchHeightProperty,
      this.mysteryOrCustomProperty,
      this.mysteryLauncherProperty,
      this.launcherMechanismProperty,
      this.standardDeviationAngleProperty,
      this.latestLaunchSpeedProperty,
      null, {
        scale: 0.2
      } );

    this.addChild( launcherNode );
  }

  public updateIcon( launcherConfiguration: LauncherConfiguration,
                     mysteryOrCustom: MysteryOrCustom,
                     mysteryLauncher: Launcher,
                     launcherMechanism: LauncherMechanism,
                     standardDeviationAngle: number ): void {

    this.launcherConfigurationProperty.value = launcherConfiguration;
    this.launchAngleProperty.value = MEAN_LAUNCH_ANGLES[ launcherConfiguration ];
    this.launchHeightProperty.value = launcherConfiguration === 'angle0Raised' ? PDLConstants.RAISED_LAUNCHER_HEIGHT : 0;
    this.mysteryOrCustomProperty.value = mysteryOrCustom;

    if ( mysteryOrCustom === 'mystery' ) {
      this.mysteryLauncherProperty.value = mysteryLauncher;
    }
    else {
      this.launcherMechanismProperty.value = launcherMechanism;
      this.standardDeviationAngleProperty.value = standardDeviationAngle;
    }

    // Clear the clip area, so we can get an unclipped measurement of the localBounds.height
    this.clipArea = null;

    const height = this.localBounds.height * ( launcherConfiguration === 'angle0Raised' ? 0.6 : 0.5 );

    // The launcher has a long pedestal that gets clipped off.
    this.clipArea = Shape.rect(
      this.localBounds.minX,
      this.localBounds.minY,
      this.localBounds.width,
      height
    );
  }
}

projectileDataLab.register( 'LauncherIconNode', LauncherIconNode );