// Copyright 2024, University of Colorado Boulder


import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import Histogram from '../../common/model/Histogram.js';
import { ColorProperty, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HistogramNode from '../../common/view/HistogramNode.js';
import { DerivedProperty } from '../../../../axon/js/imports.js';

/**
 * The VSMHistogramNode creates a histogram node for the VSM screens. It encapsulates the histogram sonification rules.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;

type VSMHistogramNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class VSMHistogramNode extends HistogramNode {

  public constructor( fieldProperty: TReadOnlyProperty<Field>,
                      fields: Field[],
                      totalProjectileCountProperty: TReadOnlyProperty<number>,
                      numberOfLandedProjectilesProperty: TReadOnlyProperty<number>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
                      histogram: Histogram,
                      comboBoxParent: Node,
                      blockFillProperty: ColorProperty,
                      blockStrokeProperty: ColorProperty,
                      providedOptions: VSMHistogramNodeOptions ) {

    const histogramSoundEnabledProperty = new DerivedProperty( [ totalProjectileCountProperty, numberOfLandedProjectilesProperty ],
      ( totalProjectileCount, numberOfLandedProjectiles ) => {
        return numberOfLandedProjectiles > 0 && totalProjectileCount === numberOfLandedProjectiles;
      } );

    super(
      fieldProperty,
      fields,
      numberOfLandedProjectilesProperty,
      horizontalAxisLabelText,
      histogram,
      histogramSoundEnabledProperty,
      comboBoxParent,
      blockFillProperty,
      blockStrokeProperty,
      providedOptions
    );
  }
}

projectileDataLab.register( 'VSMHistogramNode', VSMHistogramNode );