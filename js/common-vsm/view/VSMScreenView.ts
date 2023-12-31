// Copyright 2023-2024, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, Image, ManualConstraint, Node, Path, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import VSMModel from '../model/VSMModel.js';
import projectileDataLab from '../../projectileDataLab.js';
import VSMAccordionBox from './VSMAccordionBox.js';
import PDLConstants from '../../common/PDLConstants.js';
import SpeedToolNode from './SpeedToolNode.js';
import AngleToolNode from './AngleToolNode.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VSMField from '../model/VSMField.js';
import VSMFieldSignNode from './VSMFieldSignNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import PDLScreenView, { PDLScreenViewOptions } from '../../common/view/PDLScreenView.js';
import VSMCanvasNode from './VSMCanvasNode.js';
import ProjectileSelectorPanel from './ProjectileSelectorPanel.js';
import StaticToolPanel from './StaticToolPanel.js';
import InteractiveToolPanel from './InteractiveToolPanel.js';
import VSMLaunchPanel from './VSMLaunchPanel.js';
import FieldSelectorPanel from './FieldSelectorPanel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HistogramNode from '../../common/view/HistogramNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import TimeDisplayNode from './TimeDisplayNode.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import launchButtonSingle_png from '../../../images/launchButtonSingle_png.js';
import { StopwatchPhase } from '../model/StopwatchPhase.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import PDLColors from '../../common/PDLColors.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import PDLQueryParameters from '../../common/PDLQueryParameters.js';

