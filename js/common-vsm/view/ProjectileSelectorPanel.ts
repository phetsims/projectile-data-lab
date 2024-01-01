// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection from '../../common/view/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { HBox, Image, Line, Node, Path } from '../../../../scenery/js/imports.js';
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

const PUMPKIN_LANDED_IMAGES = [ pumpkin1Highlighted_png, pumpkin2Highlighted_png, pumpkin3Highlighted_png ];

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type ProjectileSelectorPanelOptions = SelfOptions & WithRequired<PDLPanelOptions, 'tandem'>;

export default class ProjectileSelectorPanel extends PDLPanel {

  public constructor(
    selectedProjectileNumberProperty: TProperty<number>,
    landedProjectileCountProperty: TReadOnlyProperty<number>,
    selectedProjectileProperty: TReadOnlyProperty<Projectile | null>,
    providedOptions: ProjectileSelectorPanelOptions ) {

    const options = optionize<ProjectileSelectorPanelOptions, SelfOptions, PDLPanelOptions>()( {}, providedOptions );

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.numberOfCountPatternStringProperty, {

      // TODO: unify naming for these across strings/variables, see https://github.com/phetsims/projectile-data-lab/issues/7
      number: selectedProjectileNumberProperty,
      count: landedProjectileCountProperty
    } );

    const titleStringProperty = new DerivedProperty( [ landedProjectileCountProperty, patternStringProperty, ProjectileDataLabStrings.noDataStringProperty ], ( landedProjectileCount, patternString, noDataString ) => {
      return landedProjectileCount === 0 ? noDataString : patternString;
    } );

    const createPage = () => {
      // const field = samplingFieldProperty.value;
      // const projectiles = field.getProjectilesInCurrentSample();
      // const values = projectiles.map( projectile => projectile.x );
      //
      // const meanString = values.length === 0 ? '?' : Utils.toFixedNumber( _.mean( values ), 1 );
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
      xMargin: 5,
      yMargin: 10,
      layoutOptions: {
        stretch: true,
        grow: 0
      }
    };

    // TODO: Duplicated with sampling screen card panel, see https://github.com/phetsims/projectile-data-lab/issues/7
    const createIncrementDecrementButton = ( type: 'increment' | 'decrement' ) => {
      return new RectangularPushButton( combineOptions<RectangularPushButtonOptions>(
        {},
        navigationButtonOptions,
        {
          tandem: options.tandem.createTandem( type + 'Button' ),
          content: new Path( type === 'increment' ? angleRightSolidShape : angleLeftSolidShape, { fill: 'white', scale: 0.04 } ),
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

    const createFirstLastButton = ( type: 'first' | 'last' ) => {
      const path = new Path( type === 'last' ? angleRightSolidShape : angleLeftSolidShape, { fill: 'white', scale: 0.04 } );
      const line = type === 'first' ?
                   new Line( 0, 0, 0, path.height, { stroke: 'white', lineWidth: 2, right: path.left - 0.5, centerY: path.centerY } ) :
                   new Line( 0, 0, 0, path.height, { stroke: 'white', lineWidth: 2, left: path.right + 0.5, centerY: path.centerY } );
      return new RectangularPushButton( combineOptions<RectangularPushButtonOptions>(
        {},
        navigationButtonOptions,
        {
          tandem: options.tandem.createTandem( `${type}ProjectileButton` ),
          content: new Node( {
            children: [
              line,
              path
            ]
          } ),
          listener: () => {
            selectedProjectileNumberProperty.value = type === 'last' ? landedProjectileCountProperty.value : 1;
          },
          enabledProperty: new DerivedProperty( [ selectedProjectileNumberProperty, landedProjectileCountProperty ], ( selectedProjectileNumber, landedProjectileCount ) => {
            return type === 'last' ? selectedProjectileNumber !== landedProjectileCount : selectedProjectileNumber >= 2;
          } )
        }
      ) );
    };

    const projectileImageContainer = new Node();
    const projectileCardContainer = new Panel( projectileImageContainer, { maxHeight: 20, align: 'center' } );
    const projectileData = new PDLPanelSection( titleStringProperty, projectileCardContainer, { align: 'center', grow: 10 } );

    super( new HBox( {
      spacing: 5,
      children: [
        new HBox( {
          spacing: 4,
          children: [
            createFirstLastButton( 'first' ),
            createIncrementDecrementButton( 'decrement' )
          ]
        } ),
        projectileData,
        new HBox( {
          spacing: 4,
          children: [
            createIncrementDecrementButton( 'increment' ),
            createFirstLastButton( 'last' )
          ]
        } )
      ],
      tandem: options.tandem.createTandem( 'sampleNumberOfCountPatternSection' )
    } ), {
      minHeight: 50,
      tandem: options.tandem
    } );

    Multilink.multilink( [ selectedProjectileNumberProperty, landedProjectileCountProperty, selectedProjectileProperty ], () => {
      projectileImageContainer.children = [ createPage() ];
    } );
  }
}

projectileDataLab.register( 'ProjectileSelectorPanel', ProjectileSelectorPanel );