// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, ManualConstraint, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
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
import FieldSignNode from '../../common/view/FieldSignNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Projectile from '../../common/model/Projectile.js';
import Field from '../../common/model/Field.js';
import VSMField from '../model/VSMField.js';

/**
 * ScreenView for the Variability, Sources and Measures (VSM) screens on the Projectile Data Lab sim.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VSMScreenViewOptions = SelfOptions & ScreenViewOptions;

export class VSMScreenView extends PDLScreenView<VSMField> {
  public constructor( model: VSMModel, options: VSMScreenViewOptions ) {
    super( model, options );

    const originPosition = this.modelViewTransform.modelToViewPosition( Vector2.ZERO );

    // Create the field sign
    const fieldSignPosition = this.modelViewTransform.modelToViewPosition( new Vector2( 95, 0 ) );

    const fieldSignStringProperty = new PatternStringProperty( ProjectileDataLabStrings.fieldValuePatternStringProperty, {
      value: new DerivedProperty( [ model.fieldProperty ], field => {
        return model.fields.indexOf( field ) + 1;
      } )
    } );

    // A projectile is counted if it is landed or if it goes below y=0 meters (beyond the 100m mark horizontally)
    const projectileCountProperty = new NumberProperty( 0 );
    const updateProjectileCountProperty = () => {
      const projectiles = model.fieldProperty.value.projectiles.filter(
        projectile => projectile.phase === 'LANDED' ||
                      projectile.phase === 'AIRBORNE_BELOW_FIELD'
      );
      projectileCountProperty.value = projectiles.length;
    };

    // Listen to each of the fields for changes to their projectiles
    model.fields.forEach( field => {
      field.projectileLandedEmitter.addListener( updateProjectileCountProperty );
      field.projectilesClearedEmitter.addListener( updateProjectileCountProperty );
    } );

    model.fieldProperty.link( updateProjectileCountProperty );

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.nEqualsProjectileCountPatternStringProperty, {
      projectileCount: projectileCountProperty
    } );

    const fieldNumberText = new Text( fieldSignStringProperty, { font: PDLConstants.PRIMARY_FONT } );
    const projectileCountText = new Text( patternStringProperty, { font: PDLConstants.PRIMARY_FONT } );

    const fieldSignTextNodes = [ fieldNumberText, projectileCountText ];

    const fieldSignTextContainer = new VBox( {
      children: [ ...fieldSignTextNodes ],
      align: 'center',
      maxWidth: this.modelViewTransform.modelToViewDeltaX( 6 )
    } );

    const fieldSign = new FieldSignNode( fieldSignTextContainer, {
      x: fieldSignPosition.x, y: PDLConstants.FIELD_SIGN_CENTER_Y
    } );

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

    this.behindProjectilesLayer.addChild( fieldSign );

    this.addChild( accordionBox );
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
