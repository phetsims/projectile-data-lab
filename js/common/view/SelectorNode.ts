// Copyright 2024, University of Colorado Boulder

import { Color, Node, NodeOptions, Path, SceneryConstants } from '../../../../scenery/js/imports.js';
import AccessibleNumberSpinner, { AccessibleNumberSpinnerOptions } from '../../../../sun/js/accessibility/AccessibleNumberSpinner.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import InstanceRegistry from '../../../../phet-core/js/documentation/InstanceRegistry.js';
import projectileDataLab from '../../projectileDataLab.js';
import Range from '../../../../dot/js/Range.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import { FlatAppearanceStrategy } from '../../../../sun/js/buttons/ButtonNode.js';
import angleRightSolidShape from '../../../../sherpa/js/fontawesome-5/angleRightSolidShape.js';
import angleLeftSolidShape from '../../../../sherpa/js/fontawesome-5/angleLeftSolidShape.js';
import TProperty from '../../../../axon/js/TProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';

/**
 * Selector node for choosing between a projectile (VSM Screens) or sample (Sampling Screen). Adapted from NumberSpinner
 * in order to maintain a similar look and feel, but also to show arbitrary contents in the display area.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type ParentOptions = AccessibleNumberSpinnerOptions & NodeOptions;
export type SelectorNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'children' | 'valueProperty' | 'enabledRangeProperty' | 'keyboardStep' | 'shiftKeyboardStep' | 'pageKeyboardStep'>;

export default class SelectorNode extends AccessibleNumberSpinner( Node, 0 ) {

  public constructor( contents: Node, numberProperty: TProperty<number> & PhetioObject, rangeProperty: TReadOnlyProperty<Range>, providedOptions?: SelectorNodeOptions ) {

    const options = optionize<SelectorNodeOptions, SelfOptions, ParentOptions>()( {

      // AccessibleSelectorNodeOptions
      valueProperty: numberProperty,
      enabledRangeProperty: rangeProperty,
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,

      // The focus highlight surrounds the entire component, but the spinner display is not interactive with
      // mouse and touch events so this highlight is hidden. Instead, default highlights surround the arrow buttons.
      interactiveHighlight: 'invisible',

      // PhET-iO
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'SelectorNode',
      phetioFeatured: true,
      phetioEnabledPropertyInstrumented: true // opt into default PhET-iO instrumented enabledProperty
    }, providedOptions );

    const arrowButtonOptions: RectangularPushButtonOptions = {
      buttonAppearanceStrategy: FlatAppearanceStrategy,
      buttonAppearanceStrategyOptions: {
        lineWidth: 0
      },
      baseColor: new Color( 255, 255, 255, 0.8 ),
      disabledColor: new Color( 255, 255, 255, 0.2 ),
      minWidth: 30,
      xMargin: 5,
      yMargin: 10,
      layoutOptions: {
        stretch: true,
        grow: 0
      },
      fireOnHold: true,
      fireOnHoldInterval: 50,
      scale: 0.8,

      phetioVisiblePropertyInstrumented: false,
      phetioEnabledPropertyInstrumented: false
    };

    // increment button
    const incrementButton = new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( {
        soundPlayer: nullSoundPlayer,
        tandem: options.tandem.createTandem( 'incrementButton' ),
        listener: () => {
          numberProperty.set( numberProperty.value + 1 );
          this.focus();
          // TODO: Play the projectile landing sound or mean indicator sound - see https://github.com/phetsims/projectile-data-lab/issues/106
        },
        content: new Path( angleRightSolidShape, { fill: 'gray', scale: 0.05 } )
      }, arrowButtonOptions )
    );

    // decrement button
    const decrementButton = new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( {
        soundPlayer: nullSoundPlayer,
        tandem: options.tandem.createTandem( 'decrementButton' ),
        listener: () => {
          numberProperty.set( numberProperty.value - 1 );
          this.focus();
          // TODO: Play the projectile landing sound or mean indicator sound - see https://github.com/phetsims/projectile-data-lab/issues/106
        },
        content: new Path( angleLeftSolidShape, { fill: 'gray', scale: 0.05 } )
      }, arrowButtonOptions )
    );

    // Because range may change via rangeProperty, the size of contents may change, in which case layout will need
    // to be revised. See https://github.com/phetsims/sun/issues/709
    const updateLayout = () => {
      incrementButton.left = contents.right + 5;
      decrementButton.right = contents.left - 5;
      incrementButton.centerY = decrementButton.centerY = contents.centerY;
    };
    contents.boundsProperty.link( () => updateLayout() );

    incrementButton.touchArea = incrementButton.localBounds.dilatedXY( 10, 10 );
    decrementButton.touchArea = decrementButton.localBounds.dilatedXY( 10, 10 );
    incrementButton.mouseArea = incrementButton.localBounds.dilatedXY( 10, 10 );
    decrementButton.mouseArea = decrementButton.localBounds.dilatedXY( 10, 10 );

    options.children = [ contents, incrementButton, decrementButton ];

    // pdom - SelectorNode uses AccessibleValueHandler for accessibility, but it was decided that keyboardStep
    // and shiftKeyboardStep should have the same behavior as the SelectorNode ArrowButtons AND the ArrowButtons
    // should look depressed when interacting with those keys. To accomplish this we actually press the ArrowButtons
    // in response to input with those keys. keyboardStep and shiftKeyboardStep are set to zero so the value isn't
    // modified again by AccessibleValueHandler.
    options.keyboardStep = 0;
    options.shiftKeyboardStep = 0;
    options.pageKeyboardStep = 0;

    super( options );

    // enable/disable arrow buttons
    const updateEnabled = () => {
      incrementButton.enabled = numberProperty.value + 1 <= rangeProperty.value.max;
      decrementButton.enabled = numberProperty.value - 1 >= rangeProperty.value.min;
    };

    // synchronize with number value
    numberProperty.link( updateEnabled );
    rangeProperty.link( updateEnabled );

    // pdom - click arrow buttons on press of arrow keys so that the Property value changes by deltaValue
    // and the buttons look depressed
    const increasedListener = ( isDown: boolean ) => isDown && incrementButton.pdomClick();
    const decreasedListener = ( isDown: boolean ) => isDown && decrementButton.pdomClick();
    this.incrementDownEmitter.addListener( increasedListener );
    this.decrementDownEmitter.addListener( decreasedListener );

    this.addLinkedElement( numberProperty );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'sun', 'SelectorNode', this );
  }
}

projectileDataLab.register( 'SelectorNode', SelectorNode );