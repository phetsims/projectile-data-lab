/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAeAAAWIwAICAgREREZGRkZIiIiKioqMzMzMzs7O0RERExMTExVVVVdXV1mZmZmbm5ud3d3gICAgIiIiJGRkZmZmZmioqKqqqqzs7Ozu7u7xMTEzMzMzNXV1d3d3ebm5ubu7u739/f///8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAabQgAAOAAAFiMS1KdpAAAAAAD/+0DEAAAHSB05VPEAMXoPK/c1gAIAASik0HtwVCAGGA7gYy9m4QhxLYdDJE0UcGIPxGD78Hz+Iw/4nD/4P//lHf8u8ED5QEJR3KBj//WHwAALd9vd///hQAAAAADLmRCGNRlZac7oaM0NAKciIP24soCwZnJfYOCBcSRCAhrtNGWagPTrgpoTgPHZhtZ0ngajg+3TX2z57vwLBNHENVKtytN0cvoopDkHUlJazmUABu3HZQACqv/7QsQEAkoQq1tdpIA5IRerqYMJ/yNPQFQ6BJBcODIc2Htb+HYNjcvp45SWBwSCyBGjfhRGXxRjl5pNimKoBDCcFYZ/vy7/e8nJ6IGahJiepKQ8IZP/anB1x7w+GaapNyGXZ+uls54BcpSUCeJi9SHHcU+01t43Jp8FUDE1JlDQi0IfddnqQCkFkTB0p8zG8/edXfNuS8O0i1fJz+lyqgzhbyttBiUApyAAxcATjw8MJjQcERogLP/7QsQIggq4dUZuZGXZQpcqaaSN5mOjmecYRIfaaHEtQulXyEl3mNvPAEdd6nfuKz1JKYhZieVsM7LEBRY+5pTByzQ6CURT98x+g+ejSDCVOH9f+peAH7/+8aYpNxsAz7Y5s47wQ3zkwQkiKlQWyVlLQ17ts05sjpNIiMgaEZLyVlCqyscdFdHXQao1JpEpVhkkG7Zqv4KJ58JRKnkMRaT4bHCUx5iVRez9ygAG6TclgAMwwzRCCf/7QsQGAgmIjV1MpMV5URip3aygNtQMqwO4EgKAsHgfE4fJXAmMqLRA3SaEKEHL9GKXfKWJT5mHNqKutv83mVZaGd3zF2UzcuPPFVDDsMFP6I+/zn9GSm4hAaYiBYAFPWeaJYdKaFAjLWfDjMmPtiiMZd6s/wFCfgIQ6FDCIJig5IHIKH6uXFakw8VV1OHZvUVyMmYPNNJeMpIe+1ZTfOYTVXV8jPu0//7qAAFJr+AOnTC06b8wyv/7QsQGggnck08saMHxUhToTcyMss/zUy4dAgvswoote27XnkfCHPgN7IhqITDzBw1QQFkjzau0nK8gZSUwxe74n2TOfdbqzXoXmn6kk6DRqFjTxmef3ApuCgGHQUaQQ5i9ZGGiiYCgRhkvHn6aU4EDiCcRdZmibc43GTRmHXGk0XinL3AIhICQdWKYWDPYqGBC4jHwhxlQiDAlUl1z1Usr8BUQhU8TCbv//TUAFr0nJWKH4AOzqf/7QsQFgAlUu1VMMGfxMRKoWcSNr1UKDJUezZ0w6hQTMJDNSclNedlq71G3DsqrN2nwPRutJq6HZiID/PIV1RZNyHPZ5QTQ9chUvVpA7jMYc7///0gBJqADC5OMGHk1lRzUSVMWg4zmEhQTgoKGAga7qBBKtjq/ZwdSIA68lJi9RgRzPH2Gpzz9QMv35ZerrkefHUpshWY3l4/fCXcOd0rKAkt0AGCwsZvQZnWGmUDKffAwuDE38f/7QsQLAAi8gUDOZMN5FI/o5aYNnmasdl0xEnAp4RRU8ABEtdk093MdY0nOpVEPc+4Tete8ekfWZWG6ObhCtxcfXvR9ugBU03+AUBuoJsuJ9zhlQCs6OKJCu07MigO2ZgbiCwJFFGDAwLOnz2nixylQEiUhuiAWCmLF3csiCEI0CcUcGZBQIaHUagAE3JJLdaAA4BocABmwT9tIXrk1mYBAKz0cHQqRn5THAZulVx1af6vjcdZ2q//7QMQWgAjcl1msMMnxGQwmTc0YaEtNLi5kFmIzwxuMxS2zETWp930n49UlKOfWC5RQAZFVhvclmcpkdGiZuoZ8pINFDAIwg8SjpDtu0/UBKNMcXigRGhIHaQMXg5Tvlup4jo27tJqRVgkSGhhGeFAcOos/9VUAGaynGEAFNDStMy00NpO0Eg6SJ+LmZLLW5IovOmJLRbByYtnTUbR28Ytr3YaKDJ0hDFD4TB4OG9dQ4sYsl8Hu//tCxCAACKSLQ02wbPEJj+dlzAx2FLHO7/WAAMI3UABhUYVOpjkVHWzgRDNY1ooIl8tdGhQEv1sb80cWncXav1ghMpDJkzOjkxD3DHxUYuBeeFxGOw9Tdb3U/6aVAAJZbgAMJggw1EiQLnKBMZrAkCJrEwaKIVAU5h+mZRKGkxNy34vTk2NP0iEKsseyfkp8dpes6Pv3/qP9mQ21/+omqwmX4AENc/YABAgwtYFVY7PAEoASAy+p//tCxC0ACLSHOS5kw7kUDqdlt5jmeoLUWhBUrIzIBEnQ2lCXxDskVhQcWPUk56WkmaMmryNSojrpen79YLuARJwGkfruUgWrQwAkMzVaCMMhk0bYTiiUzMMCAxdSheEHuu0xmMOM4bW8VYAAaVRh6Rgc5Jdw6tlAuDc/7HwwCmmh+om3/9mUASSkQHAVBGZgPhrBbGUMuewlIyZpBhYVTZpN6w+r2Rt714HgX0/Ka3e31G5NO8nK//tCxDiACCBlMs5sw3EWDaYdzCRuRfnT8/NGgnTdLhYa0iaR3///+n/+ugABZSbAEAMLGjTd0JDTYFg65RNgUBuShe1+LNrUHyuOiIlWKo7IxUWrW3WMhY1PyfoJebnO6FC1b7/TD4CcotNf///9ymq8AmEhkZuGb1ucdagZ8EFD4JYIjNzaOy1c9JSs4k7OcOR/oDXgt6TnMBClVg+OoOGMyQjFnefr/39akpoAgECUyqCzyY1N//tCxEYDCKBvNU3pgvDyDCXJzAx26tI4VrzCxAMDl48jOiAVBIthgCEwx/WSxePvcoEZsVGkkDYZjxq+acc9XUzTXjmHf/9n////8xT+j/WcEhMCAzMJznXCNhwQ6Dmh7CcYyYwuCAyirZ3nXqudaszhoFTAUNiyRPJHBJf7FzzQcjiou6hn5VCN1Wzf////pgQAABjEscDEWxDMlBDLnqzHQ0RGM5iSfoEWQO4kWj2FwQ212Krx//tCxFYCCKRlJG5hBTECiKTdzSRmdKgSQQisKBzCIOGxCAAEVFQy///////////6tYAr/pOOS7g5AIyB6/BUKgsmEAkrl4tytvu8zixW/ANO3QCgoMzdJZBW28LHXWOlk11UzmGrH9n8n/0f//+r/ZUBAMASaj/c258k25Wo2gZI7kAcypGUw8DcxVIcwWA8xzCgwVBIwBBCTjAGw20Ji7zeSXwNUioYGDrr9yKhlod3/X+r/+vr//tCxGQACEQ5HG7gxRD9B6ZqtJAGQ3Y/X/7fURSrb930kAMQSW4bbmuXQnho2HMFjGNyDG/qcGUh2hQAnDMIhBBICIhGAwJF3mZskpgwDWrr7RKwpYk/cfjsxALOU40ZkLP4nN+K/zbb+e6v5H+7+j+7qRsVARcmHMJtMpVJmCCmltgaDJRkABGSwcYHGICBgcSREB0QCQEoXKid5tnYZEQOCsMlyE8CggESx4ZPJoGXEFf6PN3f//tAxHQACkQ9KHnWEhFMiCNPOsACX/702////9QALF/5p4M5gJTBgmJxq8kx4dJ7RRqmRlQRsTRgBpEjLWy8u8u5od91cBuaIkVXUTxNECjAUvclivR85//j3tGfwOcGgE3pqZoR//vVAJcm/NTfE0PWz20LOImQ4OqDG4SMgCMPmN+ZQDBc+TKyKOu1iTA0u4akTSmSxFCI12Fc5i3dKwiKpKb67P12a6yTPu/+Tf/yFn/8IAH/+0LEcYMJPDUUfcSAES2Hok3dJGpN3fmnoDmAyEncobmcwfHwiEVA2hY8toRkXMKo4wZMeDlv0gHqgS0rKqB9ZQLjswqsQDL5asygLpJkqLOs6vRQ2ia/iH9L24ors+EKf/9yABUu/NyG/NbtWNdX+MnSbMiTjMCA1OPMzUjIFNIAEFoBRI1nT7w6lzGndVii15wcKWLhKBGoGzSQo2KzVer/syZZH5vbV4CVOKsbZrPrRtpc39r/+0LEd4MJfEcObmklUT8Ioc3dJHJJv1AAFy7G5auH25JHYP6bIfx39Fm7U0ajVRpUUmakGcXGIUCwgHH4CDj0rT6h9ZanLwL1bC6zrTO8Y/9+vcq5AwAHiDo/zv9X9X/Z9v+//+kAIQDg0QP41Qk83cP4xRKY7C4NDDTWBEED5BUKnDUg8c+QYBDUQdxtHappY/cH5Sz+dq1yKzTSC7fXs/6E6P///+1n7mgFubfmH4QZXYJly/D/+0LEeoMKtEcMbuTFkTmI4I3eaBImHmZVmZ1PwhnJDzOHHgGKCxSKbAWlg6yJAtNpCGX2ooVSGhMEyRHR0Pxav/r6cwVZdb1//7/T//7KAAAGwPnn82Prj8+iNXX80vLAaTzCxsMBk0yrPxCK4IERFKjBY4OiQWOPCadg1GDHnjEMfU6chiMBWf/////r1f//2AJy7/nlnKeqvJvOCGCEceZ2DRZoAZjiIMCJoNeYqXpn0Iw0Kxr/+0LEeYMIlD0Kbu8iUReGoQ3MpJoUkg03Ny6FlnBVG7xnlvT+lOM9aCjb6d3/579f+1CqAGk5LtgPHwD0PAENYKGGBE1hE9ZyKAIUFjB6SEgdrRVCFAJLWbnddH1s+OZ+UWlEx116E/jwSJQPzidKjaocDNY8TYY2TmTg14JNYWAgiFg1DJxmwLmaXQDpcKHXuJluKCMahejv/8x+r////8j/a79V/9UlRwAA6sJzL4wKnoMkAw7/+0LEhQMIXEkAbmGGkQ6HYM3NJGINW0ESNLO1H4GV8DAV0UPVx0aOITq1Oe+1FPDCPatvtJUlgANBTDQ3s/KjM2DQNJFlEQyYaBQqgydQExmsRNMAmns7+39/l/9s1esLPJD5lkdar0IAABgpZQAAEqGM04dGclRvvp2CEBnAEi4TJRMYNXiYEbFmF39nYfUtA1F/d6BqS0wtiMSbiePMXAwX4WsA4rmBa32zl8JAtMV6cAkiQyL/+0LEkoIGsCUW7WDCsPmGII3dpGJfeRNaTz5MQU1FqqoAAAk5bQADCB6OLhcBHjglTgDDQliIMs9Jl3GVyeTye26V2TOxdr2sJLDHMZgq0dfjmjL8DBNxLT3rSDKdtMUoUzQSDiRMMkgM9+Bki2g1JwkOTIZmO24sZsGsBhEtV/5kiroWCB+HDA+ZQCGFDlEzLKZjg8ERhPpzWyX9BcbAAPnxKM9Z0MkF/M9QEASIhgMAKebBgcX/+0DEqYMF2CkIbmmBMM+RYQ22CN4IpQVigICdt5H8h607NmCksYmRLlmyTtredPR6L9lIAp+sjkuSgiXN+snrSAIVSzEtFKFFySXfa244ojzKw+J4DcJMANrSUcDMOhJMicSk5OriQgWQCGIhRqTTEKtEaFeU00yKk1qSFR1pqEyq2xI/NpY2vDqtS4e4new0xIaSw2qzXr29/9f3f08lTEFNRTMuOTkuNQAAS5Ld/sAAZGcdc//7QsTIgkWYJQtN5SCwnAPhXbwwRucNkpFYdYFVCMoLaC5CRNozRYSG5aXRYhvFZpxMFhUBc5AqoIXYZ5p5GSqxF2qhJCtwgSTZGKf+OAAACUlu1oAB5tIfOUG9ib0qGSb6w6wqpYeFy46TapTGJc1pcoCUsmqlGc9cThOcJQ+mWHisoLh1WLie17sFUrrzmPfaPKZPzzsAODdg687YTEFNRaqqAABK6yAAA+y1o41/U0WJgODUzP/7QsTsgkdUcwFOaEFxBZJfacwMZ7N4xFEUxAHIDDEeykNTOpLxERTpwhANhKKQGkFWDZWVmAWgdO2HSmIp8DMCR4ISV1KACOS2XW4uj2Kp6POhXuVWRK/7D89OjdNrjHtVzMgMDvtjLKDBhBCMBo0qhUx1omwtCMkDI3HcCxnQQT2huS4AKleBkmmBNbVGScfTVS0fQQR8X7qIG5daADjl++2wAkp/y1mWxAZhPBe9BdCSPiOQ3f/7QsT/ggmsiuhu6MUxXhBfdcykHmMsCyzMzmBV8SQYQlK+QrIhKcpvpeqOJRcbIw57r7NQ/EVQA7irAhk09gH5MSvgxm3u65zSLP////5j19f+3/Qe3nxTHJLoBRhQJA+YW+PqHmPFmzjuGT40GlbDGz49GJ4cmSgWmEIIkZJlThaVJAxh0OLuAkQtE15eTLmdO25VLEonTR2M2YZlEZxxtWtX7tL9WeT9oK/o//t/////+nrqAP/7QsT5AAiYdvutaSCxQJEdtbywHq2qgDZQIqc1b4t9MUeEVTEkges6rg4zsHM3JiI0rDIWJjbuc7yFNwPwUmmaphgoao8CQBaaKTAmrrthhQJdz9lzVLmdQNEaS/WprdNU2CmyxQlRAAbOXXbG92hL5nugmaZCmIBGSgDkJhw4ckfKmJ+OkG0niZtAhrw4mWSQCMjYDeQCdFsGcjeqBP3KJ9yZRD0Rp4duXaKm+tdu2fCtQpZMQf/7QsT8gkqYbM1O4YahHQvaJd0wX01FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqv/7QsT/gAskat2uYYXxgIvUAf7kWKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7QMTzgEpASpMP92JJOwnNYf5gkaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//tCxK6DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;