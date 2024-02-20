// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import HistogramData from './HistogramData.js';
import { Property, TReadOnlyProperty } from '../../../../axon/js/imports.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import generalBoundaryBoop_mp3 from '../../../sounds/generalBoundaryBoop_mp3.js';
import Utils from '../../../../dot/js/Utils.js';

/**
 * The HistogramSonifier class is used to manage the sounds for the histogram in the Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

const BIN_SOUND_DURATION = 0.06;

const binSoundClip = new SoundClip( generalBoundaryBoop_mp3, { initialOutputLevel: 1 } );
soundManager.addSoundGenerator( binSoundClip );

export default class HistogramSonifier {

  // The bin that is currently being sonified
  public readonly sonifiedBinProperty: Property<number | null> = new Property<number | null>( null );

  // The sorted data from the left to the rightmost bin
  private binnedData = new Map<number, HistogramData[]>();

  // An array of the map keys for binnedData in ascending order
  private sortedBins: number[] = [];

  // The index of the current bin being sonified
  private currentBinIndex = 0;

  // The time remaining for sonifying the current bin
  private timeRemainingInCurrentBin = 0;

  public constructor( private binWidthProperty: TReadOnlyProperty<number> ) {

    // When the bin width changes, stop playing the sound
    binWidthProperty.link( () => {
      this.sonifiedBinProperty.value = null;
    } );

    // This plays a tone for each bin, with the pitch corresponding to the number of projectiles in the bin
    this.sonifiedBinProperty.link( sonifiedBin => {
      if ( sonifiedBin !== null ) {
        const sonifiedBinData = this.binnedData.get( sonifiedBin )!;
        const binHeight = sonifiedBinData.length;

        binSoundClip.setPlaybackRate( this.playbackRateForBinHeight( binHeight ) );
        binSoundClip.play();
      }
    } );
  }

  // Set the histogram data, which is used to determine the sonification
  public setHistogramData( data: HistogramData[] ): void {

    const binnedData = new Map<number, HistogramData[]>();
    const binWidth = this.binWidthProperty.value;

    for ( let i = 0; i < data.length; i++ ) {
      const projectile = data[ i ];

      // Calculate the bin for this value by its lower bound
      const bin = Math.floor( projectile.x / binWidth ) * binWidth;

      // Make sure there is an array object in this column, otherwise create one
      if ( !binnedData.has( bin ) ) {
        binnedData.set( bin, [] );
      }

      // Get the array for that column
      const column = binnedData.get( bin )!;
      column.push( projectile );
    }

    this.binnedData = binnedData;
    this.sortedBins = Array.from( this.binnedData.keys() ).sort( ( a, b ) => a - b );

    // If the data changes, stop playing the sound
    this.sonifiedBinProperty.value = null;
  }

  // Initiate the sequence of sounds for the histogram bins
  public startHistogramSoundSequence(): void {

    // If binned data is empty, don't play anything
    if ( this.binnedData.size === 0 ) {
      return;
    }

    this.currentBinIndex = 0;
    this.timeRemainingInCurrentBin = BIN_SOUND_DURATION * this.binWidthProperty.value;

    this.sonifiedBinProperty.value = this.sortedBins[ this.currentBinIndex ];
  }

  public step( dt: number ): void {

    if ( this.sonifiedBinProperty.value !== null ) {

      this.timeRemainingInCurrentBin -= dt;

      if ( this.timeRemainingInCurrentBin <= 0 ) {
        this.currentBinIndex++;

        this.timeRemainingInCurrentBin = BIN_SOUND_DURATION * this.binWidthProperty.value;


        // If we went past the edge of the bins, stop playing
        if ( this.currentBinIndex >= this.binnedData.size ) {
          this.sonifiedBinProperty.value = null;
        }
        else {
          this.sonifiedBinProperty.value = this.sortedBins[ this.currentBinIndex ];
        }
      }
    }
  }

  // Maps the height of the bin to the playback rate of the sound
  private playbackRateForBinHeight = ( binHeight: number ): number => {
    return Utils.linear( 0, 500, 0.4, 4, binHeight );
  };
}

projectileDataLab.register( 'HistogramSonifier', HistogramSonifier );