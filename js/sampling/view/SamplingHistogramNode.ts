// Copyright 2024, University of Colorado Boulder

import HistogramNode, { HistogramNodeOptions } from '../../common/view/HistogramNode.js';
import projectileDataLab from '../../projectileDataLab.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import Property from '../../../../axon/js/Property.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import { ColorProperty, HBox, ManualConstraint, Node, VBox } from '../../../../scenery/js/imports.js';
import { PDLPanel } from '../../common/view/PDLPanel.js';
import PDLText from '../../common/view/PDLText.js';
import SamplingField from '../model/SamplingField.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

import { MysteryLauncherIcon } from '../../common/view/MysteryLauncherIcon.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';

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
                      clearCurrentField: () => void,
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

    const iconNode = new Node();
    launcherProperty.link( launcher => {
      iconNode.children = [ new MysteryLauncherIcon( launcher ) ];
    } );
    const textVBox = new VBox( {
      align: 'left',
      children: [
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.launcherPatternStringProperty, { launcher: launcherProperty } ), { fontSize: 11 } ),
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.sampleSizePatternStringProperty, { sampleSize: sampleSizeProperty } ), { fontSize: 11 } ),
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.numberOfSamplesPatternStringProperty, { numberOfSamples: numberOfSamplesProperty } ), { fontSize: 11 } )
      ]
    } );
    iconNode.maxHeight = textVBox.height;
    const label = new PDLPanel( new HBox( {
      spacing: 5,
      children: [ iconNode, textVBox ]
    } ), {
      fill: 'white',
      cornerRadius: 0
    } );
    this.chartNode.addChild( label );

    // Create the eraser button
    const eraserButton = new EraserButton( {
      iconWidth: 27,
      listener: clearCurrentField,
      tandem: options.tandem.createTandem( 'eraserButton' )
    } );

    this.chartNode.addChild( eraserButton );

    ManualConstraint.create( this, [ eraserButton, this.chartBackground ], ( eraserButton, chartBackground ) => {
      eraserButton.right = chartBackground.right - 3;
      eraserButton.top = chartBackground.top + 3;
    } );
  }
}

projectileDataLab.register( 'SamplingHistogramNode', SamplingHistogramNode );