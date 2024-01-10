// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { Image, Node, VBox } from '../../../../scenery/js/imports.js';
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
    landedProjectileCountProperty: TReadOnlyProperty<number>,
    selectedProjectileProperty: TReadOnlyProperty<Projectile | null>,
    providedOptions: ProjectileSelectorPanelOptions ) {

    const options = optionize<ProjectileSelectorPanelOptions, SelfOptions, PDLPanelOptions>()( {}, providedOptions );

    const projectileInfoContainer = new Node();

    const rangeProperty = new DerivedProperty( [ landedProjectileCountProperty ], landedProjectileCount => {
      return landedProjectileCount === 0 ? new Range( 0, 0 ) : new Range( 1, landedProjectileCount );
    } );
    Multilink.multilink( [ selectedProjectileNumberProperty, landedProjectileCountProperty, selectedProjectileProperty ], () => {
      const projectile = selectedProjectileProperty.value;

      if ( projectile ) {

        const imagePNG = projectile.type === 'pumpkin' ? PUMPKIN_LANDED_IMAGES[ projectile.landedImageIndex ] :
                         projectile.type === 'piano' ? pianoHighlighted_png :
                         cannonball_png;

        projectileInfoContainer.children = [ new Node( {
          children: [ new Image( imagePNG, { scale: 0.5 } ) ],
          matrix: Matrix3.scale( projectile.isFlippedHorizontally ? -1 : 1, 1 ),
          maxHeight: 15
        } ) ];
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

    super( new PDLPanel( contents, {
      minWidth: 60,
      minHeight: 40,
      align: 'center'
    } ), selectedProjectileNumberProperty, rangeProperty, options );
  }
}

projectileDataLab.register( 'ProjectileSelectorNode', ProjectileSelectorNode );