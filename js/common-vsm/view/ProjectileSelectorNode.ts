// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { HBox, Image, Node, VBox } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Projectile from '../../common/model/Projectile.js';
import pianoHighlighted_png from '../../../images/pianoHighlighted_png.js';
import cannonball_png from '../../../images/cannonball_png.js';
import pumpkin1Highlighted_png from '../../../images/pumpkin1Highlighted_png.js';
import pumpkin2Highlighted_png from '../../../images/pumpkin2Highlighted_png.js';
import pumpkin3Highlighted_png from '../../../images/pumpkin3Highlighted_png.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Range from '../../../../dot/js/Range.js';
import SelectorNode, { SelectorNodeOptions } from '../../common/view/SelectorNode.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PDLConstants from '../../common/PDLConstants.js';
import PDLText from '../../common/view/PDLText.js';
import TProperty from '../../../../axon/js/TProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import CustomizableLauncherNode from './CustomizableLauncherNode.js';
import { LauncherConfiguration, MEAN_LAUNCH_ANGLES } from '../../common/model/LauncherConfiguration.js';
import LauncherMechanism, { SPRING } from '../model/LauncherMechanism.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import { MysteryOrCustom } from '../../common/model/MysteryOrCustom.js';
import { MYSTERY_LAUNCHERS } from '../../common/model/Launcher.js';

const PUMPKIN_LANDED_IMAGES = [ pumpkin1Highlighted_png, pumpkin2Highlighted_png, pumpkin3Highlighted_png ];

