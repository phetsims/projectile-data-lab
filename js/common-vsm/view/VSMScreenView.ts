// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, ManualConstraint, Rectangle } from '../../../../scenery/js/imports.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { PDLScreenView } from '../../common/view/PDLScreenView.js';
import VSMModel from '../model/VSMModel.js';
import projectileDataLab from '../../projectileDataLab.js';
import VSMAccordionBox from './VSMAccordionBox.js';
import PDLConstants from '../../common/PDLConstants.js';
import SpeedToolNode from './SpeedToolNode.js';
import AngleToolNode from './AngleToolNode.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

/**
 * ScreenView for the Variability, Sources and Measures (VSM) screens on the Projectile Data Lab sim.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VSMScreenViewOptions = SelfOptions & ScreenViewOptions;

export class VSMScreenView extends PDLScreenView {
  public constructor( model: VSMModel, options: VSMScreenViewOptions ) {
    super( model, options );

    const originPosition = this.modelViewTransform.modelToViewPosition( Vector2.ZERO );

    const accordionBox = new VSMAccordionBox(
      new Rectangle( 0, 0, 500, 200, { fill: '#ffcccc' } ), {
        expandedProperty: model.isHistogramShowingProperty,
        binWidthProperty: model.binWidthProperty,
        top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'accordionBox' )
      } );
    this.addChild( accordionBox );

    // Create a MeasuringTapeNode to measure distance
    const measuringTapeNode = new MeasuringTapeNode( new Property( { name: 'm', multiplier: 1 } ), {
      visibleProperty: model.isMeasuringTapeVisibleProperty,
      modelViewTransform: this.modelViewTransform,
      dragBounds: new Bounds2(
        0, 0, 100, ( PDLConstants.FIELD_CENTER_Y - PDLConstants.SCREEN_VIEW_Y_MARGIN ) / PDLConstants.PIXELS_TO_DISTANCE ),
      basePositionProperty: model.measuringTapeBasePositionProperty,
      tipPositionProperty: model.measuringTapeTipPositionProperty,
      lineColor: new Color( 255, 255, 0 ),
      tapeLineWidth: 3,
      isBaseCrosshairRotating: false,
      isTipCrosshairRotating: false,

      textColor: 'black',
      textBackgroundColor: 'rgba( 255, 255, 255, 0.6 )', // translucent white background
      significantFigures: 1,
      textFont: new PhetFont( { size: 16, weight: 'bold' } ),
      tandem: options.tandem.createTandem( 'measuringTapeNode' ),
      phetioDocumentation: 'The node for the measuring tape'
    } );

    const stopwatchNode = new StopwatchNode( model.stopwatch, {
      visibleProperty: model.isStopwatchVisibleProperty,
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: options.tandem.createTandem( 'stopwatchNode' )
    } );

    const stopwatchStartingPosition = new Vector2(
      this.layoutBounds.centerX - 0.5 * stopwatchNode.bounds.width,
      this.layoutBounds.centerY - 0.5 * stopwatchNode.bounds.height );
    model.stopwatch.positionProperty.setInitialValue( stopwatchStartingPosition );
    model.stopwatch.positionProperty.reset();

    // Add a heat map tool node
    const speedToolNode = new SpeedToolNode( {
      visibleProperty: model.isLaunchSpeedVisibleProperty, sourceDataProperty: model.lastProjectileSpeedProperty,
      x: originPosition.x, y: originPosition.y
    } );

    const isLauncherRaisedProperty: TReadOnlyProperty<boolean> = new DerivedProperty( [ model.launcherConfigurationProperty ],
      launcherConfiguration => {
        return launcherConfiguration === 'ANGLE_0';
      } );

    const angleToolNode = new AngleToolNode( isLauncherRaisedProperty, {
      visibleProperty: model.isLaunchAngleVisibleProperty, sourceDataProperty: model.lastProjectileAngleProperty,
      x: originPosition.x, y: originPosition.y
    } );

    this.addChild( stopwatchNode );
    this.addChild( speedToolNode );
    this.addChild( angleToolNode );
    this.addChild( measuringTapeNode );

    // Position the time control node so that the play/pause button is centered at the 50-meter mark
    ManualConstraint.create( this, [ accordionBox ], accordionBoxProxy => {
      accordionBoxProxy.centerX = this.layoutBounds.centerX;
    } );
  }
}

projectileDataLab.register( 'VSMScreenView', VSMScreenView );
