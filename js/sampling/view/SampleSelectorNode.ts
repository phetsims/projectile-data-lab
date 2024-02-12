// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, Node, VBox } from '../../../../scenery/js/imports.js';
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
import SelectorNode, { SelectorNodeOptions } from '../../common/view/SelectorNode.js';
import Range from '../../../../dot/js/Range.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import { SamplingPhase } from '../model/SamplingPhase.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { MeanTone } from '../../common/model/MeanTone.js';

/**
 * The SampleSelectorNode allows the user to select from the various started samples.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SampleSelectorPanelOptions = SelfOptions & StrictOmit<SelectorNodeOptions, 'playSound'>;

const MAX_TEXT_WIDTH = 120;

export default class SampleSelectorNode extends SelectorNode {

  public constructor(
    samplingFieldProperty: TReadOnlyProperty<SamplingField>,
    selectedSampleNumberProperty: TProperty<number> & PhetioObject,
    numberOfStartedSamplesProperty: TReadOnlyProperty<number>,
    numberOfCompletedSamplesProperty: TReadOnlyProperty<number>,
    sampleMeanProperty: TReadOnlyProperty<number | null>,
    phaseProperty: TReadOnlyProperty<SamplingPhase>,
    isContinuousLaunchingProperty: TReadOnlyProperty<boolean>,
    providedOptions: SampleSelectorPanelOptions ) {

    const options = optionize<SampleSelectorPanelOptions, SelfOptions, SelectorNodeOptions>()( {
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      playSound: sampleNumber => {
        const mean = _.mean( samplingFieldProperty.value.getProjectilesInSample( sampleNumber ).map( projectile => projectile.x ) );
        MeanTone.playMean( mean );
      }
    }, providedOptions );

    const dataContainer = new Node();

    // Reuse text labels to avoid memory leaks
    const noDataText = new PDLText( ProjectileDataLabStrings.noDataStringProperty, { font: PDLConstants.SELECTOR_FONT, maxWidth: MAX_TEXT_WIDTH } );
    const titleText = new PDLText( new PatternStringProperty( ProjectileDataLabStrings.sampleNumberOfCountPatternStringProperty, {
      number: selectedSampleNumberProperty,
      count: numberOfStartedSamplesProperty
    } ), {
      font: PDLConstants.SELECTOR_FONT,
      maxWidth: MAX_TEXT_WIDTH
    } );
    const creatingText = new PDLText( ProjectileDataLabStrings.creatingStringProperty, {
      font: PDLConstants.SELECTOR_FONT,
      maxWidth: MAX_TEXT_WIDTH
    } );
    const meanText = new PDLText( new PatternStringProperty( ProjectileDataLabStrings.meanEqualsValueMPatternStringProperty, {
      value: new DerivedProperty( [ sampleMeanProperty ], ( mean: number | null ) => {
        return mean === null ? 'null' : Utils.toFixed( mean, 1 );
      } )
    } ), {
      font: PDLConstants.SELECTOR_FONT,
      maxWidth: MAX_TEXT_WIDTH
    } );
    const meanIndicatorNode = new MeanIndicatorNode( 10, { maxWidth: 10 } );

    // Note the similarity between this implementation and the one in ProjectileSelectorNode
    const rangeProperty = new DerivedProperty(
      [ numberOfStartedSamplesProperty, selectedSampleNumberProperty, phaseProperty, isContinuousLaunchingProperty ],
      ( startedSampleCount, selectedSampleNumber, phase, isContinuousLaunching ) => {
        if ( startedSampleCount === 0 ) {
          return new Range( 1, 1 );
        }

        else if ( phase !== 'showingCompleteSampleWithMean' || isContinuousLaunching ) {

          // If some are airborne, then disable the buttons, freezing at the currently selected value
          return new Range( selectedSampleNumber, selectedSampleNumber );
        }
        else {

          // Everything is landed, everything can be selected
          return new Range( 1, startedSampleCount );
        }
      } );

    Multilink.multilink( [ samplingFieldProperty, selectedSampleNumberProperty, numberOfStartedSamplesProperty, numberOfCompletedSamplesProperty ],
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

          dataContainer.children = [
            new VBox( {
              align: 'left',
              spacing: 2,
              children: children
            } ) ];
        }
      } );

    super( dataContainer, selectedSampleNumberProperty, rangeProperty, options );
  }
}

projectileDataLab.register( 'SampleSelectorNode', SampleSelectorNode );