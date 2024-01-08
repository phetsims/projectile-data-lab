TODO implementation overview

### Scenes

This simulation has a notion of scenes where each scene contains its own state data. The scenes in this simulation are
called `Field`s. The models that contain `Field[]` also provide `DynamicProperty` to present the value of the selected
Field.

### Enumeration patterns

For simulation-specific enumerations, we use the string literal union pattern. See LauncherConfiguration.ts for an
example.

### Disposal

Everything in the simulation is statically allocated and there is no need for disposal.

### Strings

The string keys are designed as a camel-cased version of the English translation as of the 1.0 release. For example:

```json
"binWidthMPattern": {
    "value": "{{binWidth}} m"
  }
```

Note that if the English strings are changed after 1.0, the keys will not be updated.

### Inner classes

For this simulation, for trivial classes that are only used by one class, we sometimes use inner classes. For example, search for
`class MeasuringTapeIconNode`.  This allows us to keep code co-located with where it is used, without proliferating
files, and to have a usage site like `new MeasuringTapeIconNode()`.
