// Copyright 2024, University of Colorado Boulder

import HistogramNode, { HistogramNodeOptions } from '../../common/view/HistogramNode.js';
import projectileDataLab from '../../projectileDataLab.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import Property from '../../../../axon/js/Property.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import { ColorProperty, Node, VBox } from '../../../../scenery/js/imports.js';
import { PDLPanel } from '../../common/view/PDLPanel.js';
import PDLText from '../../common/view/PDLText.js';
import SamplingField from '../model/SamplingField.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

export default class SamplingHistogramNode extends HistogramNode {
  public constructor( launcherProperty: TReadOnlyProperty<number>,
                      sampleSizeProperty: TReadOnlyProperty<number>,
                      numberOfSamplesProperty: TReadOnlyProperty<number>,
                      fieldProperty: TReadOnlyProperty<SamplingField>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: Property<HistogramRepresentation>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
                      blockFillProperty: ColorProperty,
                      blockStrokeProperty: ColorProperty,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      comboBoxParent: Node,
                      options: HistogramNodeOptions ) {
    super(
      fieldProperty,
      fields,
      binWidthProperty,
      histogramRepresentationProperty,
      horizontalAxisLabelText,
      blockFillProperty,
      blockStrokeProperty,

      selectedBinWidthProperty,
      selectedTotalBinsProperty,
      comboBoxParent,

      options
    );

    const label = new PDLPanel( new VBox( {
      align: 'left',
      children: [
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.launcherPatternStringProperty, { launcher: launcherProperty } ), { fontSize: 11 } ),
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.sampleSizePatternStringProperty, { sampleSize: sampleSizeProperty } ), { fontSize: 11 } ),
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.numberOfSamplesPatternStringProperty, { numberOfSamples: numberOfSamplesProperty } ), { fontSize: 11 } )
      ]
    } ), {
      fill: 'white',
      cornerRadius: 3
    } );
    this.chartNode.addChild( label );
  }
}

projectileDataLab.register( 'SamplingHistogramNode', SamplingHistogramNode );