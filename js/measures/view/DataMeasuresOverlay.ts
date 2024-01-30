// Copyright 2023-2024, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
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
  context: 'histogram' | 'field' | 'icon';
};
export type DataMeasuresFieldOverlayOptions = SelfOptions & NodeOptions;

const MEAN_LINE_WIDTH = 1.5;
const SIDE_LINE_WIDTH = 1;

// The y position of the arrows is a factor of the total height of the overlay
const ARROW_Y_POSITION_FACTOR = 0.7;

// The minimum standard deviation for which to show SD lines
const MIN_SD_FOR_SHOW_SIDE_LINES = 0;

// The minimum standard deviation for which to show span arrows
const MIN_SD_FOR_SHOW_ARROWS = 0.2;

// The vertical offset between the edge of the text label and the adjacent element
const TEXT_OFFSET = 2;

// The minimum distance between the edge of the SD label text and the mean line
const MIN_SD_TEXT_MARGIN_X = 3;

const TEXT_MAX_WIDTH = 80;

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

    const isMeanIndicatorVisibleProperty = new DerivedProperty(
      [ isMeanDisplayedProperty, meanDistanceProperty ],
      ( isMeanDisplayed, meanDistance ) => {
        return isMeanDisplayed && meanDistance !== null;
      } );

    // Show the standard deviation lines if they are far enough apart to distinguish visually.
    const isSDLinesVisibleProperty = new DerivedProperty(
      [ isStandardDeviationDisplayedProperty, standardDeviationDistanceProperty ],
      ( isStandardDeviationDisplayed, standardDeviationDistance ) => {
        return isStandardDeviationDisplayed && standardDeviationDistance !== null && standardDeviationDistance > MIN_SD_FOR_SHOW_SIDE_LINES;
      } );

    // Show the standard deviation arrows if they are far enough apart to distinguish visually.
    const isSDArrowsVisibleProperty = new DerivedProperty(
      [ isStandardDeviationDisplayedProperty, standardDeviationDistanceProperty ],
      ( isStandardDeviationDisplayed, standardDeviationDistance ) => {
        return isStandardDeviationDisplayed && standardDeviationDistance !== null && standardDeviationDistance > MIN_SD_FOR_SHOW_ARROWS;
      } );

    const meanIndicatorRadius = providedOptions.context === 'icon' ? 8 : 14;

    const meanIndicator = new MeanIndicatorNode( meanIndicatorRadius, {
      visibleProperty: isMeanIndicatorVisibleProperty
    } );

    // On the field, the mean indicator is nudged down a bit so that it hides the bottom of the mean line
    const meanIndicatorOffsetY = providedOptions.context === 'field' ? 2 : 0;
    meanIndicator.bottom = origin.y + meanIndicatorOffsetY;

    const meanIndicatorHeight = meanIndicator.bounds.height;

    const arrowYFactor = providedOptions.context === 'field' ? ARROW_Y_POSITION_FACTOR : 0.5;

    const arrowY = origin.y - arrowYFactor * totalHeight;
    const ARROW_HEAD_WIDTH = 6;

    const meanLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - totalHeight ), {
      visibleProperty: isStandardDeviationDisplayedProperty,
      stroke: 'black',
      lineWidth: MEAN_LINE_WIDTH
    } );

    const sideLineHeight = providedOptions.context === 'field' ? 0.78 * totalHeight : totalHeight;
    const leftLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - sideLineHeight ), {
      visibleProperty: isSDLinesVisibleProperty,
      stroke: 'black',
      lineWidth: SIDE_LINE_WIDTH
    } );
    const rightLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - sideLineHeight ), {
      visibleProperty: isSDLinesVisibleProperty,
      stroke: 'black',
      lineWidth: SIDE_LINE_WIDTH
    } );

    const arrowOptions: ArrowNodeOptions = {
      visibleProperty: isSDArrowsVisibleProperty,
      doubleHead: true,
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: 6,
      lineWidth: 0.5,
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
      font: PDLConstants.PRIMARY_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    const meanLabelPanel = new PDLPanel( meanLabel, {
      visibleProperty: DerivedProperty.and( [ isMeanIndicatorVisibleProperty, isValuesDisplayedProperty ] ),
      fill: 'white',
      lineWidth: 1,
      cornerRadius: 5,
      xMargin: 3,
      yMargin: 2
    } );

    const sdPatternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.standardDeviationMPatternStringProperty,
      { standardDeviation: roundedStringProperty( standardDeviationDistanceProperty ) } );

    const sdLeftLabel = new PDLText( sdPatternStringProperty, {
      visibleProperty: DerivedProperty.and( [ isStandardDeviationDisplayedProperty, isValuesDisplayedProperty ] ),
      font: PDLConstants.PRIMARY_FONT,
      bottom: origin.y - sideLineHeight - TEXT_OFFSET,
      maxWidth: TEXT_MAX_WIDTH
    } );

    const sdRightLabel = new PDLText( sdPatternStringProperty, {
      visibleProperty: DerivedProperty.and( [ isStandardDeviationDisplayedProperty, isValuesDisplayedProperty ] ),
      font: PDLConstants.PRIMARY_FONT,
      bottom: origin.y - sideLineHeight - TEXT_OFFSET,
      maxWidth: TEXT_MAX_WIDTH
    } );

    Multilink.multilink( [ meanDistanceProperty, standardDeviationDistanceProperty, sdPatternStringProperty, meanLabelPanel.boundsProperty ],
      ( meanDistance, standardDeviationDistance ) => {

        if ( meanDistance !== null && standardDeviationDistance !== null ) {
          const meanX = modelViewTransform.modelToViewX( meanDistance );
          const leftX = modelViewTransform.modelToViewX( meanDistance - standardDeviationDistance );
          const rightX = modelViewTransform.modelToViewX( meanDistance + standardDeviationDistance );

          meanIndicator.x = meanX;
          meanLine.x = meanX;
          meanLabelPanel.centerX = meanX;
          meanLabelPanel.bottom = origin.y - meanIndicatorHeight - TEXT_OFFSET;

          leftLine.x = leftX;
          rightLine.x = rightX;

          leftArrow.setTail( leftX + 0.5 * SIDE_LINE_WIDTH, leftArrow.tailY );
          leftArrow.setTip( meanX - 0.5 * MEAN_LINE_WIDTH, leftArrow.tipY );
          rightArrow.setTail( meanX + 0.5 * MEAN_LINE_WIDTH, rightArrow.tailY );
          rightArrow.setTip( rightX - 0.5 * SIDE_LINE_WIDTH, rightArrow.tipY );

          sdLeftLabel.centerX = _.mean( [ leftX, meanX ] );
          sdRightLabel.centerX = _.mean( [ meanX, rightX ] );

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
      children: [ leftLine, rightLine, meanLine, leftArrow, rightArrow, sdLeftLabel, sdRightLabel, meanIndicator, meanLabelPanel ]
    }, providedOptions );

    super( options );
  }
}

projectileDataLab.register( 'DataMeasuresOverlay', DataMeasuresOverlay );