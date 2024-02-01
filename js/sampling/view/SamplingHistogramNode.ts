// Copyright 2024, University of Colorado Boulder

import HistogramNode, { HistogramNodeOptions } from '../../common/view/HistogramNode.js';
import projectileDataLab from '../../projectileDataLab.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import Property from '../../../../axon/js/Property.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import { HBox, ManualConstraint, Node, VBox } from '../../../../scenery/js/imports.js';
import { PDLPanel } from '../../common/view/PDLPanel.js';
import PDLText from '../../common/view/PDLText.js';
import SamplingField from '../model/SamplingField.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

import { MysteryLauncherIcon } from '../../common/view/MysteryLauncherIcon.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import PDLColors from '../../common/PDLColors.js';
import PDLConstants from '../../common/PDLConstants.js';
import Launcher from '../../common/model/Launcher.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

/**
 * The SamplingHistogramNode shows the histogram for a sampling field, extending the standard HistogramNode and adding
 * Sampling-screen-specific elements.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class SamplingHistogramNode extends HistogramNode {
  public constructor( launcherProperty: TReadOnlyProperty<Launcher>,
                      sampleSizeProperty: TReadOnlyProperty<number>,
                      numberOfSamplesProperty: TReadOnlyProperty<number>,
                      fieldProperty: TReadOnlyProperty<SamplingField>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: Property<HistogramRepresentation>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
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
      selectedBinWidthProperty,
      selectedTotalBinsProperty,
      comboBoxParent,
      PDLColors.meanMarkerFillProperty,
      PDLColors.meanMarkerStrokeProperty,
      options
    );

    const iconNode = new Node();
    launcherProperty.link( launcher => {
      iconNode.children = [ new MysteryLauncherIcon( launcher ) ];
    } );

    const launcherNumberProperty = new DerivedProperty( [ launcherProperty ], launcher => launcher.launcherNumber );

    const textVBox = new VBox( {

      // Prevent from overlapping with the majority of the data in ?stringTest=long
      maxWidth: 240,

      align: 'left',
      children: [
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.launcherPatternStringProperty,
          { launcher: launcherNumberProperty } ), { font: PDLConstants.SELECTOR_FONT } ),
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.sampleSizePatternStringProperty,
          { sampleSize: sampleSizeProperty } ), { font: PDLConstants.SELECTOR_FONT } ),
        new PDLText( new PatternStringProperty( ProjectileDataLabStrings.numberOfSamplesPatternStringProperty,
          { numberOfSamples: numberOfSamplesProperty } ), { font: PDLConstants.SELECTOR_FONT } )
      ]
    } );
    iconNode.maxHeight = textVBox.height;

    const textPanel = new PDLPanel( new HBox( {
      spacing: 5,
      children: [ iconNode, textVBox ]
    } ), {
      fill: 'white',
      cornerRadius: 5
    } );
    this.chartNode.addChild( textPanel );

    // Create the eraser button
    const eraserButton = new EraserButton( {
      iconWidth: 27,
      listener: clearCurrentField,
      tandem: options.tandem.createTandem( 'eraserButton' ),
      phetioFeatured: true
    } );

    this.chartNode.addChild( eraserButton );

    ManualConstraint.create( this, [ textPanel, this.chartBackground ], ( textPanelProxy, chartBackgroundProxy ) => {
      textPanelProxy.left = chartBackgroundProxy.left + PDLConstants.HISTOGRAM_PANEL_MARGIN;
      textPanelProxy.top = chartBackgroundProxy.top + PDLConstants.HISTOGRAM_PANEL_MARGIN;
    } );

    ManualConstraint.create( this, [ eraserButton, this.chartBackground ], ( eraserButtonProxy, chartBackgroundProxy ) => {
      eraserButtonProxy.right = chartBackgroundProxy.right - PDLConstants.HISTOGRAM_PANEL_MARGIN;
      eraserButtonProxy.top = chartBackgroundProxy.top + PDLConstants.HISTOGRAM_PANEL_MARGIN;
    } );
  }
}

projectileDataLab.register( 'SamplingHistogramNode', SamplingHistogramNode );