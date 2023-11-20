// Copyright 2023, University of Colorado Boulder

/**
 * The PDLModel is the base class for all models in Projectile Data Lab (PDL).
 * It contains model elements for the launcher, field, tools, histograms and overlays.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import TModel from '../../../../joist/js/TModel.js';
import projectileDataLab from '../../projectileDataLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PDLConstants from '../PDLConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Field from './Field.js';

type SelfOptions = {
  timeSpeedValues: TimeSpeed[];
  fields: Field[];
};
export type PDLModelOptions = SelfOptions & { tandem: Tandem };

export default class PDLModel implements TModel {

  // Launcher angle is the number of degrees between the launcher and the horizontal axis.
  public readonly launcherAngleProperty: Property<number>;

  // Launcher height is the vertical distance between the launch point and the origin, in field units.
  public readonly launcherHeightProperty: Property<number>;

  // Launcher type is the number of the active launcher, from 1-6
  public readonly launcherTypeProperty: Property<number>;

  // Bin width represents the distance between adjacent field lines. It also affects how data is grouped for the histogram.
  public readonly binWidthProperty: Property<number>;

  // Whether the simulation is playing (animating via the step() function)
  public readonly isPlayingProperty: Property<boolean>;

  // The rate of animation when the simulation is playing
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  public readonly timeSpeedValues: TimeSpeed[];

  public constructor( providedOptions: PDLModelOptions ) {

    this.launcherAngleProperty = new Property<number>( 30, {
      validValues: [ 0, 30, 45, 60 ],
      tandem: Tandem.OPT_OUT
    } );

    this.launcherHeightProperty = new Property<number>( 0, {
      validValues: [ 0, PDLConstants.RAISED_LAUNCHER_HEIGHT ],
      tandem: Tandem.OPT_OUT
    } );

    this.launcherTypeProperty = new Property<number>( 1, {
      validValues: _.range( 1, 7 ),
      tandem: providedOptions.tandem.createTandem( 'launcherTypeProperty' ),
      phetioDocumentation: 'This property configures the active launcher by number.',
      phetioValueType: NumberIO
    } );

    this.binWidthProperty = new Property<number>( 1, {
      validValues: [ 1, 2, 5, 10 ],
      tandem: providedOptions.tandem.createTandem( 'binWidthProperty' ),
      phetioDocumentation: 'This property configures the bin width of the field and histogram.',
      phetioValueType: NumberIO
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: 'This property indicates whether the simulation is playing. When false, the simulation is paused.'
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: providedOptions.timeSpeedValues,
      tandem: providedOptions.tandem.createTandem( 'timeSpeedProperty' ),
      phetioDocumentation: 'This property indicates the rate of animation when the simulation is playing.'
    } );

    this.timeSpeedValues = providedOptions.timeSpeedValues;
  }

  public reset(): void {
    this.launcherAngleProperty.reset();
    this.launcherHeightProperty.reset();
    this.launcherTypeProperty.reset();
    this.binWidthProperty.reset();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();
  }
}
projectileDataLab.register( 'PDLModel', PDLModel );