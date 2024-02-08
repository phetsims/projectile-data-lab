// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import StopwatchNode, { StopwatchNodeOptions } from '../../../../scenery-phet/js/StopwatchNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLText from '../../common/view/PDLText.js';

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

    const options = optionize<PDLStopwatchNodeOptions, SelfOptions, StopwatchNodeOptions>()( {
      otherControls: [
        new RectangularPushButton( {
          baseColor: 'lightgray',
          content: new PDLText( ProjectileDataLabStrings.launchStringProperty, {
            maxWidth: 50
          } ),
          layoutOptions: {
            stretch: true,
            xMargin: 6.3
          },
          tandem: providedOptions.tandem.createTandem( 'launchButton' ),
          listener: () => {
            stopwatch.timeProperty.reset();
            launchProjectile();
            stopwatch.isRunningProperty.value = true;
          }
        } )
      ]
    }, providedOptions );
    super( stopwatch, options );
  }
}
projectileDataLab.register( 'PDLStopwatchNode', PDLStopwatchNode );