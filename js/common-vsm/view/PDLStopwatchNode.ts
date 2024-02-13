// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import StopwatchNode, { StopwatchNodeOptions } from '../../../../scenery-phet/js/StopwatchNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLText from '../../common/view/PDLText.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import pushButtonSoundPlayer from '../../../../tambo/js/shared-sound-players/pushButtonSoundPlayer.js';

type SelfOptions = EmptySelfOptions;
type PDLStopwatchNodeOptions = SelfOptions & WithRequired<StopwatchNodeOptions, 'tandem'>;

/**
 * The PDLStopwatchNode represents the stopwatch node for the Projectile Data Lab. It is like a normal stopwatch node,
 * but with an additional Launch button that is used to launch the projectile and start the stopwatch at the same time.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class PDLStopwatchNode extends StopwatchNode {
  public constructor( stopwatch: Stopwatch, launchProjectile: () => void, providedOptions: PDLStopwatchNodeOptions ) {

    const labelProperty = new DerivedStringProperty( [ ProjectileDataLabStrings.stopStringProperty, ProjectileDataLabStrings.launchStringProperty, stopwatch.isRunningProperty ], ( stopString, launchString, isRunning ) => {
      return isRunning ? stopString : launchString;
    } );

    // The button toggles between "Launch" and "Stop". When launching, the timer starts automatically.
    const launchStopButton = new RectangularPushButton( {

      // Fire the button on down, so that the user can time the launch in a similar way to a real stopwatch
      fireOnDown: true,
      baseColor: 'lightgray',
      content: new PDLText( labelProperty, {
        maxWidth: 50
      } ),
      layoutOptions: {
        stretch: true,
        xMargin: 6.3
      },
      tandem: providedOptions.tandem.createTandem( 'launchStopButton' ),
      listener: () => {
        stopwatch.isRunningProperty.value = !stopwatch.isRunningProperty.value;

        if ( stopwatch.isRunningProperty.value ) {
          stopwatch.timeProperty.reset();
          launchProjectile();
        }
      },
      soundPlayer: {

        // Don't compete with the launch sound or the landing sound
        stop: _.noop,
        play: _.noop
      }
    } );

    const options = optionize<PDLStopwatchNodeOptions, SelfOptions, StopwatchNodeOptions>()( {
      visibleProperty: stopwatch.isVisibleProperty,
      includePlayPauseResetButtons: false,
      otherControls: [ launchStopButton ]
    }, providedOptions );
    super( stopwatch, options );
  }
}
projectileDataLab.register( 'PDLStopwatchNode', PDLStopwatchNode );