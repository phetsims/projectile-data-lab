# Overview

This simulation enables exploration of both mathematical and statistical principles, through the backdrop of the
familiar
"projectile motion" context, with randomly generated data. The simulation introduces random initial conditions in the
launch angle and speed, and shows the distribution of the resulting projectile distances. The simulation features
statistical elements such as mean, standard deviation, and the sampling distribution. The data can be viewed in a
histogram or analyzed with various tools.

## Physical Model

In the absence of air resistance, the simulation ensures that the projectiles follow perfect parabolic paths, allowing
for analytical computation. The motion of these projectiles is characterized by their initial position (`y_0`), launch
angle (`theta`), initial velocity (`v_0`), and the time they spend airborne. The equations governing this motion are:

- For vertical motion: `y = y_0 + v_0 * sin(theta) * t - 1/2 * g * t^2`
- For horizontal motion: `x = v_0 * cos(theta) * t`

where `g` represents the acceleration due to gravity, and `t` denotes time. where \(g\) represents the acceleration due
to gravity, and \(t\) denotes time.

Through interactive exploration, users gain insights into how variables such as launch speed and angle affect projectile
motion. The simulation's tools facilitate both visual and numerical analyses, enhancing the understanding of how
randomness and variability play crucial roles in physical phenomena.

## Statistical Model

The simulation employs Gaussian distributions to generate random data. The initial launch speed and angle are subject to
gaussian randomness (depending on the launcher characteristics). The simulation can be used to show that the aggregation
of multiple Gaussian sources might not result in a Gaussian distribution. This introduces users to the complexity of
real-world data generation and the importance of understanding statistical properties in analyzing data.

By incorporating statistical analyses such as calculating the mean (average distance of projectiles), standard
deviation (variation in distances), and sampling (examining different "samples" of projectile launches), the simulation
bridges the gap between theoretical physics and applied statistics.