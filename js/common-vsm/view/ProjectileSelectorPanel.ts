// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection from '../../common/view/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { HBox, Node, Path, VBox } from '../../../../scenery/js/imports.js';
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

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.projectileNumberOfCountPatternStringProperty, {

      // TODO: unify naming for these across strings/variables, see https://github.com/phetsims/projectile-data-lab/issues/7
      number: selectedProjectileNumberProperty,
      count: landedProjectileCountProperty
    } );

    const createPage = () => {
      // const field = samplingFieldProperty.value;
      // const projectiles = field.getProjectilesInCurrentSample();
      // const values = projectiles.map( projectile => projectile.x );
      //
      // const meanString = values.length === 0 ? '?' : Utils.toFixedNumber( _.mean( values ), 1 );

      return new VBox( {
        align: 'left',
        children: [
          // new Text( '' )
        ]
      } );
    };
    const node = new Node();

    Multilink.multilink( [ selectedProjectileNumberProperty, landedProjectileCountProperty, selectedProjectileProperty ], () => {
      node.children = [ createPage() ];
    } );

    const carousel = new Panel( node );

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


    super( new PDLPanelSection( patternStringProperty, new HBox( {
      spacing: 5,
      children: [ carousel, upDownButtons ]
    } ), {
      tandem: options.tandem.createTandem( 'sampleNumberOfCountPatternSection' )
    } ), options );
  }
}

projectileDataLab.register( 'ProjectileSelectorPanel', ProjectileSelectorPanel );