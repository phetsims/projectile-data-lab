// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { DragListener, DragListenerOptions, KeyboardDragListener, KeyboardDragListenerOptions, Line, Node, NodeOptions, PressedDragListener, VBox } from '../../../../scenery/js/imports.js';
import IntervalTool from '../model/IntervalTool.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Panel from '../../../../sun/js/Panel.js';
import PDLText from '../../common/view/PDLText.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PDLColors from '../../common/PDLColors.js';
import PDLConstants from '../../common/PDLConstants.js';
import Property from '../../../../axon/js/Property.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import grab_mp3 from '../../../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../../../tambo/sounds/release_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';

type SelfOptions = EmptySelfOptions;
export type IntervalToolNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

const TEXT_PANEL_BOUNDS_DILATION = 5;

const grabClip = new SoundClip( grab_mp3, { initialOutputLevel: 0.4 } );
const releaseClip = new SoundClip( release_mp3, { initialOutputLevel: 0.4 } );
soundManager.addSoundGenerator( grabClip );
soundManager.addSoundGenerator( releaseClip );

/**
 * IntervalToolNode displays the IntervalTool, which allows the user to select an interval in the data set. It can be
 * dragged by either handle and also by the main readout (to translate). It can also be dragged via keyboard.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class IntervalToolNode extends Node {
  private readonly arrowNode: ArrowNode;

  public constructor( intervalTool: IntervalTool, modelViewTransform: ModelViewTransform2, providedOptions: IntervalToolNodeOptions ) {

    const options = optionize<IntervalToolNodeOptions, SelfOptions, NodeOptions>()( {
      phetioFeatured: true,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );
    super( options );

    const lineOptions = {
      stroke: PDLColors.intervalToolLineColorProperty,
      lineWidth: 2
    };

    const edge1Line = new Line( Vector2.ZERO, Vector2.ZERO, lineOptions );
    const edge2Line = new Line( Vector2.ZERO, Vector2.ZERO, lineOptions );
    this.addChild( edge1Line );
    this.addChild( edge2Line );

    const sphereOptions = {
      mainColor: PDLColors.intervalToolSphereColorProperty,
      focusable: true,
      tagName: 'div',
      translation: Vector2.ZERO
    };

    const edge1Sphere = new ShadedSphereNode( 20, sphereOptions );
    const edge2Sphere = new ShadedSphereNode( 20, sphereOptions );

    const height = 70;
    edge1Sphere.touchArea = edge1Sphere.localBounds.dilatedXY( 2, height ).shiftY( height - 2 );
    edge2Sphere.touchArea = edge2Sphere.localBounds.dilatedXY( 2, height ).shiftY( height - 2 );

    edge1Sphere.mouseArea = edge1Sphere.localBounds.dilatedXY( 2, height ).shiftY( height - 2 );
    edge2Sphere.mouseArea = edge2Sphere.localBounds.dilatedXY( 2, height ).shiftY( height - 2 );

    this.addChild( edge1Sphere );
    this.addChild( edge2Sphere );

    this.arrowNode = new ArrowNode( 0, 0, 0, 0, {
      doubleHead: true,
      tailWidth: 3
    } );

    this.addChild( this.arrowNode );

    const intervalProperty = new Property( Utils.toFixed( Math.abs( intervalTool.edge2 - intervalTool.edge1 ), 1 ) );
    intervalTool.changedEmitter.addListener( () => {
      intervalProperty.value = Utils.toFixed( Math.abs( intervalTool.edge2 - intervalTool.edge1 ), 1 );
    } );

    // Pattern for the interval readout, not instrumented and hence does not support studio autoselect.
    const intervalReadoutStringProperty = new PatternStringProperty( ProjectileDataLabStrings.intervalMetersPatternStringProperty, {
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
    const percentPatternProperty = new PatternStringProperty( ProjectileDataLabStrings.intervalToolPercentStringProperty, {
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

    const readoutVBox = new VBox( {
      focusable: true,
      tagName: 'div',
      children: [ intervalReadout, percentReadout ],
      spacing: 4
    } );
    this.addChild( readoutVBox );

    const centerProperty = {
      get value(): Vector2 {
        return new Vector2( intervalTool.center, 0 );
      },
      set value( v: Vector2 ) {
        intervalTool.center = v.x;
      }
    };

    const edge1Property = {
      get value(): Vector2 {
        return new Vector2( intervalTool.edge1, 0 );
      },
      set value( v: Vector2 ) {
        intervalTool.edge1 = v.x;
      }
    };

    const edge2Property = {
      get value(): Vector2 {
        return new Vector2( intervalTool.edge2, 0 );
      },
      set value( v: Vector2 ) {
        intervalTool.edge2 = v.x;
      }
    };

    const update = () => {
      const viewEdge1X = modelViewTransform.modelToViewX( intervalTool.edge1 );
      const viewEdge2X = modelViewTransform.modelToViewX( intervalTool.edge2 );

      const SPHERE_Y = modelViewTransform.modelToViewY( 18 );
      const ARROW_Y = modelViewTransform.modelToViewY( 14.5 );
      const y0 = modelViewTransform.modelToViewY( 0 );

      edge1Sphere.center = new Vector2( viewEdge1X, SPHERE_Y );
      edge2Sphere.center = new Vector2( viewEdge2X, SPHERE_Y );

      edge1Line.setLine( viewEdge1X, SPHERE_Y, viewEdge1X, y0 );
      edge2Line.setLine( viewEdge2X, SPHERE_Y, viewEdge2X, y0 );

      // Note if the edge1 and edge2 are the same, the arrow will have the empty bounds
      this.arrowNode.setTailAndTip( viewEdge1X, ARROW_Y, viewEdge2X, ARROW_Y );

      intervalReadout.mouseArea = intervalReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );
      intervalReadout.touchArea = intervalReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );

      readoutVBox.centerX = ( viewEdge1X + viewEdge2X ) / 2;
      readoutVBox.top = ARROW_Y - intervalReadout.height / 2;
    };

    intervalTool.dataFractionProperty.link( fraction => update() );
    intervalTool.changedEmitter.addListener( update );
    update();
    percentPatternProperty.link( update );
    intervalReadoutStringProperty.link( update );

    const moveToFront = ( node: Node ) => {
      return () => node.moveToFront();
    };

    const listenerOptions = {
      start: () => grabClip.play(),
      end: () => releaseClip.play(),
      transform: modelViewTransform
    };

    const dragListenerOptions = {
      useInputListenerCursor: true
    };

    readoutVBox.addInputListener( new DragListener( combineOptions<DragListenerOptions<PressedDragListener>>( {
      applyOffset: true,
      useParentOffset: true,
      positionProperty: centerProperty,
      tandem: providedOptions.tandem.createTandem( 'centerDragListener' ),
      drag: moveToFront( readoutVBox )
    }, listenerOptions, dragListenerOptions ) ) );

    edge1Sphere.addInputListener( new DragListener( combineOptions<DragListenerOptions<PressedDragListener>>( {
      positionProperty: edge1Property,
      tandem: providedOptions.tandem.createTandem( 'edge1DragListener' ),
      drag: moveToFront( edge1Sphere )
    }, listenerOptions, dragListenerOptions ) ) );

    edge2Sphere.addInputListener( new DragListener( combineOptions<DragListenerOptions<PressedDragListener>>( {
      positionProperty: edge2Property,
      tandem: providedOptions.tandem.createTandem( 'edge2DragListener' ),
      drag: moveToFront( edge2Sphere )
    }, listenerOptions, dragListenerOptions ) ) );

    const keyboardDragListenerOptions = {
      dragSpeed: 300, // drag speed, in view coordinates per second
      shiftDragSpeed: 20 // slower drag speed
    };

    readoutVBox.addInputListener( new KeyboardDragListener( combineOptions<KeyboardDragListenerOptions>( {
      positionProperty: centerProperty,
      tandem: providedOptions.tandem.createTandem( 'centerKeyboardDragListener' ),
      drag: moveToFront( readoutVBox )
    }, listenerOptions, keyboardDragListenerOptions ) ) );

    edge1Sphere.addInputListener( new KeyboardDragListener( combineOptions<KeyboardDragListenerOptions>( {
      positionProperty: edge1Property,
      tandem: providedOptions.tandem.createTandem( 'edge1KeyboardDragListener' ),
      drag: moveToFront( edge1Sphere )
    }, listenerOptions, keyboardDragListenerOptions ) ) );

    edge2Sphere.addInputListener( new KeyboardDragListener( combineOptions<KeyboardDragListenerOptions>( {
      positionProperty: edge2Property,
      tandem: providedOptions.tandem.createTandem( 'edge2KeyboardDragListener' ),
      drag: moveToFront( edge2Sphere )
    }, listenerOptions, keyboardDragListenerOptions ) ) );

    this.pdomOrder = [
      edge1Sphere,
      readoutVBox,
      edge2Sphere
    ];

    this.addLinkedElement( intervalTool );
  }
}

projectileDataLab.register( 'IntervalToolNode', IntervalToolNode );