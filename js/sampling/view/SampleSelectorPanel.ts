// Copyright 2023, University of Colorado Boulder

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

    // const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.numberOfCountPatternStringProperty, {
    //
    //   // TODO: unify naming for these across strings/variables, see https://github.com/phetsims/projectile-data-lab/issues/7
    //   number: selectedSampleProperty,
    //   count: numberOfCompletedSamplesProperty
    // } );

    // const titleStringProperty = new DerivedProperty( [ numberOfCompletedSamplesProperty, patternStringProperty ], ( landedProjectileCount, patternString ) => {
    //   return landedProjectileCount === 0 ? ProjectileDataLabStrings.noDataStringProperty.value : patternString;
    // } );

    // const titleStringProperty = new DerivedProperty( [ ProjectileDataLabStrings.noDataStringProperty, numberOfCompletedSamplesProperty ], ( x, landedProjectileCount ) => {
    //   return landedProjectileCount === 0 ? ProjectileDataLabStrings.noDataStringProperty.value : ProjectileDataLabStrings.numberOfCountPatternStringProperty.value;
    // } );

    const dataContainer = new Node();
    Multilink.multilink( [ samplingFieldProperty, selectedSampleProperty, numberOfStartedSamplesProperty, numberOfCompletedSamplesProperty ],
      ( samplingField, selectedSample, numberOfStartedSamples, numberOfCompletedSamples ) => {

        if ( numberOfStartedSamples === 0 ) {
          dataContainer.children = [ new PDLText( 'No data' ) ];
        }

        // REVIEW: See how this logic can be simplified / documented
        else if ( ( selectedSample === numberOfStartedSamples && numberOfStartedSamples > numberOfCompletedSamples ) ||
                  ( selectedSample > numberOfStartedSamples ) ) {

          dataContainer.children = [ new VBox( {
            align: 'left',
            spacing: 2,
            children: [
              // TODO: i18n, see https://github.com/phetsims/projectile-data-lab/issues/7
              new Text( 'Sample ' + selectedSample + ' of ' + numberOfStartedSamples ),
              new HSeparator( { stroke: 'black' } ),
              new PDLText( 'Creating...' )
            ]
          } ) ];
        }

        else {
          const projectiles = samplingField.getProjectilesInSelectedSample();
          const values = projectiles.map( projectile => projectile.x );
          dataContainer.children = [ new VBox( {
            align: 'left',
            spacing: 2,
            children: [
              // TODO: i18n, see https://github.com/phetsims/projectile-data-lab/issues/7
              new Text( 'Sample ' + selectedSample + ' of ' + numberOfStartedSamples ),
              new HSeparator( { stroke: 'black' } ),
              new HBox( {
                children: [ new Text( `Mean: ${Utils.toFixedNumber( _.mean( values ), 1 )} m` ), new MeanIndicatorNode( 10, { maxWidth: 10 } ) ]
              } )
            ]
          } ) ];
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

    const sampleCardContainer = new Panel( dataContainer, { align: 'center', maxWidth: 70 } );

    super( new HBox( {
      spacing: 2,
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