TODO implementation overview

### Scenes

This simulation has a notion of scenes where each scene contains its own state data. The scenes in this simulation are
called `Field`s. The models that contain `Field[]` also provide `DynamicProperty` to present the value of the selected
Field.

### Enumeration patterns

For simulation-specific enumerations, we use the string literal union pattern. See LauncherConfiguration.ts for an
example.