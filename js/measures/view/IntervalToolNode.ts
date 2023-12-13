// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { DragListener, Line, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
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
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;
export type IntervalToolNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

const TEXT_PANEL_BOUNDS_DILATION = 5;

// TODO: Move sphere to front when pressed: https://github.com/phetsims/projectile-data-lab/issues/7
// TODO: Keyboard support: https://github.com/phetsims/projectile-data-lab/issues/7
// TODO: Studio autoselect text: https://github.com/phetsims/projectile-data-lab/issues/7
// TODO: i18n, maxWidth: https://github.com/phetsims/projectile-data-lab/issues/7
// TODO: Put it behind the data measures display. https://github.com/phetsims/projectile-data-lab/issues/7
export default class IntervalToolNode extends Node {
  private readonly arrowNode: ArrowNode;

  public constructor( intervalTool: IntervalTool, modelViewTransform: ModelViewTransform2, isIntervalToolVisible: TReadOnlyProperty<boolean>,
                      providedOptions: IntervalToolNodeOptions ) {
    super( {
      visibleProperty: isIntervalToolVisible
    } );

    const edge1Line = new Line( Vector2.ZERO, Vector2.ZERO, {
      stroke: 'black',
      lineWidth: 3
    } );
    const edge1Sphere = new ShadedSphereNode( 20, {
      translation: Vector2.ZERO
    } );
    edge1Sphere.touchArea = edge1Sphere.localBounds.dilatedXY( 2, 4 );
    edge1Sphere.mouseArea = edge1Sphere.localBounds.dilatedXY( 2, 4 );
    this.addChild( edge1Line );
    this.addChild( edge1Sphere );

    const edge2Line = new Line( Vector2.ZERO, Vector2.ZERO, {
      stroke: 'black',
      lineWidth: 3
    } );
    const edge2Sphere = new ShadedSphereNode( 20, {
      translation: Vector2.ZERO
    } );
    edge2Sphere.touchArea = edge2Sphere.localBounds.dilatedXY( 2, 4 );
    edge2Sphere.mouseArea = edge2Sphere.localBounds.dilatedXY( 2, 4 );

    this.addChild( edge2Line );
    this.addChild( edge2Sphere );

    this.arrowNode = new ArrowNode( 0, 0, 0, 0, {
      doubleHead: true,
      tailWidth: 4
    } );

    this.addChild( this.arrowNode );

    const intervalText = new PDLText( '', {
      fontSize: 16
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

    const percentPatternProperty = new PatternStringProperty( ProjectileDataLabStrings.intervalToolPercentStringProperty, {
      percent: nonNullProperty
    } );


    // TODO: Studio text autoselect, see https://github.com/phetsims/projectile-data-lab/issues/7
    // const displayValueProperty = new DerivedProperty( [ intervalTool.dataFractionProperty, percentPatternProperty ], ( fraction, format ) => {
    //   return fraction === null ? 'longdash' : format;
    // } );

    const percentReadout = new Panel( new PDLText( percentPatternProperty, {
      fontSize: 16
    } ) );
    percentPatternProperty.link( () => {
      percentReadout.mouseArea = percentReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );
      percentReadout.touchArea = percentReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );
    } );

    const readoutVBox = new VBox( {
      children: [ intervalReadout, percentReadout ],
      spacing: 10
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

      const y16 = modelViewTransform.modelToViewY( 16 );
      const y11_5 = modelViewTransform.modelToViewY( 11.5 );
      const y0 = modelViewTransform.modelToViewY( 0 );

      edge1Sphere.center = new Vector2( viewEdge1X, y16 );
      edge2Sphere.center = new Vector2( viewEdge2X, y16 );

      edge1Line.setLine( viewEdge1X, y16, viewEdge1X, y0 );
      edge2Line.setLine( viewEdge2X, y16, viewEdge2X, y0 );

      // Note if the edge1 and edge2 are the same, the arrow will have the empty bounds
      this.arrowNode.setTailAndTip( viewEdge1X, y11_5, viewEdge2X, y11_5 );

      intervalText.string = Utils.toFixed( ( Math.abs( intervalTool.edge2 - intervalTool.edge1 ) ), 1 ) + ' m';

      intervalReadout.mouseArea = intervalReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );
      intervalReadout.touchArea = intervalReadout.localBounds.dilatedXY( TEXT_PANEL_BOUNDS_DILATION, TEXT_PANEL_BOUNDS_DILATION );

      readoutVBox.centerX = ( viewEdge1X + viewEdge2X ) / 2;
      readoutVBox.top = y11_5 - intervalReadout.height / 2;
    };

    intervalTool.dataFractionProperty.link( fraction => {
      update();
    } );

    intervalTool.changedEmitter.addListener( update );
    update();

    readoutVBox.addInputListener( new DragListener( {
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