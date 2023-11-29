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
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Projectile from '../../common/model/Projectile.js';
import Field from '../../common/model/Field.js';
import VSMField from '../model/VSMField.js';
import VSMFieldSignNode from './VSMFieldSignNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';

/**
 * ScreenView for the Variability, Sources and Measures (VSM) screens on the Projectile Data Lab sim.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VSMScreenViewOptions = SelfOptions & ScreenViewOptions;

export class VSMScreenView extends PDLScreenView<VSMField> {

  protected readonly timeControlNode;

  public constructor( model: VSMModel, options: VSMScreenViewOptions ) {
    super( model, options );

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

    const accordionBox = new VSMAccordionBox(
      new Rectangle( 0, 0, 500, 200, { fill: '#ffcccc' } ), {
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

    const mostRecentProjectileProperty = new DynamicProperty<Projectile | null, Projectile | null, Field>( model.fieldProperty, {
      derive: 'mostRecentlyLaunchedProjectileProperty'
    } );

    const mostRecentLaunchSpeedProperty = new DerivedProperty( [ mostRecentProjectileProperty ], projectile => {
      return projectile ? projectile.launchSpeed : null;
    } );
    const mostRecentLaunchAngleProperty = new DerivedProperty( [ mostRecentProjectileProperty ], projectile => {
      return projectile ? projectile.launchAngle : null;
    } );

    const isLauncherRaisedProperty: TReadOnlyProperty<boolean> = new DerivedProperty( [ model.launcherConfigurationProperty ],
      launcherConfiguration => {
        return launcherConfiguration === 'ANGLE_0';
      } );

    // Create the heat map tools
    const speedToolNode = new SpeedToolNode( {
      visibleProperty: model.isLaunchSpeedVisibleProperty, sourceDataProperty: mostRecentLaunchSpeedProperty,
      x: originPosition.x, y: originPosition.y
    } );

    const angleToolNode = new AngleToolNode( isLauncherRaisedProperty, {
      visibleProperty: model.isLaunchAngleVisibleProperty, sourceDataProperty: mostRecentLaunchAngleProperty,
      x: originPosition.x, y: originPosition.y,
      initialNeedleValue: model.launcherAngleProperty.value
    } );

    // If the projectiles are cleared, clear the heat map tools
    model.fields.forEach( field => {
      field.projectilesClearedEmitter.addListener( () => {
        speedToolNode.clear();
        angleToolNode.clear();
      } );
    } );

    model.launcherHeightProperty.link( launcherHeight => {
      const launcherY = this.modelViewTransform.modelToViewY( launcherHeight );
      angleToolNode.y = launcherY;
      speedToolNode.y = launcherY;
    } );
    model.launcherAngleProperty.link( launcherAngle => {
      angleToolNode.setNeedleForValue( launcherAngle );
    } );

    model.launcherConfigurationProperty.link( launcherConfiguration => {
      const isLauncherRaised = launcherConfiguration === 'ANGLE_0';
      speedToolNode.setForIsLauncherRaised( isLauncherRaised );
    } );

    this.behindProjectilesLayer.addChild( new VSMFieldSignNode(
      model.fieldProperty,
      model.fields,
      this.modelViewTransform
    ) );

    this.addChild( accordionBox );
    this.addChild( stopwatchNode );
    this.addChild( speedToolNode );
    this.addChild( angleToolNode );
    this.addChild( measuringTapeNode );

    // Position the time control node so that the play/pause button is centered at the 50-meter mark
    ManualConstraint.create( this, [ accordionBox ], accordionBoxProxy => {
      accordionBoxProxy.centerX = this.layoutBounds.centerX;
    } );

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
