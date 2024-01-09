// Copyright 2023-2024, University of Colorado Boulder

/**
 * Defines the configuration for the launch height and mean launch angle of the launcher. The launcher can either
 * be angled (30, 45, or 60 degrees) and at ground level, or flat (0 degrees) and raised.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export const LauncherConfigurationValues = [ 'angle30', 'angle45', 'angle60', 'angle0Raised' ] as const;

const meanLaunchAngles = [ 30, 45, 60, 0 ];

// Export a mapping that returns the numerical value of the launcher configuration.
export const AngleForConfiguration = ( configuration: LauncherConfiguration ): number => {
  return meanLaunchAngles[ LauncherConfigurationValues.indexOf( configuration ) ];
};

export type LauncherConfiguration = typeof LauncherConfigurationValues[number];