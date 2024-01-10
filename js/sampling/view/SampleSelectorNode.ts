// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { HBox, Node, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SamplingField from '../model/SamplingField.js';
import Utils from '../../../../dot/js/Utils.js';
import PDLText from '../../common/view/PDLText.js';
import MeanIndicatorNode from '../../common/view/MeanIndicatorNode.js';
import PDLConstants from '../../common/PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import SelectorNode from '../../common/view/SelectorNode.js';
import Range from '../../../../dot/js/Range.js';

/**
 * The SampleSelectorNode allows the user to select from the various started samples.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SampleSelectorPanelOptions = SelfOptions & PDLPanelOptions;

export default class SampleSelectorNode extends SelectorNode {

  public constructor(
    samplingFieldProperty: TReadOnlyProperty<SamplingField>,
    selectedSampleProperty: TProperty<number>,
    numberOfStartedSamplesProperty: TReadOnlyProperty<number>,
    numberOfCompletedSamplesProperty: TReadOnlyProperty<number>,
    sampleMeanProperty: TReadOnlyProperty<number | null>,
    providedOptions: SampleSelectorPanelOptions ) {

    const options = optionize<SampleSelectorPanelOptions, SelfOptions, PDLPanelOptions>()( {}, providedOptions );

    const dataContainer = new Node();

    // Reuse text labels to avoid memory leaks
    const noDataText = new PDLText( ProjectileDataLabStrings.noDataStringProperty, { font: PDLConstants.SELECTOR_FONT } );
    const titleText = new PDLText( new PatternStringProperty( ProjectileDataLabStrings.sampleNumberOfCountPatternStringProperty, {
      number: selectedSampleProperty,
      count: numberOfStartedSamplesProperty
    } ), { font: PDLConstants.SELECTOR_FONT } );
    const creatingText = new PDLText( ProjectileDataLabStrings.creatingStringProperty, { font: PDLConstants.SELECTOR_FONT } );
    const meanText = new PDLText( new PatternStringProperty( ProjectileDataLabStrings.meanEqualsValueMPatternStringProperty, {
      value: new DerivedProperty( [ sampleMeanProperty ], ( mean: number | null ) => {
        return mean === null ? 'null' : Utils.toFixed( mean, 1 );
      } )
    } ), { font: PDLConstants.SELECTOR_FONT } );
    const meanIndicatorNode = new MeanIndicatorNode( 10, { maxWidth: 10 } );

    const rangeProperty = new DerivedProperty( [ numberOfStartedSamplesProperty ], startedSampleCount => {
      return startedSampleCount === 0 ? new Range( 0, 0 ) : new Range( 1, startedSampleCount );
    } );

    Multilink.multilink( [ samplingFieldProperty, selectedSampleProperty, numberOfStartedSamplesProperty, numberOfCompletedSamplesProperty ],
      ( samplingField, selectedSample, numberOfStartedSamples, numberOfCompletedSamples ) => {

        if ( numberOfStartedSamples === 0 ) {
          noDataText.detach();
          dataContainer.children = [ noDataText ];
        }
        else {

          titleText.detach();
          const children: Node[] = [
            titleText
          ];

          const isUnfinishedSampleSelected = selectedSample === numberOfStartedSamples && numberOfStartedSamples > numberOfCompletedSamples;
          const isUnstartedSampleSelected = selectedSample > numberOfStartedSamples;
          if ( isUnfinishedSampleSelected || isUnstartedSampleSelected ) {
            creatingText.detach();
            children.push( creatingText );
          }

          else {

            meanText.detach();
            meanIndicatorNode.detach();
            children.push( new HBox( {
                spacing: 3,
                children: [ meanText, meanIndicatorNode ]
              } )
            );
          }

          dataContainer.children = [ new VBox( { align: 'left', spacing: 2, children: children } ) ];
        }
      } );

    const sampleCardContainer = new Panel( dataContainer, {
      align: 'center',

      // Keep the right edge on-screen for stringTest=long
      maxWidth: 150,
      minWidth: 120,
      minHeight: 40
    } );

    super( sampleCardContainer, selectedSampleProperty, rangeProperty, {
      minHeight: 50,
      tandem: options.tandem
    } );
  }
}

projectileDataLab.register( 'SampleSelectorNode', SampleSelectorNode );