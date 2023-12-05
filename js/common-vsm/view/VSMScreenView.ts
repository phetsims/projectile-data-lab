// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, ManualConstraint } from '../../../../scenery/js/imports.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
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
import VSMField from '../model/VSMField.js';
import VSMFieldSignNode from './VSMFieldSignNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import PDLScreenView from '../../common/view/PDLScreenView.js';
import VSMCanvasNode from './VSMCanvasNode.js';

/**
 * ScreenView for the Variability, Sources and Measures (VSM) screens on the Projectile Data Lab sim.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VSMScreenViewOptions = SelfOptions & ScreenViewOptions;

export default abstract class VSMScreenView extends PDLScreenView<VSMField> {
  protected readonly timeControlNode;
  protected readonly accordionBox: VSMAccordionBox;

  protected constructor( model: VSMModel, options: VSMScreenViewOptions ) {
    super( model, options );

    const projectileCanvas = new VSMCanvasNode( model.fieldProperty, model.isPathsVisibleProperty,
      this.modelViewTransform, model.selectedSampleProperty, {
        canvasBounds: this.canvasBounds
      } );
    this.projectileCanvasLayer.addChild( projectileCanvas );

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      playPauseStepButtonOptions: {
        includeStepForwardButton: false
      },
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: model.timeSpeedValues,
      buttonGroupXSpacing: 18
    } );

    this.addChild( this.timeControlNode );

    const originPosition = this.modelViewTransform.modelToViewPosition( Vector2.ZERO );

    this.accordionBox = new VSMAccordionBox( model.fieldProperty, model.fields, model.binWidthProperty, this, {
      expandedProperty: model.isHistogramShowingProperty,
      binWidthProperty: model.binWidthProperty,
      top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'accordionBox' )
    } );

    // Create a MeasuringTapeNode to measure distance
    const measuringTapeNode = new MeasuringTapeNode( new Property( { name: 'm', multiplier: 1 } ), {
      visibleProperty: model.isMeasuringTapeVisibleProperty,
      modelViewTransform: this.modelViewTransform,
      dragBounds: new Bounds2(
        0, 0, 100, ( PDLConstants.FIELD_CENTER_Y - PDLConstants.SCREEN_VIEW_Y_MARGIN ) / PDLConstants.PIXELS_TO_DISTANCE ),
      basePositionProperty: model.measuringTapeBasePositionProperty,
      tipPositionProperty: model.measuringTapeTipPositionProperty,
      lineColor: new Color( 255, 255, 0 ),
      tapeLineWidth: 2,
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

    const isLauncherRaisedProperty: TReadOnlyProperty<boolean> = new DerivedProperty( [ model.launcherConfigurationProperty ],
      launcherConfiguration => {
        return launcherConfiguration === 'ANGLE_0';
      } );

    // Create the heat map tools
    const speedToolNode = new SpeedToolNode( isLauncherRaisedProperty, {
      visibleProperty: model.isLaunchSpeedVisibleProperty,
      x: originPosition.x, y: originPosition.y
    } );

    const angleToolNode = new AngleToolNode( isLauncherRaisedProperty, {
      visibleProperty: model.isLaunchAngleVisibleProperty,
      initialNeedleValue: model.launcherAngleProperty.value,
      x: originPosition.x, y: originPosition.y
    } );

    model.fields.forEach( field => {

      // When one projectile is launched, update the heat map tools
      field.projectileLaunchedEmitter.addListener( projectile => {
        if ( model.fieldProperty.value === field ) {

          speedToolNode.updateHeatMapWithData( projectile.launchSpeed );
          speedToolNode.updateNeedleAndText( projectile.launchSpeed );

          angleToolNode.updateHeatMapWithData( projectile.launchAngle );
          angleToolNode.updateNeedleAndText( projectile.launchAngle );

          this.launcherNode.setBarrelRotation( projectile.launchAngle );
        }
      } );

      // If the projectiles are cleared, clear the heat map tools
      field.projectilesClearedEmitter.addListener( () => {
        speedToolNode.clear();
        angleToolNode.clear();
      } );
    } );

    // When the field changes, restore the entire state of the heat maps.
    model.fieldProperty.link( field => {

      // Sets to initial conditions (remains at initial conditions if there are no projectiles)
      speedToolNode.clear();
      angleToolNode.clear();

      field.projectiles.forEach( projectile => {
        speedToolNode.updateHeatMapWithData( projectile.launchSpeed );
        angleToolNode.updateHeatMapWithData( projectile.launchAngle );
      } );

      if ( field.projectiles.length > 0 ) {
        speedToolNode.updateNeedleAndText( field.projectiles[ field.projectiles.length - 1 ].launchSpeed );
        angleToolNode.updateNeedleAndText( field.projectiles[ field.projectiles.length - 1 ].launchAngle );
      }
    } );

    model.launcherHeightProperty.link( launcherHeight => {
      const launcherY = this.modelViewTransform.modelToViewY( launcherHeight );
      speedToolNode.y = launcherY;
      angleToolNode.y = launcherY;
    } );
    model.launcherAngleProperty.link( launcherAngle => {
      angleToolNode.setInitialNeedleValue( launcherAngle );
    } );

    this.behindProjectilesLayer.addChild( new VSMFieldSignNode(
      model.fieldProperty,
      model.fields,
      this.modelViewTransform
    ) );

    this.addChild( this.accordionBox );
    this.addChild( stopwatchNode );
    this.addChild( angleToolNode );
    this.addChild( speedToolNode );
    this.addChild( measuringTapeNode );

    // layout
    ManualConstraint.create(
      this,
      [ this.noAirResistanceText, this.timeControlNode, this.resetAllButton ],
      ( noAirResistanceTextProxy, timeControlNodeProxy, resetAllButtonProxy ) => {
        // Position the no air resistance text so that it is centered between the time control node and the reset all button
        noAirResistanceTextProxy.centerX = 0.5 * ( timeControlNodeProxy.right + resetAllButtonProxy.left );
        noAirResistanceTextProxy.centerY = resetAllButtonProxy.centerY;
      }
    );

    // Position the time control node so that the play/pause button is centered at the 50-meter mark
    ManualConstraint.create( this, [ this.timeControlNode ], timeControlNodeProxy => {
      const playPauseCenterOffsetX = 0.5 * this.timeControlNode.width - this.timeControlNode.getPlayPauseButtonCenter().x;
      timeControlNodeProxy.centerX = this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X + playPauseCenterOffsetX;
      timeControlNodeProxy.bottom = this.layoutBounds.maxY - PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );

  }
}

projectileDataLab.register( 'VSMScreenView', VSMScreenView );
