// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection from '../../common/view/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { Color, HBox, Image, Node, Path } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import { FlatAppearanceStrategy } from '../../../../sun/js/buttons/ButtonNode.js';
import Panel from '../../../../sun/js/Panel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Projectile from '../../common/model/Projectile.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import pianoHighlighted_png from '../../../images/pianoHighlighted_png.js';
import cannonball_png from '../../../images/cannonball_png.js';
import pumpkin1Highlighted_png from '../../../images/pumpkin1Highlighted_png.js';
import pumpkin2Highlighted_png from '../../../images/pumpkin2Highlighted_png.js';
import pumpkin3Highlighted_png from '../../../images/pumpkin3Highlighted_png.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import angleLeftSolidShape from '../../../../sherpa/js/fontawesome-5/angleLeftSolidShape.js';
import angleRightSolidShape from '../../../../sherpa/js/fontawesome-5/angleRightSolidShape.js';
import PDLConstants from '../../common/PDLConstants.js';

const PUMPKIN_LANDED_IMAGES = [ pumpkin1Highlighted_png, pumpkin2Highlighted_png, pumpkin3Highlighted_png ];

/**
 * Panel that allows the user to select a projectile. This appears in all VSM screens. The selected projectile is displayed
 * in the panel  and highlighted in the play area. The ProjectileSelectorPanel is analogous to the
 * SampleSelectorPanel that appears on the Sampling screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
type SelfOptions = EmptySelfOptions;
type ProjectileSelectorPanelOptions = SelfOptions & WithRequired<PDLPanelOptions, 'tandem'>;

export default class ProjectileSelectorPanel extends PDLPanel {

  public readonly projectileCardPanel: Panel;

  public constructor(
    selectedProjectileNumberProperty: TProperty<number>,
    landedProjectileCountProperty: TReadOnlyProperty<number>,
    selectedProjectileProperty: TReadOnlyProperty<Projectile | null>,
    providedOptions: ProjectileSelectorPanelOptions ) {

    const options = optionize<ProjectileSelectorPanelOptions, SelfOptions, PDLPanelOptions>()( {}, providedOptions );

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.numberOfCountPatternStringProperty, {
      number: selectedProjectileNumberProperty,
      count: landedProjectileCountProperty
    } );

    const titleStringProperty = new DerivedProperty(
      [ landedProjectileCountProperty, patternStringProperty, ProjectileDataLabStrings.noDataStringProperty ],
      ( landedProjectileCount, patternString, noDataString ) => {
        return landedProjectileCount === 0 ? noDataString : patternString;
      } );

    const createPage = () => {
      const projectile = selectedProjectileProperty.value;

      if ( projectile ) {

        const imagePNG = projectile.type === 'pumpkin' ? PUMPKIN_LANDED_IMAGES[ projectile.landedImageIndex ] :
                         projectile.type === 'piano' ? pianoHighlighted_png :
                         cannonball_png;

        const image = new Image( imagePNG, {
          scale: 0.5
        } );

        return new Node( {
          children: [ image ],
          matrix: Matrix3.scale( projectile.isFlippedHorizontally ? -1 : 1, 1 )
        } );
      }
      else {
        return new Node();
      }
    };

    const navigationButtonOptions: RectangularPushButtonOptions = {
      buttonAppearanceStrategy: FlatAppearanceStrategy,
      buttonAppearanceStrategyOptions: {
        lineWidth: 0
      },
      baseColor: new Color( 255, 255, 255, 0.5 ),
      disabledColor: new Color( 255, 255, 255, 0.2 ),
      minWidth: 30,
      xMargin: 5,
      yMargin: 10,
      layoutOptions: {
        stretch: true,
        grow: 0
      }
    };

    // TODO: Duplicated with sampling screen card panel, see https://github.com/phetsims/projectile-data-lab/issues/59 Design team is still deciding if we want the first/last buttons.
    const createIncrementDecrementButton = ( type: 'increment' | 'decrement' ) => {
      return new RectangularPushButton( combineOptions<RectangularPushButtonOptions>(
        {},
        navigationButtonOptions,
        {
          tandem: options.tandem.createTandem( type + 'Button' ),
          phetioFeatured: true,
          content: new Path( type === 'increment' ? angleRightSolidShape : angleLeftSolidShape, { fill: 'white', scale: 0.05 } ),
          listener: () => {
            const proposedValue = selectedProjectileNumberProperty.value + ( ( type === 'increment' ) ? 1 : -1 );
            if ( proposedValue >= 1 && proposedValue <= landedProjectileCountProperty.value ) {
              selectedProjectileNumberProperty.value = proposedValue;
            }
          },
          fireOnHold: true,
          fireOnHoldInterval: 50,
          enabledProperty: new DerivedProperty( [ selectedProjectileNumberProperty, landedProjectileCountProperty ], ( selectedSample, sampleCount ) => {
            return ( type === 'increment' ) ? selectedSample < sampleCount : selectedSample > 1;
          } )
        }
      ) );
    };

    const projectileInfoContainer = new Node( { maxHeight: 15 } );
    const projectileData = new PDLPanelSection( titleStringProperty, projectileInfoContainer, {
      titleFont: PDLConstants.SELECTOR_FONT,
      align: 'center',
      justify: 'center'
    } );

    const projectileCardPanel = new Panel( projectileData, {
      minWidth: 60,
      minHeight: 50,
      xMargin: 6,
      yMargin: 5
    } );

    super( new HBox( {
      spacing: 5,
      children: [
        createIncrementDecrementButton( 'decrement' ),
        projectileCardPanel,
        createIncrementDecrementButton( 'increment' )
      ],
      tandem: options.tandem.createTandem( 'sampleNumberOfCountPatternSection' )
    } ), {
      fill: null,
      stroke: null,
      minHeight: 50,
      tandem: options.tandem
    } );

    this.projectileCardPanel = projectileCardPanel;

    Multilink.multilink( [ selectedProjectileNumberProperty, landedProjectileCountProperty, selectedProjectileProperty ], () => {
      projectileInfoContainer.children = [ createPage() ];
    } );
  }

  public getProjectileCardCenterX(): number {
    return this.projectileCardPanel.globalBounds.centerX;
  }
}

projectileDataLab.register( 'ProjectileSelectorPanel', ProjectileSelectorPanel );