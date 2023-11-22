// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { ManualConstraint, Rectangle } from '../../../../scenery/js/imports.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { PDLScreenView } from '../../common/view/PDLScreenView.js';
import VSMModel from '../model/VSMModel.js';
import projectileDataLab from '../../projectileDataLab.js';
import VSMAccordionBox from './VSMAccordionBox.js';
import PDLConstants from '../../common/PDLConstants.js';
import SpeedToolNode from './SpeedToolNode.js';
import AngleToolNode from './AngleToolNode.js';

/**
 * ScreenView for the Variability, Sources and Measures (VSM) screens on the Projectile Data Lab sim.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VSMScreenViewOptions = SelfOptions & ScreenViewOptions;

export class VSMScreenView extends PDLScreenView {
  public constructor( model: VSMModel, options: VSMScreenViewOptions ) {
    super( model, options );

    const accordionBox = new VSMAccordionBox(
      new Rectangle( 0, 0, 500, 200, { fill: '#ffcccc' } ), {
        expandedProperty: model.isHistogramShowingProperty,
        binWidthProperty: model.binWidthProperty,
        top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'accordionBox' )
      } );
    this.addChild( accordionBox );

    // Add a heat map tool node
    const speedToolNode = new SpeedToolNode( {
      visibleProperty: model.isLaunchSpeedVisibleProperty,
      sourceDataProperty: model.binWidthProperty
    } );
    this.addChild( speedToolNode );

    const originX = this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X - PDLConstants.FIELD_WIDTH / 2;
    speedToolNode.centerX = originX;
    speedToolNode.top = this.layoutBounds.centerY;

    const angleToolNode = new AngleToolNode( {
      visibleProperty: model.isLaunchAngleVisibleProperty,
      sourceDataProperty: model.binWidthProperty
    } );

    this.addChild( angleToolNode );
    angleToolNode.centerX = originX + 100;
    angleToolNode.bottom = PDLConstants.FIELD_CENTER_Y - 30;

    // Position the time control node so that the play/pause button is centered at the 50-meter mark
    ManualConstraint.create( this, [ accordionBox ], accordionBoxProxy => {
      accordionBoxProxy.centerX = this.layoutBounds.centerX;
    } );
  }
}

projectileDataLab.register( 'VSMScreenView', VSMScreenView );
