// Copyright 2024, University of Colorado Boulder

/**
 * PDLRectangularRadioButtonGroup is a RectangularRadioButtonGroup with a default look that is used in the majority of radio buttons
 * within Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
type PDLRectangularRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class PDLRectangularRadioButtonGroup<T> extends RectangularRadioButtonGroup<T> {
  public constructor( property: PhetioProperty<T>, items: RectangularRadioButtonGroupItem<T>[], providedOptions?: PDLRectangularRadioButtonGroupOptions ) {

    const options = optionize<PDLRectangularRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
      phetioFeatured: true,
      orientation: 'horizontal',
      spacing: 5,
      radioButtonOptions: {
        baseColor: 'rgb(240,240,240)',
        xMargin: 1,
        yMargin: 1,
        cornerRadius: 2,
        buttonAppearanceStrategyOptions: {
          selectedStroke: 'rgb(87,178,226)',
          selectedLineWidth: 2.25
        }
      },
      layoutOptions: {
        align: 'center'
      }
    }, providedOptions );
    super( property, items, options );
  }
}

projectileDataLab.register( 'PDLRectangularRadioButtonGroup', PDLRectangularRadioButtonGroup );