/**
 * Panel that allows the user to select a projectile. This appears in all VSM screens. The selected projectile is displayed
 * in the panel  and highlighted in the play area. The ProjectileSelectorPanel is analogous to the
 * SampleSelectorNode that appears on the Sampling screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
type SelfOptions = EmptySelfOptions;
type ProjectileSelectorPanelOptions = SelfOptions & SelectorNodeOptions;

export default class ProjectileSelectorNode extends SelectorNode {

  public constructor(
    selectedProjectileNumberProperty: TProperty<number> & PhetioObject,
    totalProjectileCountProperty: TReadOnlyProperty<number>,
    landedProjectileCountProperty: TReadOnlyProperty<number>,
    selectedProjectileProperty: TReadOnlyProperty<Projectile | null>,
    providedOptions: ProjectileSelectorPanelOptions ) {

    const options = optionize<ProjectileSelectorPanelOptions, SelfOptions, PDLPanelOptions>()( {}, providedOptions );

    // Create adapters for that will reflect the values for the selected projectile.
    const launchAngleProperty = new NumberProperty( 30 );
    const launchHeightProperty = new NumberProperty( 0 );
    const launcherConfigurationProperty = new Property<LauncherConfiguration>( 'angle30' );
    const mysteryOrCustomProperty = new Property<MysteryOrCustom>( 'mystery' );
    const mysteryLauncherProperty = new Property( MYSTERY_LAUNCHERS[ 0 ] );
    const launcherMechanismProperty = new Property<LauncherMechanism>( SPRING );
    const standardDeviationAngleProperty = new Property( 0 );
    const latestLaunchSpeedProperty = new Property( 0 );

    const rangeProperty = new DerivedProperty( [ selectedProjectileNumberProperty, landedProjectileCountProperty, totalProjectileCountProperty, selectedProjectileProperty ],
      ( ( selectedProjectileNumber, landedProjectileCount, totalProjectileCount ) => {

        // Projectiles are added to the data set when they land
        if ( landedProjectileCount === 0 ) {
          return new Range( 0, 0 );
        }
        else if ( totalProjectileCount > landedProjectileCount ) {

          // If some are airborne, then disable the buttons, freezing at the currently selected value
          return new Range( selectedProjectileNumber, selectedProjectileNumber );
        }
        else {

          // Everything is landed, everything can be selected
          return new Range( 1, landedProjectileCount );
        }
      } ) );

    const customLauncherNode = new CustomizableLauncherNode(
      ModelViewTransform2.createIdentity(),
      launcherConfigurationProperty,
      launchAngleProperty,
      launchHeightProperty,
      mysteryOrCustomProperty,
      mysteryLauncherProperty,
      launcherMechanismProperty,
      standardDeviationAngleProperty,
      latestLaunchSpeedProperty,
      null, {
        scale: 0.2,
        visibleProperty: new DerivedProperty( [ selectedProjectileProperty ], projectile => projectile !== null )
      } );

    type Depiction = {
      type: ProjectileType;
      isFlippedHorizontally: boolean;
      landedImageIndex?: number;
    };

    const depictions: Depiction[] = [
      { type: 'cannonball', isFlippedHorizontally: false },
      { type: 'cannonball', isFlippedHorizontally: true },
      { type: 'piano', isFlippedHorizontally: false },
      { type: 'piano', isFlippedHorizontally: true },
      { type: 'pumpkin', isFlippedHorizontally: false, landedImageIndex: 0 },
      { type: 'pumpkin', isFlippedHorizontally: true, landedImageIndex: 0 },
      { type: 'pumpkin', isFlippedHorizontally: false, landedImageIndex: 1 },
      { type: 'pumpkin', isFlippedHorizontally: true, landedImageIndex: 1 },
      { type: 'pumpkin', isFlippedHorizontally: false, landedImageIndex: 2 },
      { type: 'pumpkin', isFlippedHorizontally: true, landedImageIndex: 2 }
    ];

    const depictionProperty = new Property<Depiction>( depictions[ 0 ] );

    const createNode = ( depiction: Depiction ) => {
      const imagePNG = depiction.type === 'pumpkin' ? PUMPKIN_LANDED_IMAGES[ depiction.landedImageIndex! ] :
                       depiction.type === 'piano' ? pianoHighlighted_png :
                       cannonball_png;

      const imageScale = depiction.type === 'pumpkin' ? 0.18 : depiction.type === 'piano' ? 0.14 : 0.2;

      return new Node( {
        children: [ new Image( imagePNG, { scale: imageScale } ) ],
        matrix: Matrix3.scale( depiction.isFlippedHorizontally ? -1 : 1, 1 )
      } );
    };

    const projectileToggleNode = new ToggleNode( depictionProperty, depictions.map( depiction => ( {
        createNode: tandem => createNode( depiction ),
        value: depiction
      } ) )
    );

    Multilink.multilink( [ selectedProjectileNumberProperty, landedProjectileCountProperty, selectedProjectileProperty ], ( projectileNumber, landedProjectileCount, selectedProjectile ) => {

        if ( selectedProjectile ) {

          // Use a reference lookup because it is what ToggleNode supports for equality checking
          const lookup = depictions.find( depiction => {

            if ( depiction.type === 'cannonball' || depiction.type === 'piano' ) {
              return depiction.type === selectedProjectile.type &&
                     depiction.isFlippedHorizontally === selectedProjectile.isFlippedHorizontally;
            }
            else {
              return depiction.type === selectedProjectile.type &&
                     depiction.isFlippedHorizontally === selectedProjectile.isFlippedHorizontally &&
                     depiction.landedImageIndex !== selectedProjectile.landedImageIndex;
            }
          } );

          depictionProperty.value = lookup!;

          // Update the adapters for the selected projectile that will determine how to show the launcher icon.
          launchAngleProperty.value = MEAN_LAUNCH_ANGLES[ selectedProjectile.launcherConfiguration ];
          launchHeightProperty.value = selectedProjectile.launchHeight;
          launcherConfigurationProperty.value = selectedProjectile.launcherConfiguration;
          mysteryOrCustomProperty.value = selectedProjectile.launcher.mysteryOrCustom;
          standardDeviationAngleProperty.value = selectedProjectile.launcherStandardDeviationAngle;
          launcherMechanismProperty.value = selectedProjectile.launcherMechanism;
          // Updating the latestLaunchSpeedProperty causes a failure in CustomizableLauncherNode, and is not needed, see https://github.com/phetsims/projectile-data-lab/issues/67

          if ( selectedProjectile.launcher.mysteryOrCustom === 'mystery' ) {
            mysteryLauncherProperty.value = selectedProjectile.launcher;
          }

          // Clear the clip area, so we can get an unclipped measurement of the localBounds.height
          customLauncherNode.clipArea = null;

          const height = customLauncherNode.localBounds.height * ( selectedProjectile.launcherConfiguration === 'angle0Raised' ? 0.6 : 0.5 );

          // The launcher has a long pedestal that gets clipped off.
          customLauncherNode.clipArea = Shape.rect(
            customLauncherNode.localBounds.minX,
            customLauncherNode.localBounds.minY,
            customLauncherNode.localBounds.width,
            height
          );

          projectileToggleNode.visible = true;
        }
        else {
          projectileToggleNode.visible = false;
        }
      }
    );

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.numberOfCountPatternStringProperty, {
      number: selectedProjectileNumberProperty,
      count: landedProjectileCountProperty
    } );
    const titleStringProperty = new DerivedProperty(
      [ landedProjectileCountProperty, patternStringProperty, ProjectileDataLabStrings.noDataStringProperty ],
      ( landedProjectileCount, patternString, noDataString ) => {
        return landedProjectileCount === 0 ? noDataString : patternString;
      } );

    const contents = new VBox( {
      children: [
        new PDLText( titleStringProperty, {
          maxWidth: 64,
          font: PDLConstants.SELECTOR_FONT
        } ),
        projectileToggleNode
      ],
      spacing: 5,
      align: 'center',
      justify: 'center'
    } );

    const bounds = customLauncherNode.bounds;
    customLauncherNode.clipArea = Shape.rect( bounds.minX, bounds.minY + bounds.height / 2, bounds.width, bounds.height / 2 );

    const contentsWithLauncherIcon = new HBox( {
      children: [
        customLauncherNode,
        contents
      ],
      align: 'center',
      spacing: 8
    } );

    super( new PDLPanel( contentsWithLauncherIcon, {
      minWidth: 118,
      minHeight: 55,
      align: 'center'
    } ), selectedProjectileNumberProperty, rangeProperty, options );
  }
}

projectileDataLab.register( 'ProjectileSelectorNode', ProjectileSelectorNode );