/**
 * ScreenView for the Variability, Sources and Measures (VSM) screens on the Projectile Data Lab sim.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VSMScreenViewOptions = SelfOptions & WithRequired<PDLScreenViewOptions, 'tandem'>;

export default abstract class VSMScreenView<T extends VSMField> extends PDLScreenView<T> {
  protected readonly fieldSelectorPanel: FieldSelectorPanel<VSMField>;
  protected readonly timeControlNode;
  protected readonly accordionBox: VSMAccordionBox;
  protected readonly toolsLayer: Node = new Node();
  protected readonly projectileSelectorPanel: ProjectileSelectorPanel;
  protected readonly topRightUIContainer: VBox;
  protected readonly eraserButton: EraserButton;

  protected constructor( model: VSMModel<T>,
                         public readonly launchPanel: VSMLaunchPanel,
                         staticToolPanel: StaticToolPanel,
                         interactiveToolPanel: InteractiveToolPanel,
                         // Closure that creates the HistogramNode. We need to access 'this' to be the combo box parent
                         // hence must create it lazily.
                         createHistogramNode: ( node: Node ) => HistogramNode,
                         options: VSMScreenViewOptions ) {
    super(
      model,
      ProjectileDataLabStrings.singleLaunchStringProperty,
      ProjectileDataLabStrings.continuousLaunchStringProperty,

      // TODO: Putting true here is buggy. When you launch out the max manually, the press clear, the button automatically is in auto-fire mode. See https://github.com/phetsims/projectile-data-lab/issues/23
      false,
      options
    );

    // Create the eraser button
    this.eraserButton = new EraserButton( {
      right: this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN,
      centerY: PDLConstants.FIELD_SIGN_CENTER_Y,
      iconWidth: 27,
      listener: () => {
        model.clearCurrentField();
      },
      tandem: options.tandem.createTandem( 'eraserButton' ),
      phetioFeatured: true
    } );

    // Create the effect that the eraser button is next to the field sign
    this.behindProjectilesLayer.addChild( this.eraserButton );

    const originPosition = this.modelViewTransform.modelToViewPosition( Vector2.ZERO );

    const projectileCanvas = new VSMCanvasNode( model.fieldProperty, model.isPathsVisibleProperty,
      this.modelViewTransform, {
        canvasBounds: this.canvasBounds
      } );
    this.projectileCanvasLayer.addChild( projectileCanvas );

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      phetioFeatured: true,
      playPauseStepButtonOptions: {
        includeStepForwardButton: false
      },
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: model.timeSpeedValues,
      buttonGroupXSpacing: 18,
      layoutOptions: {
        topMargin: 10
      },
      speedRadioButtonGroupOptions: {
        maxWidth: 80
      }
    } );

    this.topRightUIContainer = new VBox( {
      stretch: true,
      right: this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN,
      spacing: PDLConstants.INTER_PANEL_SPACING,
      children: [ staticToolPanel, interactiveToolPanel, this.timeControlNode ]
    } );

    const accordionBoxWidth = this.topRightUIContainer.left - launchPanel.right - 2 * PDLConstants.INTER_PANEL_SPACING;

    this.accordionBox = new VSMAccordionBox(
      createHistogramNode( this ), {
        expandedProperty: model.isHistogramVisibleProperty,
        top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
        left: launchPanel.right + PDLConstants.INTER_PANEL_SPACING,
        minWidth: accordionBoxWidth,
        maxWidth: accordionBoxWidth,
        tandem: options.tandem.createTandem( 'accordionBox' )
      } );

    this.projectileSelectorPanel = new ProjectileSelectorPanel(
      model.selectedProjectileNumberProperty,
      model.landedProjectileCountProperty,
      model.selectedProjectileProperty, {
        tandem: options.tandem.createTandem( 'projectileSelectorPanel' )
      }
    );

    // Create the timed launch button

    const timedLaunchIconToggleNode = new ToggleNode<StopwatchPhase, Node>( model.stopwatchPhaseProperty, [
      {
        value: 'clear',
        createNode: () => new Image( launchButtonSingle_png )
      }, {
        value: 'running',
        createNode: () => new Rectangle( 0, 0, 50, 50, {
          fill: 'black',
          stroke: 'white',
          lineWidth: 2,
          cornerRadius: 5,
          opacity: 0.75 // Adjusts the color of the icon to look more like part of the button
        } )
      },
      {
        value: 'stopped',
        createNode: () => new Path( new UTurnArrowShape( 40 ), {
          fill: 'black',
          stroke: 'white',
          lineWidth: 2,
          opacity: 0.75 // Adjusts the color of the icon to look more like part of the button
        } )
      }
    ], {} );

    const timedLaunchButton = new RectangularPushButton( {
      visibleProperty: model.isStopwatchVisibleProperty,
      content: timedLaunchIconToggleNode,
      fireOnDown: true,
      left: this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X - 0.42 * PDLConstants.FIELD_WIDTH,
      bottom: this.layoutBounds.maxY - PDLConstants.SCREEN_VIEW_Y_MARGIN,
      baseColor: PDLColors.timerDisplayColorProperty,
      size: new Dimension2( 85, 45 ),
      yMargin: 5,
      tandem: options.tandem.createTandem( 'timedLaunchButton' ),
      phetioFeatured: true,
      listener: () => {
        model.launchButtonPressed();
      }
    } );

    // tools

    const measuringTapeNode = new MeasuringTapeNode( new Property( { name: 'm', multiplier: 1 } ), {
      visibleProperty: model.isMeasuringTapeVisibleProperty,
      modelViewTransform: this.modelViewTransform,
      dragBounds: new Bounds2(
        0, 0, 100, this.modelViewTransform.modelToViewY( PDLConstants.SCREEN_VIEW_Y_MARGIN ) ),
      basePositionProperty: model.measuringTapeBasePositionProperty,
      tipPositionProperty: model.measuringTapeTipPositionProperty,
      lineColor: new Color( 255, 255, 50 ),
      crosshairLineWidth: 1.8,
      tapeLineWidth: 1.8,
      isBaseCrosshairRotating: false,
      isTipCrosshairRotating: false,
      textColor: 'black',
      textBackgroundColor: 'white',
      textBackgroundCornerRadius: 5,
      textBackgroundXMargin: 3,
      textBackgroundYMargin: 2,
      textPosition: new Vector2( 0, 32 ),
      significantFigures: 1,
      textFont: PDLConstants.MEASURING_TAPE_FONT,
      tandem: options.tandem.createTandem( 'measuringTapeNode' ),
      phetioDocumentation: 'The node for the measuring tape'
    } );

    // Allow the measuring tape to be dragged within the visible bounds of the screen, so that outliers can be measured.
    this.visibleBoundsProperty.link( visibleBounds => {
      const viewBounds = this.modelViewTransform.viewToModelBounds( visibleBounds.erodedXY( PDLConstants.SCREEN_VIEW_X_MARGIN, PDLConstants.SCREEN_VIEW_Y_MARGIN ) );
      measuringTapeNode.setDragBounds( new Bounds2( 0, 0, viewBounds.maxX, viewBounds.maxY ) );
    } );

    const timeDisplayNode = new TimeDisplayNode( model.stopwatchElapsedTimeProperty, {
      visibleProperty: model.isStopwatchVisibleProperty,
      tandem: options.tandem.createTandem( 'timeDisplayNode' )
    } );
    timeDisplayNode.leftCenter = this.launchButton.rightCenter;

    model.isStopwatchVisibleProperty.link( isStopwatchVisible => {
      this.launchButton.visible = !isStopwatchVisible;
      this.launchControlRadioButtonGroup.visible = !isStopwatchVisible;
    } );

    const isLauncherRaisedProperty = new DerivedProperty( [ model.launcherHeightProperty ], height => height > 0 );

    // Create the heat map tools
    const speedToolNode = new SpeedToolNode( isLauncherRaisedProperty, {
      visibleProperty: model.isLaunchSpeedVisibleProperty,
      x: originPosition.x, y: originPosition.y
    } );

    const angleToolNode = new AngleToolNode( isLauncherRaisedProperty, {
      visibleProperty: model.isLaunchAngleVisibleProperty,
      initialNeedleValue: model.latestLaunchAngleProperty.value,
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

          this.launcherNode.playLaunchAnimation( projectile.launchAngle );
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

      const projectiles = field.getAllProjectiles();
      projectiles.forEach( projectile => {
        speedToolNode.updateHeatMapWithData( projectile.launchSpeed );
        angleToolNode.updateHeatMapWithData( projectile.launchAngle );
      } );

      if ( projectiles.length > 0 ) {
        speedToolNode.updateNeedleAndText( projectiles[ projectiles.length - 1 ].launchSpeed );
        angleToolNode.updateNeedleAndText( projectiles[ projectiles.length - 1 ].launchAngle );
      }
    } );

    model.launcherHeightProperty.link( launcherHeight => {
      const launcherY = this.modelViewTransform.modelToViewY( launcherHeight );
      speedToolNode.y = launcherY;
      angleToolNode.y = launcherY;
    } );
    model.latestLaunchAngleProperty.link( launcherAngle => {
      angleToolNode.setInitialNeedleValue( launcherAngle );
    } );

    this.fieldSelectorPanel = new FieldSelectorPanel( model.fieldProperty, model.fields, {
      tandem: options.tandem.createTandem( 'fieldSelectorPanel' ),
      phetioFeatured: true
    } );

    const fieldSign = new VSMFieldSignNode(
      model.fieldProperty,
      model.landedProjectileCountProperty,
      model.fields,
      this.modelViewTransform
    );

    this.behindProjectilesLayer.addChild( fieldSign );

    this.toolsLayer.addChild( timeDisplayNode );
    this.toolsLayer.addChild( angleToolNode );
    this.toolsLayer.addChild( speedToolNode );
    this.toolsLayer.addChild( measuringTapeNode );

    this.addChild( this.projectileSelectorPanel );
    this.addChild( this.fieldSelectorPanel );
    this.addChild( timedLaunchButton );
    this.addChild( this.accordionBox );
    this.addChild( this.launchPanel );
    this.addChild( this.topRightUIContainer );
    this.addChild( this.toolsLayer );

    // Position the field selector panel
    this.fieldSelectorPanel.bottom = this.layoutBounds.bottom - PDLConstants.SCREEN_VIEW_Y_MARGIN;
    this.fieldSelectorPanel.left = this.layoutBounds.centerX - 60;

    // Positioning field sign and eraser button
    const fieldSignEraserButtonSpacing = 20;
    this.eraserButton.left = fieldSign.right + fieldSignEraserButtonSpacing;

    model.totalProjectileCountProperty.link( totalProjectileCount => {
      this.launchButton.enabled = totalProjectileCount < PDLQueryParameters.maxProjectiles;
    } );

    // Allow the top content to go above the dev bounds, but not too far
    this.visibleBoundsProperty.link( visibleBounds => {
      const minY = PDLConstants.ABOVE_DEV_BOUNDS_TOP;
      const topY = Math.max( visibleBounds.top, minY );
      this.launchPanel.top = topY + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      this.accordionBox.top = topY + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      this.topRightUIContainer.top = topY + PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    // Position the projectile selector panel
    ManualConstraint.create(
      this,
      [ this.launchPanel, this.projectileSelectorPanel ], ( launchPanelProxy, projectileSelectorPanelProxy ) => {
        const totalFieldSignEraserButtonWidth = fieldSign.width + this.eraserButton.width + fieldSignEraserButtonSpacing;
        projectileSelectorPanelProxy.bottom = PDLConstants.FIELD_SIGN_CENTER_Y - PDLConstants.FIELD_SIGN_AIR_RESISTANCE_TEXT_SEPARATION;
        projectileSelectorPanelProxy.centerX = fieldSign.left + 0.5 * totalFieldSignEraserButtonWidth;
      } );

    // Position the 'No air resistance' text
    ManualConstraint.create(
      this,
      [ this.launchPanel ], launchPanelProxy => {
        this.noAirResistanceText.centerX = launchPanelProxy.centerX;
        this.noAirResistanceText.top = launchPanelProxy.bottom + 15;
      } );

    // Keyboard order
    this.pdomControlAreaNode.pdomOrder = [

      this.launchPanel,

      this.launchButton,
      this.launchControlRadioButtonGroup,
      this.fieldSelectorPanel,
      this.accordionBox,

      staticToolPanel,
      interactiveToolPanel,

      this.projectileSelectorPanel,
      this.timeControlNode,
      // The interval tool node will appear here in the Measures screen.
      this.eraserButton,
      this.resetAllButton
    ];
  }
}

projectileDataLab.register( 'VSMScreenView', VSMScreenView );
