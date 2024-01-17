// Copyright 2023-2024, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import { Color, Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import MeanIndicatorNode from '../../common/view/MeanIndicatorNode.js';
import Utils from '../../../../dot/js/Utils.js';
import PDLText from '../../common/view/PDLText.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLConstants from '../../common/PDLConstants.js';
import { PDLPanel } from '../../common/view/PDLPanel.js';

/**
 * The DataMeasuresOverlay shows the graphics for the visual representation of the average and standard deviation
 * of the landed projectiles. It has a mean indicator node, a mean line, and two standard deviation lines with arrows.
 * It is used in both the field overlay and histogram overlay components on the Measures screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  isHistogram?: boolean;
  isIcon?: boolean;
};
export type DataMeasuresFieldOverlayOptions = SelfOptions & NodeOptions;

const LINE_WIDTH = 1.5;

// The y position of the arrows is a factor of the total height of the overlay
const ARROW_Y_POSITION_FACTOR = 0.7;

// The minimum standard deviation for which to show span arrows
const MIN_SD_FOR_SHOW_ARROWS = 0.8;

// The vertical offset between the edge of the text label and the adjacent element
const TEXT_OFFSET = 1;

// The minimum distance between the edge of the SD label text and the mean line
const MIN_SD_TEXT_MARGIN_X = 3;

export default class DataMeasuresOverlay extends Node {
  public constructor( modelViewTransform: ModelViewTransform2 | ChartTransform,
                      meanDistanceProperty: PhetioProperty<number | null>,
                      standardDeviationDistanceProperty: PhetioProperty<number | null>,
                      isMeanDisplayedProperty: BooleanProperty,
                      isStandardDeviationDisplayedProperty: BooleanProperty,
                      isValuesDisplayedProperty: BooleanProperty,
                      totalHeight: number,
                      providedOptions: DataMeasuresFieldOverlayOptions ) {

    const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    const isMeanVisibleProperty = new DerivedProperty(
      [ isMeanDisplayedProperty, meanDistanceProperty ],
      ( isMeanDisplayed, landedDistanceAverage ) => {
        return isMeanDisplayed && landedDistanceAverage !== null;
      } );

    // Show the standard deviation lines if they are far enough apart to distinguish visually.
    const isSDLinesVisibleProperty = new DerivedProperty(
      [ isStandardDeviationDisplayedProperty, standardDeviationDistanceProperty ],
      ( isStandardDeviationDisplayed, landedDistanceStandardDeviation ) => {
        return isStandardDeviationDisplayed && landedDistanceStandardDeviation !== null;
      } );

    // Show the standard deviation arrows if they are far enough apart to distinguish visually.
    const isSDArrowsVisibleProperty = new DerivedProperty(
      [ isStandardDeviationDisplayedProperty, standardDeviationDistanceProperty ],
      ( isStandardDeviationDisplayed, landedDistanceStandardDeviation ) => {
        return isStandardDeviationDisplayed && landedDistanceStandardDeviation !== null && landedDistanceStandardDeviation > MIN_SD_FOR_SHOW_ARROWS;
      } );

    const meanIndicatorRadius = providedOptions.isIcon ? 8 : 10;

    const meanIndicator = new MeanIndicatorNode( meanIndicatorRadius, {
      visibleProperty: isMeanVisibleProperty
    } );

    // On the field, the mean indicator is nudged down a bit so that it hides the bottom of the mean line
    const meanIndicatorOffsetY = providedOptions.isHistogram || providedOptions.isIcon ? 0 : 2;
    meanIndicator.bottom = origin.y + meanIndicatorOffsetY;

    const meanIndicatorHeight = meanIndicator.bounds.height;

    const lineOptions = {
      visibleProperty: isSDLinesVisibleProperty,
      stroke: 'black',
      lineWidth: LINE_WIDTH
    };

    const arrowYFactor = providedOptions.isHistogram ? 0.5 : ARROW_Y_POSITION_FACTOR;

    const arrowY = origin.y - arrowYFactor * totalHeight;
    const ARROW_HEAD_WIDTH = 3;

    const meanLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - totalHeight ), lineOptions );

    const sideLineHeight = origin.y - arrowY + ARROW_HEAD_WIDTH;
    const leftLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - sideLineHeight ), lineOptions );
    const rightLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - sideLineHeight ), lineOptions );

    const arrowOptions: ArrowNodeOptions = {
      visibleProperty: isSDArrowsVisibleProperty,
      doubleHead: true,
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: 5,
      tailWidth: 1,
      stroke: 'black'
    };

    const leftArrow = new ArrowNode( 0, arrowY, 0, arrowY, arrowOptions );
    const rightArrow = new ArrowNode( 0, arrowY, 0, arrowY, arrowOptions );

    const roundedStringProperty = ( nullableNumberProperty: PhetioProperty<number | null> ) =>
      new DerivedProperty( [ nullableNumberProperty ], nullableNumber => {
        return nullableNumber === null ? '' : Utils.toFixed( nullableNumber, 2 );
      } );

    const meanLabel = new PDLText( new PatternStringProperty( ProjectileDataLabStrings.meanMetersPatternStringProperty,
      { mean: roundedStringProperty( meanDistanceProperty ) } ), {
      font: PDLConstants.PRIMARY_FONT
    } );

    const meanLabelPanel = new PDLPanel( meanLabel, {
      visibleProperty: DerivedProperty.and( [ isMeanVisibleProperty, isValuesDisplayedProperty ] ),
      fill: new Color( 255, 255, 255, 0.85 ),
      stroke: null,
      lineWidth: 1,
      cornerRadius: 5,
      xMargin: 3,
      yMargin: 2,
      bottom: origin.y - meanIndicatorHeight - TEXT_OFFSET
    } );

    const sdLeftLabel = new PDLText( new PatternStringProperty( ProjectileDataLabStrings.standardDeviationMPatternStringProperty,
      { standardDeviation: roundedStringProperty( standardDeviationDistanceProperty ) } ), {
      visibleProperty: DerivedProperty.and( [ isSDLinesVisibleProperty, isValuesDisplayedProperty ] ),
      font: PDLConstants.PRIMARY_FONT,
      bottom: arrowY - ARROW_HEAD_WIDTH - TEXT_OFFSET
    } );

    const sdRightLabel = new PDLText( new PatternStringProperty( ProjectileDataLabStrings.standardDeviationMPatternStringProperty,
      { standardDeviation: roundedStringProperty( standardDeviationDistanceProperty ) } ), {
      visibleProperty: DerivedProperty.and( [ isSDLinesVisibleProperty, isValuesDisplayedProperty ] ),
      font: PDLConstants.PRIMARY_FONT,
      bottom: arrowY - ARROW_HEAD_WIDTH - TEXT_OFFSET
    } );

    Multilink.multilink( [ meanDistanceProperty, standardDeviationDistanceProperty ],
      ( average, standardDeviation ) => {

        if ( average !== null && standardDeviation !== null ) {
          const meanX = modelViewTransform.modelToViewX( average );
          const leftX = modelViewTransform.modelToViewX( average - standardDeviation );
          const rightX = modelViewTransform.modelToViewX( average + standardDeviation );

          meanIndicator.x = meanX;
          meanLine.x = meanX;
          meanLabelPanel.centerX = meanX;

          leftLine.x = leftX;
          rightLine.x = rightX;

          leftArrow.setTail( leftX + LINE_WIDTH, leftArrow.tailY );
          leftArrow.setTip( meanX - LINE_WIDTH, leftArrow.tipY );
          rightArrow.setTail( rightX - LINE_WIDTH, rightArrow.tailY );
          rightArrow.setTip( meanX + LINE_WIDTH, rightArrow.tipY );

          sdLeftLabel.centerX = leftArrow.centerX;
          sdRightLabel.centerX = rightArrow.centerX;

          // Prevent the SD labels from overlapping the mean line
          if ( meanX - sdLeftLabel.right < MIN_SD_TEXT_MARGIN_X ) {
            sdLeftLabel.right = meanX - MIN_SD_TEXT_MARGIN_X;
          }
          if ( sdRightLabel.left - meanX < MIN_SD_TEXT_MARGIN_X ) {
            sdRightLabel.left = meanX + MIN_SD_TEXT_MARGIN_X;
          }
        }
      } );


    const options = optionize<DataMeasuresFieldOverlayOptions, SelfOptions, NodeOptions>()( {
      children: [ leftLine, rightLine, meanLine, leftArrow, rightArrow, sdLeftLabel, sdRightLabel, meanIndicator, meanLabelPanel ],
      isHistogram: false,
      isIcon: false
    }, providedOptions );

    super( options );
  }
}

projectileDataLab.register( 'DataMeasuresOverlay', DataMeasuresOverlay );