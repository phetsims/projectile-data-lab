// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { HBox, Image, Node, VBox } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Projectile from '../../common/model/Projectile.js';
import cannonball_png from '../../../images/cannonball_png.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Range from '../../../../dot/js/Range.js';
import SelectorNode, { SelectorNodeOptions } from '../../common/view/SelectorNode.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PDLConstants, { IS_CURRENTLY_AUTO_GENERATING_DATA_PROPERTY } from '../../common/PDLConstants.js';
import PDLText from '../../common/view/PDLText.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Property from '../../../../axon/js/Property.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Field from '../../common/model/Field.js';
import ProjectileSound from '../../common/model/ProjectileSound.js';
import pumpkin1LandedSelected_png from '../../../images/pumpkin1LandedSelected_png.js';
import pumpkin2LandedSelected_png from '../../../images/pumpkin2LandedSelected_png.js';
import pumpkin3LandedSelected_png from '../../../images/pumpkin3LandedSelected_png.js';
import pianoLandedSelected_png from '../../../images/pianoLandedSelected_png.js';
import ProjectileType, { CANNONBALL, PIANO, PUMPKIN } from '../../common/model/ProjectileType.js';
import LauncherIconNode from '../../common/view/LauncherIconNode.js';

const PUMPKIN_LANDED_IMAGES = [ pumpkin1LandedSelected_png, pumpkin2LandedSelected_png, pumpkin3LandedSelected_png ];

/**
 * Panel that allows the user to select a projectile. This appears in all VSM screens. The selected projectile is displayed
 * in the panel  and highlighted in the play area. The ProjectileSelectorPanel is analogous to the
 * SampleSelectorNode that appears on the Sampling screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
type SelfOptions = EmptySelfOptions;
type ProjectileSelectorNodeOptions = SelfOptions & StrictOmit<SelectorNodeOptions, 'playSound'>;

export default class ProjectileSelectorNode extends SelectorNode {

  public constructor(
    fieldProperty: TReadOnlyProperty<Field>,
    selectedProjectileNumberProperty: TProperty<number> & PhetioObject,
    totalProjectileCountProperty: TReadOnlyProperty<number>,
    numberOfLandedProjectilesProperty: TReadOnlyProperty<number>,
    selectedProjectileProperty: TReadOnlyProperty<Projectile | null>,
    providedOptions: ProjectileSelectorNodeOptions ) {

    const options = optionize<ProjectileSelectorNodeOptions, SelfOptions, SelectorNodeOptions>()( {
      playSound: projectileNumber => {
        const projectile = fieldProperty.value.landedProjectiles[ projectileNumber - 1 ];
        ProjectileSound.play( projectile.type, projectile.x );
      }
    }, providedOptions );

    const rangeProperty = new DerivedProperty( [ IS_CURRENTLY_AUTO_GENERATING_DATA_PROPERTY, selectedProjectileNumberProperty, numberOfLandedProjectilesProperty, totalProjectileCountProperty, selectedProjectileProperty ],
      ( ( isCurrentlyAutoGeneratingData, selectedProjectileNumber, numberOfLandedProjectiles, totalProjectileCount ) => {

        // Projectiles are added to the data set when they land
        if ( numberOfLandedProjectiles === 0 || isCurrentlyAutoGeneratingData ) {
          return new Range( 0, 0 );
        }
        else if ( totalProjectileCount > numberOfLandedProjectiles ) {

          // If some are airborne, then disable the buttons, freezing at the currently selected value
          return new Range( selectedProjectileNumber, selectedProjectileNumber );
        }
        else {

          // Everything is landed, everything can be selected
          return new Range( 1, numberOfLandedProjectiles );
        }
      } ), {
        valueComparisonStrategy: 'equalsFunction'
      } );

    type Depiction = {
      type: ProjectileType;
      isFlippedHorizontally: boolean;
      landedImageIndex?: number;
    };

    const depictions: Depiction[] = [
      { type: CANNONBALL, isFlippedHorizontally: false },
      { type: CANNONBALL, isFlippedHorizontally: true },
      { type: PIANO, isFlippedHorizontally: false },
      { type: PIANO, isFlippedHorizontally: true },
      { type: PUMPKIN, isFlippedHorizontally: false, landedImageIndex: 0 },
      { type: PUMPKIN, isFlippedHorizontally: true, landedImageIndex: 0 },
      { type: PUMPKIN, isFlippedHorizontally: false, landedImageIndex: 1 },
      { type: PUMPKIN, isFlippedHorizontally: true, landedImageIndex: 1 },
      { type: PUMPKIN, isFlippedHorizontally: false, landedImageIndex: 2 },
      { type: PUMPKIN, isFlippedHorizontally: true, landedImageIndex: 2 }
    ];

    const depictionProperty = new Property<Depiction>( depictions[ 0 ] );

    const createNode = ( depiction: Depiction ) => {
      const imagePNG = depiction.type === PUMPKIN ? PUMPKIN_LANDED_IMAGES[ depiction.landedImageIndex! ] :
                       depiction.type === PIANO ? pianoLandedSelected_png :
                       cannonball_png;

      const imageScale = depiction.type === PUMPKIN ? 0.18 : depiction.type === PIANO ? 0.14 : 0.2;

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

    const launcherIconNode = new LauncherIconNode( {
      visibleProperty: new DerivedProperty( [ selectedProjectileProperty ], projectile => projectile !== null )
    } );

    Multilink.multilink( [ selectedProjectileNumberProperty, numberOfLandedProjectilesProperty, selectedProjectileProperty ],
      ( selectedProjectileNumber, numberOfLandedProjectiles, selectedProjectile ) => {

        if ( selectedProjectile ) {

          // Use a reference lookup because it is what ToggleNode supports for equality checking
          const lookup = depictions.find( depiction => {

            if ( depiction.type === CANNONBALL || depiction.type === PIANO ) {
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

          launcherIconNode.updateIcon(
            selectedProjectile.launcherConfiguration,
            selectedProjectile.launcher.mysteryOrCustom,
            selectedProjectile.launcher,
            selectedProjectile.launcherMechanism,
            selectedProjectile.launcherStandardDeviationAngle
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
      count: numberOfLandedProjectilesProperty
    } );
    const titleStringProperty = new DerivedProperty(
      [ numberOfLandedProjectilesProperty, patternStringProperty, ProjectileDataLabStrings.noDataStringProperty ],
      ( numberOfLandedProjectiles, patternString, noDataString ) => {
        return numberOfLandedProjectiles === 0 ? noDataString : patternString;
      } );

    const contents = new VBox( {
      children: [
        new PDLText( titleStringProperty, {
          maxWidth: 68,
          font: PDLConstants.SELECTOR_FONT
        } ),
        projectileToggleNode
      ],
      minContentWidth: 68,
      spacing: 4,
      align: 'center',
      justify: 'center'
    } );

    const contentsWithLauncherIcon = new HBox( {
      children: [
        launcherIconNode,
        contents
      ],
      justify: 'center',
      preferredWidth: 107,
      preferredHeight: 45,
      leftMargin: 5
    } );

    super( contentsWithLauncherIcon, selectedProjectileNumberProperty, rangeProperty, options );
  }
}

projectileDataLab.register( 'ProjectileSelectorNode', ProjectileSelectorNode );