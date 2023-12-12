// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { DragListener, Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import IntervalTool from '../model/IntervalTool.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Panel from '../../../../sun/js/Panel.js';
import PDLText from '../../common/view/PDLText.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';

type SelfOptions = EmptySelfOptions;
export type IntervalToolNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class IntervalToolNode extends Node {
  private readonly arrowNode: ArrowNode;

  public constructor( intervalTool: IntervalTool, modelViewTransform: ModelViewTransform2, isIntervalToolVisible: TReadOnlyProperty<boolean>,
                      providedOptions: IntervalToolNodeOptions ) {
    super( {
      visibleProperty: isIntervalToolVisible
    } );

    const edge1Line = new Line( Vector2.ZERO, new Vector2( 0, 200 ), {
      stroke: 'black',
      lineWidth: 3
    } );
    const edge1Sphere = new ShadedSphereNode( 20, {
      translation: Vector2.ZERO
    } );
    this.addChild( edge1Line );
    this.addChild( edge1Sphere );

    const edge2Line = new Line( Vector2.ZERO, new Vector2( 0, 200 ), {
      stroke: 'black',
      lineWidth: 3
    } );
    const edge2Sphere = new ShadedSphereNode( 20, {
      translation: Vector2.ZERO
    } );
    this.addChild( edge2Line );
    this.addChild( edge2Sphere );

    this.arrowNode = new ArrowNode( 0, 0, 0, 0, {
      doubleHead: true,
      tailWidth: 4
    } );

    this.addChild( this.arrowNode );

    const intervalText = new PDLText( '12.3', {
      fontSize: 16
    } );
    const intervalReadout = new Panel( intervalText );
    this.addChild( intervalReadout );

    const percentReadout = new Panel( new PDLText( '12.3%', {
      fontSize: 16
    } ) );
    this.addChild( percentReadout );
    percentReadout.centerTop = intervalReadout.centerBottom.plusXY( 0, 10 );

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
      const viewPoint1 = modelViewTransform.modelToViewXY( intervalTool.edge1, 20 );
      const viewPoint1Lower = modelViewTransform.modelToViewXY( intervalTool.edge1, 16 );
      const viewPointGround1 = modelViewTransform.modelToViewXY( intervalTool.edge1, 0 );

      const viewPoint2 = modelViewTransform.modelToViewXY( intervalTool.edge2, 20 );
      const viewPoint2Lower = modelViewTransform.modelToViewXY( intervalTool.edge2, 16 );
      const viewPointGround2 = modelViewTransform.modelToViewXY( intervalTool.edge2, 0 );

      edge1Sphere.center = viewPoint1;
      edge2Sphere.center = viewPoint2;

      edge1Line.setLine( viewPoint1.x, viewPoint1.y, viewPointGround1.x, viewPointGround1.y );
      edge2Line.setLine( viewPoint2.x, viewPoint2.y, viewPointGround2.x, viewPointGround2.y );

      this.arrowNode.setTailAndTip( viewPoint1Lower.x, viewPoint1Lower.y, viewPoint2Lower.x, viewPoint2Lower.y );

      intervalText.string = Utils.toFixed( ( Math.abs( intervalTool.edge2 - intervalTool.edge1 ) ), 1 ) + ' m';

      intervalReadout.center = this.arrowNode.center;
      percentReadout.centerTop = intervalReadout.centerBottom.plusXY( 0, 10 );
    };

    intervalTool.changedEmitter.addListener( update );
    update();

    intervalReadout.addInputListener( new DragListener( {
      applyOffset: true,
      useParentOffset: true,

      useInputListenerCursor: true,
      positionProperty: centerProperty,
      transform: modelViewTransform,
      tandem: providedOptions.tandem.createTandem( 'centerDragListener' )
    } ) );

    edge1Sphere.addInputListener( new DragListener( {
      useInputListenerCursor: true,
      positionProperty: edge1Property,
      transform: modelViewTransform,
      tandem: providedOptions.tandem.createTandem( 'edge1DragListener' )
    } ) );

    edge2Sphere.addInputListener( new DragListener( {
      useInputListenerCursor: true,
      positionProperty: edge2Property,
      transform: modelViewTransform,
      tandem: providedOptions.tandem.createTandem( 'edge2DragListener' )
    } ) );

    //
    // const keyboardDragListener = new KeyboardDragListener(
    //   combineOptions<KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
    //     positionProperty: projectionScreen.positionProperty,
    //     dragBoundsProperty: dragBoundsProperty,
    //     drag: drag,
    //     transform: modelViewTransform,
    //     tandem: options.tandem.createTandem( 'keyboardDragListener' )
    //   } ) );
    // this.addInputListener( keyboardDragListener );
  }
}

projectileDataLab.register( 'IntervalToolNode', IntervalToolNode );