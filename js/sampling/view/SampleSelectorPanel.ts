// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import { HBox, HSeparator, Line, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import { FlatAppearanceStrategy } from '../../../../sun/js/buttons/ButtonNode.js';
import Panel from '../../../../sun/js/Panel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import angleLeftSolidShape from '../../../../sherpa/js/fontawesome-5/angleLeftSolidShape.js';
import angleRightSolidShape from '../../../../sherpa/js/fontawesome-5/angleRightSolidShape.js';
import SamplingField from '../model/SamplingField.js';
import Utils from '../../../../dot/js/Utils.js';
import PDLText from '../../common/view/PDLText.js';
import MeanIndicatorNode from '../../common/view/MeanIndicatorNode.js';
import PDLConstants from '../../common/PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SampleSelectorPanelOptions = SelfOptions & PDLPanelOptions;

export default class SampleSelectorPanel extends PDLPanel {

  public constructor(
    samplingFieldProperty: TReadOnlyProperty<SamplingField>,
    selectedSampleProperty: TProperty<number>,
    numberOfStartedSamplesProperty: TReadOnlyProperty<number>,
    numberOfCompletedSamplesProperty: TReadOnlyProperty<number>,
    providedOptions: SampleSelectorPanelOptions ) {

    const options = optionize<SampleSelectorPanelOptions, SelfOptions, PDLPanelOptions>()( {}, providedOptions );

    const dataContainer = new Node();
    Multilink.multilink( [ samplingFieldProperty, selectedSampleProperty, numberOfStartedSamplesProperty, numberOfCompletedSamplesProperty ],
      ( samplingField, selectedSample, numberOfStartedSamples, numberOfCompletedSamples ) => {

        if ( numberOfStartedSamples === 0 ) {
          dataContainer.children = [ new PDLText( ProjectileDataLabStrings.noDataStringProperty, { font: PDLConstants.SAMPLE_SELECTOR_FONT } ) ];
        }
        else {

          const children: Node[] = [

            new Text( new PatternStringProperty( ProjectileDataLabStrings.sampleNumberOfCountPatternStringProperty, {
              number: selectedSample,
              count: numberOfStartedSamples
            } ), { font: PDLConstants.SAMPLE_SELECTOR_FONT } ),
            new HSeparator( { stroke: 'black' } )
          ];

          // REVIEW: See how this logic can be simplified / documented
          const isUnfinishedSampleSelected = selectedSample === numberOfStartedSamples && numberOfStartedSamples > numberOfCompletedSamples;
          const isUnstartedSampleSelected = selectedSample > numberOfStartedSamples;
          if ( isUnfinishedSampleSelected || isUnstartedSampleSelected ) {
            children.push( new PDLText( ProjectileDataLabStrings.creatingStringProperty, { font: PDLConstants.SAMPLE_SELECTOR_FONT } ) );
          }

          else {
            const values = samplingField.getProjectilesInSelectedSample().map( projectile => projectile.x );

            const meanText = new Text( new PatternStringProperty( ProjectileDataLabStrings.meanMPatternStringProperty, {
              mean: Utils.toFixed( _.mean( values ), 1 )
            } ), { font: PDLConstants.SAMPLE_SELECTOR_FONT } );
            children.push( new HBox( {
                children: [ meanText, new MeanIndicatorNode( 10, { maxWidth: 10 } ) ]
              } )
            );
          }

          dataContainer.children = [ new VBox( { align: 'left', spacing: 2, children: children } ) ];
        }
      } );

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
            const proposedValue = selectedSampleProperty.value + ( ( type === 'increment' ) ? 1 : -1 );
            if ( proposedValue >= 1 && proposedValue <= numberOfCompletedSamplesProperty.value ) {
              samplingFieldProperty.value.finishCurrentSample();
              selectedSampleProperty.value = proposedValue;

              samplingFieldProperty.value.phaseProperty.value = 'showingCompleteSampleWithMean';
            }
          },
          fireOnHold: true,
          fireOnHoldInterval: 50,
          enabledProperty: new DerivedProperty( [ selectedSampleProperty, numberOfCompletedSamplesProperty ], ( selectedSample, numberOfSampleCards ) => {
            return ( type === 'increment' ) ? selectedSample < numberOfSampleCards : selectedSample > 1;
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
            selectedSampleProperty.value = type === 'last' ? numberOfCompletedSamplesProperty.value : 1;
          },
          enabledProperty: new DerivedProperty( [ selectedSampleProperty, numberOfCompletedSamplesProperty ], ( selectedProjectileNumber, landedProjectileCount ) => {
            return type === 'last' ? selectedProjectileNumber < landedProjectileCount : selectedProjectileNumber >= 2;
          } )
        }
      ) );
    };

    const sampleCardContainer = new Panel( dataContainer, {
      align: 'center',

      // Keep the right edge on-screen for stringTest=long
      maxWidth: 175
    } );

    super( new HBox( {
      spacing: 3,
      children: [
        new HBox( {
          spacing: 2,
          children: [
            createFirstLastButton( 'first' ),
            createIncrementDecrementButton( 'decrement' )
          ]
        } ),
        sampleCardContainer,
        new HBox( {
          spacing: 2,
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
  }
}

projectileDataLab.register( 'SampleSelectorPanel', SampleSelectorPanel );