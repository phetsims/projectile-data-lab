// Copyright 2023, University of Colorado Boulder

import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
export type VSMFieldOptions = SelfOptions & FieldOptions;

export default class VSMField extends Field {

  public constructor( providedOptions: VSMFieldOptions ) {
    super( providedOptions );
  }

  public override reset(): void {
    super.reset();
    this.launcherConfigurationProperty.reset();
    this.projectileTypeProperty.reset();
  }
}

projectileDataLab.register( 'VSMField', VSMField );