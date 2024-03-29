// Copyright 2023-2024, University of Colorado Boulder

/**
 * IntervalToolNode displays the IntervalTool, which allows the user to select an interval in the data set. It can be
 * dragged by either handle and also by the main readout (to translate). It can also be dragged via keyboard.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { DragListener, DragListenerOptions, Line, Node, NodeOptions, PressedDragListener, VBox } from '../../../../scenery/js/imports.js';
import IntervalTool from '../model/IntervalTool.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Panel from '../../../../sun/js/Panel.js';
import PDLText from '../../common/view/PDLText.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PDLColors from '../../common/PDLColors.js';
import Property from '../../../../axon/js/Property.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Range from '../../../../dot/js/Range.js';
import intervalTool_wav from '../../../sounds/intervalTool_wav.js';
import PDLConstants from '../../common/PDLConstants.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';

const edgeFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'lowpass',
  Q: 1,
  frequency: 800
} );

const centerFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'bandpass',
  Q: 1,
  frequency: 600
} );

const edgeSoundClip = new SoundClip( intervalTool_wav, {
  additionalAudioNodes: [ edgeFilter ],
  initialOutputLevel: 0.6
} );
const centerSoundClip = new SoundClip( intervalTool_wav, {
  additionalAudioNodes: [ centerFilter ],
  initialOutputLevel: 0.6
} );
const minSoundClip = new SoundClip( intervalTool_wav, {
  initialPlaybackRate: 0.8,
  initialOutputLevel: 0.3
} );
const maxSoundClip = new SoundClip( intervalTool_wav, {
  initialPlaybackRate: 2.5,
  initialOutputLevel: 0.3
} );

soundManager.addSoundGenerator( edgeSoundClip );
soundManager.addSoundGenerator( centerSoundClip );
soundManager.addSoundGenerator( minSoundClip );
soundManager.addSoundGenerator( maxSoundClip );

type SelfOptions = {
  isIcon: boolean;
};
export type IntervalToolNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

const TEXT_PANEL_BOUNDS_DILATION = 5;

export default class IntervalToolNode extends Node {

  // The horizontal arrow indicates the width of the interval
  private readonly arrowNode: ArrowNode;

  // The center line is only visible while the interval tool is being translationally dragged (via keyboard or mouse)
  private readonly centerLineNode: Line;

  // This Property represents whether the user is dragging via the center readout, which translates the entire interval.
  private readonly isCenterDraggingProperty = new BooleanProperty( false );

  public constructor( intervalTool: IntervalTool, modelViewTransform: ModelViewTransform2, providedOptions: IntervalToolNodeOptions ) {

    const options = optionize<IntervalToolNodeOptions, SelfOptions, NodeOptions>()( {
      phetioFeatured: true,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );
    super( options );

    const lineOptions = {
      stroke: PDLColors.intervalToolLineStrokeProperty,
      lineWidth: 2
    };

    const edge1Line = new Line( Vector2.ZERO, Vector2.ZERO, lineOptions );
    const edge2Line = new Line( Vector2.ZERO, Vector2.ZERO, lineOptions );
    this.addChild( edge1Line );
    this.addChild( edge2Line );

    // This is a downstream Property (only updated in the update function) that is used for sonification only.
    // IntervalTool.centerXProperty may go out of range, so we use this Property to clamp the value.
    const centerXSonifiedProperty = new NumberProperty( intervalTool.center );

    class DraggableShadedSphereNode extends AccessibleSlider( Node, 0 ) {
      public constructor( options: AccessibleSliderOptions ) {
        super( options );

        this.addChild( new ShadedSphereNode( 20, {
          mainColor: PDLColors.intervalToolSphereFillProperty,
          translation: Vector2.ZERO
        } ) );
      }
    }

    const edge1Sphere = new DraggableShadedSphereNode( {
      valueProperty: intervalTool.edge1Property,
      enabledRangeProperty: new Property( new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ) )
    } );
    const edge2Sphere = new DraggableShadedSphereNode( {
      valueProperty: intervalTool.edge2Property,
      enabledRangeProperty: new Property( new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ) )
    } );

    const height = 71;
    edge1Sphere.touchArea = edge1Sphere.localBounds.dilatedY( height ).shiftY( height );
    edge2Sphere.touchArea = edge2Sphere.localBounds.dilatedY( height ).shiftY( height );

    edge1Sphere.mouseArea = edge1Sphere.localBounds.dilatedY( height ).shiftY( height );
    edge2Sphere.mouseArea = edge2Sphere.localBounds.dilatedY( height ).shiftY( height );

    this.addChild( edge1Sphere );
    this.addChild( edge2Sphere );

    const ARROW_HEAD_WIDTH = 8;

    this.arrowNode = new ArrowNode( 0, 0, 0, 0, {
      doubleHead: true,
      isHeadDynamic: true,
      scaleTailToo: true,
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: ARROW_HEAD_WIDTH,
      fractionalHeadHeight: 0.3,
      tailWidth: 1,
      stroke: 'black'
    } );

    this.addChild( this.arrowNode );

    // The correct geometry for the center line will be set in update()
    this.centerLineNode = new Line( 0, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      visibleProperty: this.isCenterDraggingProperty
    } );

    this.addChild( this.centerLineNode );

    const getIntervalString = () => {
      return Utils.toFixed( Math.abs( intervalTool.edge2 - intervalTool.edge1 ), 1 );
    };

    const intervalProperty = new Property( getIntervalString() );
    intervalTool.changedEmitter.addListener( () => {
      intervalProperty.value = getIntervalString();
    } );

    // Pattern for the interval readout, not instrumented and hence does not support studio autoselect.
    const intervalReadoutStringProperty = new PatternStringProperty( ProjectileDataLabStrings.intervalMPatternStringProperty, {
      interval: intervalProperty
    } );

    const intervalText = new PDLText( intervalReadoutStringProperty, {
      font: PDLConstants.INTERVAL_TOOL_FONT,
      maxWidth: 100
    } );
    const intervalReadout = new Panel( intervalText );

    const nonNullProperty = new DerivedProperty( [ intervalTool.dataFractionProperty ], fraction => {
      if ( fraction === null ) {
        return 0;
      }
      else {
        return Utils.toFixed( fraction * 100, 1 );
      }
    } );

    // Pattern for the percent readout, not instrumented and hence does not support studio autoselect.
    const percentPatternProperty = new PatternStringProperty( ProjectileDataLabStrings.percentPatternStringProperty, {
      percent: nonNullProperty
    } );

    const percentReadout = new Panel( new PDLText( percentPatternProperty, {
      font: PDLConstants.INTERVAL_TOOL_FONT,
      maxWidth: 100
    } ) );
    percentPatternProperty.link( () => {
      percentReadout.mouseArea = percentReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );
      percentReadout.touchArea = percentReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );
    } );

    class ReadoutVBox extends AccessibleSlider( Node, 0 ) {
      public constructor( options: AccessibleSliderOptions ) {
        super( options );
        this.addChild( new VBox( {
          children: [ intervalReadout, percentReadout ],
          spacing: 4
        } ) );
      }
    }

    const readoutVBox = new ReadoutVBox( {
      valueProperty: intervalTool.centerProperty,
      enabledRangeProperty: new Property( new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ) )
    } );
    this.addChild( readoutVBox );

    const update = () => {
      const viewEdge1X = modelViewTransform.modelToViewX( intervalTool.edge1 );
      const viewEdge2X = modelViewTransform.modelToViewX( intervalTool.edge2 );

      const SPHERE_Y = modelViewTransform.modelToViewY( 18 );
      const ARROW_Y = modelViewTransform.modelToViewY( 14.5 );

      // The icon has shorter legs
      const y0 = modelViewTransform.modelToViewY( options.isIcon ? 5 : 0 );

      edge1Sphere.center = new Vector2( viewEdge1X, SPHERE_Y );
      edge2Sphere.center = new Vector2( viewEdge2X, SPHERE_Y );

      edge1Line.setLine( viewEdge1X, SPHERE_Y, viewEdge1X, y0 );
      edge2Line.setLine( viewEdge2X, SPHERE_Y, viewEdge2X, y0 );

      const centerX = ( viewEdge1X + viewEdge2X ) / 2;
      this.centerLineNode.setLine( centerX, SPHERE_Y, centerX, y0 );

      // Note if the edge1 and edge2 are the same, the arrow will have the empty bounds
      this.arrowNode.setTailAndTip( viewEdge1X, ARROW_Y, viewEdge2X, ARROW_Y );

      intervalReadout.mouseArea = intervalReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );
      intervalReadout.touchArea = intervalReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );

      readoutVBox.centerX = ( viewEdge1X + viewEdge2X ) / 2;
      readoutVBox.top = ARROW_Y - intervalReadout.height / 2;

      // Update the downstream Property which is only used for sonification.
      centerXSonifiedProperty.value = intervalTool.center;
    };

    intervalTool.dataFractionProperty.link( update );
    intervalTool.changedEmitter.addListener( update );
    update();
    percentPatternProperty.link( update );
    intervalReadoutStringProperty.link( update );

    const moveToFront = ( node: Node ) => {
      return () => {
        node.moveToFront();

        // The readout should always be in front of the handles
        readoutVBox.moveToFront();
      };
    };

    const listenerOptions = {
      transform: modelViewTransform
    };

    const dragListenerOptions: DragListenerOptions<DragListener> = {
      useInputListenerCursor: true,
      dragBoundsProperty: new Property<Bounds2 | null>( new Bounds2( 0, 0, PDLConstants.MAX_FIELD_DISTANCE, 0 ) ),
      allowTouchSnag: true
    };

    const translateDragListenerOptions = {
      start: () => {
        this.isCenterDraggingProperty.value = true;
      },
      end: () => {
        this.isCenterDraggingProperty.value = false;
      },
      transform: modelViewTransform
    };

    // The drag listener requires a Vector2 instead of a number, so we need to create a DynamicProperty to convert between the two
    const createDynamicAdapterProperty = ( property: Property<number>, isReentrant: boolean ) => {
      return new DynamicProperty( new Property( property ), {
        bidirectional: true,
        map: function( value: number ) { return new Vector2( value, 0 );},
        inverseMap: function( value: Vector2 ) { return value.x; },
        reentrant: isReentrant
      } );
    };

    readoutVBox.addInputListener( new DragListener( combineOptions<DragListenerOptions<PressedDragListener>>( {
      applyOffset: true,
      useParentOffset: true,
      positionProperty: createDynamicAdapterProperty( intervalTool.centerProperty, true ),
      tandem: providedOptions.tandem.createTandem( 'centerDragListener' )
    }, translateDragListenerOptions, dragListenerOptions ) ) );

    edge1Sphere.addInputListener( new DragListener( combineOptions<DragListenerOptions<PressedDragListener>>( {
      positionProperty: createDynamicAdapterProperty( intervalTool.edge1Property, false ),
      tandem: providedOptions.tandem.createTandem( 'edge1DragListener' ),
      drag: moveToFront( edge1Sphere )
    }, listenerOptions, dragListenerOptions ) ) );

    edge2Sphere.addInputListener( new DragListener( combineOptions<DragListenerOptions<PressedDragListener>>( {
      positionProperty: createDynamicAdapterProperty( intervalTool.edge2Property, false ),
      tandem: providedOptions.tandem.createTandem( 'edge2DragListener' ),
      drag: moveToFront( edge2Sphere )
    }, listenerOptions, dragListenerOptions ) ) );

    // Play a ratcheting sound as either edge is dragged. The sound is played when passing thresholds on the field,
    // but the sound played is a function of the width of the interval.
    const edgePlaybackRateMapper = ( value: number ) => Utils.linear( 0, 100, 3, 1, value );

    const edgeValueChangeSoundPlayer = new ValueChangeSoundPlayer( new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ), {
      middleMovingUpSoundPlayer: edgeSoundClip,
      middleMovingDownSoundPlayer: edgeSoundClip,
      middleMovingUpPlaybackRateMapper: edgePlaybackRateMapper,
      middleMovingDownPlaybackRateMapper: edgePlaybackRateMapper,
      interThresholdDelta: 2,
      minSoundPlayer: nullSoundPlayer,
      maxSoundPlayer: nullSoundPlayer
    } );

    const createEdgeSonificationListener = ( otherEdgeProperty: { value: number } ) => {
      return ( newValue: number, oldValue: number ) => {

        if ( !this.isCenterDraggingProperty.value ) {
          const newWidth = otherEdgeProperty.value - newValue;
          const oldWidth = otherEdgeProperty.value - oldValue;

          edgeValueChangeSoundPlayer.playSoundIfThresholdReached( Math.abs( newWidth ), Math.abs( oldWidth ) );
        }

        // Play the boundary sound if the edges reach the min/max, either by stretching or translating the tool
        if ( newValue === 0 ) {
          minSoundClip.play();
        }
        else if ( newValue === PDLConstants.MAX_FIELD_DISTANCE ) {
          maxSoundClip.play();
        }
      };
    };

    intervalTool.edge1Property.lazyLink( createEdgeSonificationListener( intervalTool.edge2Property ) );
    intervalTool.edge2Property.lazyLink( createEdgeSonificationListener( intervalTool.edge1Property ) );

    // Play a sound when the interval tool is being translated, and its center crosses a threshold value.
    // The sound played is a function of the horizontal position of the center position.
    const centerPlaybackRateMapper = ( value: number ) => Utils.linear( 0, 100, 0.8, 3, value );

    const centerValueChangeSoundPlayer = new ValueChangeSoundPlayer( new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ), {
      middleMovingUpSoundPlayer: centerSoundClip,
      middleMovingDownSoundPlayer: centerSoundClip,
      middleMovingUpPlaybackRateMapper: centerPlaybackRateMapper,
      middleMovingDownPlaybackRateMapper: centerPlaybackRateMapper,
      interThresholdDelta: 2,
      minSoundPlayer: nullSoundPlayer,
      maxSoundPlayer: nullSoundPlayer
    } );

    centerXSonifiedProperty.lazyLink( ( newValue: number, oldValue: number ) => {
      if ( this.isCenterDraggingProperty.value ) {
        centerValueChangeSoundPlayer.playSoundIfThresholdReached( newValue, oldValue );
      }
    } );

    this.pdomOrder = [
      edge1Sphere,
      edge2Sphere,
      readoutVBox
    ];

    this.addLinkedElement( intervalTool );
  }
}

projectileDataLab.register( 'IntervalToolNode', IntervalToolNode );