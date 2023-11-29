// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection from '../../common/view/panels/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/panels/PDLPanel.js';
import { HBox, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import angleUpSolidShape from '../../../../sherpa/js/fontawesome-5/angleUpSolidShape.js';
import angleDownSolidShape from '../../../../sherpa/js/fontawesome-5/angleDownSolidShape.js';
import { FlatAppearanceStrategy } from '../../../../sun/js/buttons/ButtonNode.js';
import Panel from '../../../../sun/js/Panel.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import SamplingField from '../model/SamplingField.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SampleCardsPanelOptions = SelfOptions & PDLPanelOptions;

export default class SampleCardsPanel extends PDLPanel {

  public constructor( samplingFieldProperty: TReadOnlyProperty<SamplingField>, selectedSampleProperty: TProperty<number>, sampleCountProperty: TReadOnlyProperty<number>, options: SampleCardsPanelOptions ) {

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.sampleNofMPatternStringProperty, {

      // TODO: unify naming for these across strings/variables, see https://github.com/phetsims/projectile-data-lab/issues/7
      selected: selectedSampleProperty,
      count: sampleCountProperty
    } );

    const createPage = () => {
      return new VBox( {
        children: [
          new Text( 'Launcher ' + samplingFieldProperty.value.launcher ),
          new Text( 'Sample Size: ' + samplingFieldProperty.value.sampleSize ),
          new Text( 'Mean: 65.2 m' )
        ]
      } );
    };
    const node = new Node();

    samplingFieldProperty.link( samplingField => {
      node.children = [ createPage() ];
    } );

    const carousel = new Panel( node );

    const upDownButtons = new VBox( {
      spacing: 3,
      children: [
        new RectangularPushButton( {
          tandem: options.tandem.createTandem( 'upButton' ),
          content: new Path( angleUpSolidShape, { fill: 'white', scale: 0.05 } ),
          buttonAppearanceStrategy: FlatAppearanceStrategy,
          buttonAppearanceStrategyOptions: {
            lineWidth: 0
          },
          listener: () => {
            selectedSampleProperty.value = Utils.clamp( selectedSampleProperty.value + 1, 0, sampleCountProperty.value );
          },
          fireOnHold: true,
          fireOnHoldInterval: 100
        } ),
        new RectangularPushButton( {
          tandem: options.tandem.createTandem( 'downButton' ),
          content: new Path( angleDownSolidShape, { fill: 'white', scale: 0.05 } ),
          buttonAppearanceStrategy: FlatAppearanceStrategy,
          buttonAppearanceStrategyOptions: {
            lineWidth: 0
          },
          listener: () => {
            selectedSampleProperty.value = Utils.clamp( selectedSampleProperty.value - 1, 0, sampleCountProperty.value );
          }
        } )
      ]
    } );

    super( new PDLPanelSection( patternStringProperty, new HBox( {
      spacing: 5,
      children: [ carousel, upDownButtons ]
    } ), {
      tandem: options.tandem.createTandem( 'sampleNofMPatternSection' )
    } ) );
  }
}

projectileDataLab.register( 'SampleCardsPanel', SampleCardsPanel );