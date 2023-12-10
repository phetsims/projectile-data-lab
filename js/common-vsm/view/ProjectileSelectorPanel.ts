// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection from '../../common/view/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { HBox, Image, Node, Path, VBox } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import angleUpSolidShape from '../../../../sherpa/js/fontawesome-5/angleUpSolidShape.js';
import angleDownSolidShape from '../../../../sherpa/js/fontawesome-5/angleDownSolidShape.js';
import { FlatAppearanceStrategy } from '../../../../sun/js/buttons/ButtonNode.js';
import Panel from '../../../../sun/js/Panel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Projectile from '../../common/model/Projectile.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import pianoLanded_png from '../../../images/pianoLanded_png.js';
import cannonball_png from '../../../images/cannonball_png.js';
import pumpkinLanded1_png from '../../../images/pumpkinLanded1_png.js';
import pumpkinLanded2_png from '../../../images/pumpkinLanded2_png.js';
import pumpkinLanded3_png from '../../../images/pumpkinLanded3_png.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';

const PUMPKIN_LANDED_IMAGES = [ pumpkinLanded1_png, pumpkinLanded2_png, pumpkinLanded3_png ];

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

    const titleStringProperty = new DerivedProperty( [ landedProjectileCountProperty, patternStringProperty ], ( landedProjectileCount, patternString ) => {
      return landedProjectileCount === 0 ? ProjectileDataLabStrings.noDataStringProperty.value : patternString;
    } );

    const createPage = () => {
      // const field = samplingFieldProperty.value;
      // const projectiles = field.getProjectilesInCurrentSample();
      // const values = projectiles.map( projectile => projectile.x );
      //
      // const meanString = values.length === 0 ? '?' : Utils.toFixedNumber( _.mean( values ), 1 );
      const projectile = selectedProjectileProperty.value;

      if ( projectile ) {

        const imagePNG = projectile.type === 'PUMPKIN' ? PUMPKIN_LANDED_IMAGES[ projectile.landedImageIndex ] :
                         projectile.type === 'PIANO' ? pianoLanded_png :
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
    const node = new Node();

    Multilink.multilink( [ selectedProjectileNumberProperty, landedProjectileCountProperty, selectedProjectileProperty ], () => {
      node.children = [ createPage() ];
    } );

    const carousel = new Panel( node, { maxHeight: 20 } );

    // TODO: Duplicated with sampling screen card panel, see https://github.com/phetsims/projectile-data-lab/issues/7
    const createIncrementDecrementButton = ( type: 'increment' | 'decrement' ) => {
      return new RectangularPushButton( {
        tandem: options.tandem.createTandem( type + 'Button' ),
        content: new Path( type === 'increment' ? angleUpSolidShape : angleDownSolidShape, { fill: 'white', scale: 0.05 } ),
        buttonAppearanceStrategy: FlatAppearanceStrategy,
        buttonAppearanceStrategyOptions: {
          lineWidth: 0
        },
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
      } );
    };

    const upDownButtons = new VBox( {
      spacing: 3,
      children: [
        createIncrementDecrementButton( 'increment' ),
        createIncrementDecrementButton( 'decrement' )
      ]
    } );


    super( new HBox( {
      spacing: 5,
      children: [ upDownButtons, new PDLPanelSection( titleStringProperty, carousel ) ],
      tandem: options.tandem.createTandem( 'sampleNumberOfCountPatternSection' )
    } ), {
      tandem: options.tandem
    } );
  }
}

projectileDataLab.register( 'ProjectileSelectorPanel', ProjectileSelectorPanel );