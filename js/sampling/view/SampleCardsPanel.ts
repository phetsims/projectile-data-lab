// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection from '../../common/view/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { HBox, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import angleUpSolidShape from '../../../../sherpa/js/fontawesome-5/angleUpSolidShape.js';
import angleDownSolidShape from '../../../../sherpa/js/fontawesome-5/angleDownSolidShape.js';
import { FlatAppearanceStrategy } from '../../../../sun/js/buttons/ButtonNode.js';
import Panel from '../../../../sun/js/Panel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import SamplingField from '../model/SamplingField.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SampleCardsPanelOptions = SelfOptions & PDLPanelOptions;

export default class SampleCardsPanel extends PDLPanel {

  public constructor(
    samplingFieldProperty: TReadOnlyProperty<SamplingField>,
    selectedSampleProperty: TProperty<number>,
    numberOfSampleCardsProperty: TReadOnlyProperty<number>,
    options: SampleCardsPanelOptions ) {

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.sampleNumberOfCountPatternStringProperty, {

      // TODO: unify naming for these across strings/variables, see https://github.com/phetsims/projectile-data-lab/issues/7
      // TODO: How to show the finished sample number or selected sample number (but not an in progress sample), see https://github.com/phetsims/projectile-data-lab/issues/7
      number: selectedSampleProperty,
      count: numberOfSampleCardsProperty
    } );

    const node = new Node();

    Multilink.multilink( [ samplingFieldProperty, numberOfSampleCardsProperty ],
      ( samplingField, numberOfSampleCards ) => {

        const field = samplingFieldProperty.value;
        const projectiles = field.getProjectilesInSelectedSample();
        const values = projectiles.map( projectile => projectile.x );

        // Only show the value for a full sample
        const isFullSample = true;// projectiles.length === field.sampleSize;

        // if ( selectedSample <= numberOfSampleCards ) {
        const meanString = isFullSample ? Utils.toFixedNumber( _.mean( values ), 1 ) : '?';

        const page = new VBox( {
          align: 'left',
          children: [
            new Text( 'Launcher: ' + samplingFieldProperty.value.launcher ),
            new Text( 'Sample Size: ' + samplingFieldProperty.value.sampleSize ),
            new Text( `Mean: ${meanString} m` )
          ]
        } );

        node.children = [ page ];
        // } // TODO: See https://github.com/phetsims/projectile-data-lab/issues/17
      } );

    const carousel = new Panel( node );

    const createIncrementDecrementButton = ( type: 'increment' | 'decrement' ) => {
      return new RectangularPushButton( {
        tandem: options.tandem.createTandem( type + 'Button' ),
        content: new Path( type === 'increment' ? angleUpSolidShape : angleDownSolidShape, { fill: 'white', scale: 0.05 } ),
        buttonAppearanceStrategy: FlatAppearanceStrategy,
        buttonAppearanceStrategyOptions: {
          lineWidth: 0
        },
        listener: () => {
          const proposedValue = selectedSampleProperty.value + ( ( type === 'increment' ) ? 1 : -1 );
          if ( proposedValue >= 1 && proposedValue <= numberOfSampleCardsProperty.value ) {
            selectedSampleProperty.value = proposedValue;
          }
        },
        fireOnHold: true,
        fireOnHoldInterval: 50,
        enabledProperty: new DerivedProperty( [ selectedSampleProperty, numberOfSampleCardsProperty ], ( selectedSample, numberOfSampleCards ) => {
          return ( type === 'increment' ) ? selectedSample < numberOfSampleCards : selectedSample > 1;
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
      tandem: options.tandem.createTandem( 'sampleCardsPanelSection' )
    } ) );
  }
}

projectileDataLab.register( 'SampleCardsPanel', SampleCardsPanel );