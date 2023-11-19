// Copyright 2023, University of Colorado Boulder

import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { Text } from '../../../../scenery/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../projectileDataLab.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type ProjectileTypeSectionOptions = SelfOptions & PDLPanelSectionOptions;

export default class LauncherTypeSection extends PDLPanelSection {

  public constructor( launcherTypeProperty: Property<number>, providedOptions: ProjectileTypeSectionOptions ) {
    // TODO: Try to use Array.map for this without type errors - see https://github.com/phetsims/projectile-data-lab/issues/5
    const launcherTypeRadioButtonGroupItems: RectangularRadioButtonGroupItem<number>[] = [];

    launcherTypeProperty.validValues?.forEach( launcherType => {
      launcherTypeRadioButtonGroupItems.push( {
        value: launcherType,
        tandemName: `launcherType${launcherType}RadioButton`,
        createNode: () => new Text( launcherType.toString() )
      } );
    } );

    const launcherTypeRadioButtonGroup = new RectangularRadioButtonGroup( launcherTypeProperty, launcherTypeRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'launcherTypeRadioButtonGroup' ),
      orientation: 'horizontal'
    } );
    super( ProjectileDataLabStrings.launcherStringProperty, launcherTypeRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'LauncherTypeSection', LauncherTypeSection );