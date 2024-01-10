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
import CustomLauncherNode from './CustomLauncherNode.js';
import { AngleForConfiguration, LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import { LauncherMechanism } from '../model/LauncherMechanism.js';

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
    selectedProjectileNumberProperty: TProperty<number>,
    totalProjectileCountProperty: TReadOnlyProperty<number>,
    landedProjectileCountProperty: TReadOnlyProperty<number>,
    selectedProjectileProperty: TReadOnlyProperty<Projectile | null>,
    providedOptions: ProjectileSelectorPanelOptions ) {

    const options = optionize<ProjectileSelectorPanelOptions, SelfOptions, PDLPanelOptions>()( {}, providedOptions );

    const projectileInfoContainer = new Node();

    // Create adapters for that will reflect the values for the selected projectile.
    const launchAngleProperty = new NumberProperty( 30 );
    const launchHeightProperty = new NumberProperty( 0 );
    const launcherConfigurationProperty = new Property<LauncherConfiguration>( 'angle30' );
    const isLauncherCustomProperty = new Property( true );
    const mysteryLauncherProperty = new Property( 1 );
    const customLauncherTypeProperty = new Property<LauncherMechanism>( 'spring' );
    const angleStabilizerProperty = new Property( 0 );
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

    const customLauncherNode = new CustomLauncherNode(
      ModelViewTransform2.createIdentity(),
      launcherConfigurationProperty,
      launchAngleProperty,
      launchHeightProperty,
      isLauncherCustomProperty,
      mysteryLauncherProperty,
      customLauncherTypeProperty,
      angleStabilizerProperty,
      latestLaunchSpeedProperty, {
        scale: 0.2,
        visibleProperty: new DerivedProperty( [ selectedProjectileProperty ], projectile => projectile !== null )
      } );

    Multilink.multilink( [ selectedProjectileNumberProperty, landedProjectileCountProperty, selectedProjectileProperty ], ( projectileNumber, landedProjectileCount, selectedProjectile ) => {

      if ( selectedProjectile ) {

        const imagePNG = selectedProjectile.type === 'pumpkin' ? PUMPKIN_LANDED_IMAGES[ selectedProjectile.landedImageIndex ] :
                         selectedProjectile.type === 'piano' ? pianoHighlighted_png :
                         cannonball_png;

        projectileInfoContainer.children = [ new Node( {
          children: [ new Image( imagePNG, { scale: 0.5 } ) ],
          matrix: Matrix3.scale( selectedProjectile.isFlippedHorizontally ? -1 : 1, 1 ),
          maxHeight: 15
        } ) ];

        // Update the adapters for the selected projectile that will show up on the launcher icon.
        launchAngleProperty.value = AngleForConfiguration( selectedProjectile.launcherConfiguration );
        launchHeightProperty.value = selectedProjectile.launchHeight;
        launcherConfigurationProperty.value = selectedProjectile.launcherConfiguration;
        isLauncherCustomProperty.value = selectedProjectile.launcherType === 'custom';
        mysteryLauncherProperty.value = selectedProjectile.mysteryLauncherNumber!;
        customLauncherTypeProperty.value = selectedProjectile.customLauncherMechanism!;
        angleStabilizerProperty.value = selectedProjectile.customLauncherAngleStabilizer!;

        // Adding this line causes a failure in CustomLauncherNode, and is not needed, see https://github.com/phetsims/projectile-data-lab/issues/67
        // TODO: Check in about this, see https://github.com/phetsims/projectile-data-lab/issues/67
        // latestLaunchSpeedProperty.value = selectedProjectile.launchSpeed;

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
      }
      else {
        projectileInfoContainer.children = [];
      }
    } );

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
        new PDLText( titleStringProperty, { font: PDLConstants.SELECTOR_FONT } ),
        projectileInfoContainer
      ],
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
      minWidth: 60,
      minHeight: 40,
      align: 'center'
    } ), selectedProjectileNumberProperty, rangeProperty, options );
  }
}

projectileDataLab.register( 'ProjectileSelectorNode', ProjectileSelectorNode );