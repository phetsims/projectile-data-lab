// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { CustomLauncherType } from '../model/CustomLauncherType.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Range from '../../../../dot/js/Range.js';
import AngleStabilizerNumberControl from './AngleStabilizerNumberControl.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionCustomLauncherOptions = SelfOptions & PDLPanelSectionOptions;

export default class SectionCustomLauncher extends PDLPanelSection {

  public constructor( customLauncherTypeProperty: PhetioProperty<CustomLauncherType>,
                      angleStabilizerProperty: PhetioProperty<number>, providedOptions: SectionCustomLauncherOptions ) {
    const customLauncherTypeRadioButtonGroup = new RectangularRadioButtonGroup( customLauncherTypeProperty, [ {
      value: 'SPRING' as const,
      tandemName: 'springRadioButton',
      createNode: () => new Text( 'Spring' )
    }, {
      value: 'PRESSURE' as const,
      tandemName: 'pressureRadioButton',
      createNode: () => new Text( 'Pressure' )
    }, {
      value: 'EXPLOSION' as const,
      tandemName: 'explosionRadioButton',
      createNode: () => new Text( 'Explosion' )
    } ], {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' ),
      orientation: 'horizontal'
    } );

    // TODO: Find a way to get the range from the angleStabilizerProperty - see https://github.com/phetsims/projectile-data-lab/issues/7
    const angleStabilizerNumberControl = new AngleStabilizerNumberControl(
      ProjectileDataLabStrings.angleStabilizerStringProperty, angleStabilizerProperty,
      new Range( 0, 10 ), {
        layoutOptions: { topMargin: 7 },
        tandem: providedOptions.tandem.createTandem( 'angleStabilizerNumberControl' )
      } );

    const contentContainer = new VBox( { children: [ customLauncherTypeRadioButtonGroup, angleStabilizerNumberControl ], spacing: 5, stretch: true } );


    super( ProjectileDataLabStrings.launcherStringProperty, contentContainer, providedOptions );
  }
}

projectileDataLab.register( 'SectionCustomLauncher', SectionCustomLauncher );