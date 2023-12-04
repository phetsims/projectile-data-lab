// Copyright 2023, University of Colorado Boulder

import { NodeOptions } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import TProperty from '../../../../axon/js/TProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LauncherNode from '../../common/view/LauncherNode.js';
import { CustomLauncherType } from '../model/CustomLauncherType.js';

/**
 * The CustomLauncherNode is the visual representation of the customizable launcher. It contains a barrel, frame and a stand.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type CustomLauncherNodeOptions = SelfOptions & NodeOptions;

export default class CustomLauncherNode extends LauncherNode {

  public constructor( modelViewTransform: ModelViewTransform2,
                      launcherAngleProperty: TProperty<number>,
                      launcherHeightProperty: TProperty<number>,
                      isLauncherCustomProperty: TProperty<boolean>,
                      presetLauncherProperty: TProperty<number>,
                      customLauncherTypeProperty: TProperty<CustomLauncherType>,
                      angleStabilizerProperty: TProperty<number>,
                      providedOptions: CustomLauncherNodeOptions ) {

    super( modelViewTransform, launcherAngleProperty, launcherHeightProperty, presetLauncherProperty, providedOptions );
  }

}

projectileDataLab.register( 'CustomLauncherNode', CustomLauncherNode );