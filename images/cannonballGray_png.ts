/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAABGCAQAAAA05UExAAAAwnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBbDsMgDPvPKXYE8gDCcejaSbvBjr9A0qlss4RjYsmEwPF6PuA2QCgguWpppSSDNGnUTWhy9MmYZPKE1PBw7YOUMMhabJX9qtHHs4+fAC/dVL4E6T2MbTWaRL5+BZEXHhMNvUdQiyAmNzACun8rlab1+oXtSCvUDwwSXcf+uVfb3p7tHSY6GDkZMxcfgMcR4G4CJ9tQprJpk7PTIswW8m9PJ+AN8PdZG5Qcs3sAAAEhaUNDUElDQyBwcm9maWxlAAB4nJ2QsUrEUBBFT3ZFRbRSFhSLFLZbmsrCVSEICjGuYLTKJllcTGJIsiz+gX+iH7OFIPgN1grW3hctLEzjwDCHYebeeQ86dhpl1cI+ZHlduv4guAyu7KU3LLr02KQTRlUx8LwTWuPzVdOKl77Rap/7MxbjpIpU58o8KsoarD2xM6sLw0o2bof+ofhBbMdZHoufxDtxFhs2u36WTqMfTXPNapJfnJu+chuXY07xsBkxZUJKTV81V+cIh11Vl5KQeyoi1ZREvZlmam5ElZRcDkRDka5p8dtq/Dy5jKQxkZZxuCOTpvHD/O/32sdZs2n15kVYhk2rq+yMx/D+CGsBrD/DynWL1/Lvt7XMOM3MP9/4BbpWUE3eNTJJAAAOR2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEQTQzNjVDQzhBMDkxMUVFOTBERUQzMTY3MjI5NjBFQiIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmNTM4NTliMi00ZTVmLTQyNTUtOTc1Yy0xZTM0NjViODA2NWYiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmYWEzZGRiYi1kNzIwLTRhYzYtOGEzMS0zMDc0MjMwMTkxZWEiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09Ik1hYyBPUyIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MDQzMjExMjk2MzQzMjUiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zNiIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjAxOjAzVDE1OjMyOjA5LTA3OjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowMTowM1QxNTozMjowOS0wNzowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA4NGUxOWJkLWVhN2YtNDc5OS1hOWJiLTMwY2Q1Y2YxMjMzZiIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChNYWMgT1MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTAxLTAzVDE1OjMyOjA5LTA3OjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICAgPHhtcE1NOkRlcml2ZWRGcm9tCiAgICBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA2OEI3NEZCODZGOTExRUU5NTk3OUU0MURDMDNGNjkxIgogICAgc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNjhCNzRGQTg2RjkxMUVFOTU5NzlFNDFEQzAzRjY5MSIvPgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+Z172FQAAAAJiS0dEAP+Hj8y/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AEDFiAJ7eX21QAAB9FJREFUaN7Fml+MHVUdxz/nzOxul2WbUtuE1iIxLrUxjURpgBp96EMBK2gwIbE20Qg1bUwoaDTRJ30y0RgJGI2BaCyKoqmWGG1pJEQfSqIRjSCgokVaifRPsBR227V3fuPDzDnnd87MnTt3aeNMdu6duTPnfM739+f8ZmZNyQ6WukyRQ8ZyO20tIMzzui0WWFxyi/mSLjLZVWxiYz7HpeQ2txkAJYUdMFh2On/ePs3v5cX5i41jJyau4Ta71a7lUqYsYKvjgKnPyZiAs8zL0clfmp/MP7dY9G/f9DeWXTdxM7u52nqEFMWmV0Aph+XbZx6T43Ihceyc3Z7t5C0OIkWxCkZD1RB/G3xrft/5l+RC4NhVfNzemV0ZFAkwGsVhmOjq0n35y+LXz/1o8XV5Yzh2q/0SmzOTwlS6aBTTYi6nTwlQ8KuzX3z1d529dTuu/TIP8542GIPB+tWQ1Z/pWh3PMJBx0/T+lZ+ZXWJkvZn72RZzBxhqEKeRUeaLTSX+eqFcO/m1yavZ89qr46qz0R5gmz7BtoBVGlXbrNJAaVapEnSzGDB8bGb/zLrxcK61j/BOl0e0oZweVWdVR1W3FktOTqZWS66g3Jlsmd038/b+ONfZh3hb9XOWhHWAMWrMrtvUf5xX5f782qDXzf5g5qp+OBt4kLnmj85rbJKDTQRnImMZ9ReAAGTTzN7Zy0fjrOb7rIdhhgqBXZkA8sg3stqLQkRpTI3H5unvzCwbhfNNNg23qlEaVcdyn3ViEKv8R6sWAW2b/spMJ85nuZXIU9qiKmqy9gftrnE+clAkQAB2Z75jOM5mPq0zkXZjnW1ouHToJFPKVJBGeZy7wit9ycTnZ9e340zyBdZ254N4dAHQqMB3EMaDhURAdKUB2Di1Z8q04ezgFkhNZaOYUpOdT4O0+EUWBX2IKRNCPUw5u5dtaVYDa7g9ViQbPu9GI8w8jIlcOIvysY3wouFlE3uYTXFu5L29CqSo0gnObCLPiXO2UcoQbesc9KHZa2OcN7FruM805y3Tkh7DDJ46uVGDMGpIanB32Vy3/y6u71ETJjoF3wnhbxKYOJJMXJKFtt4/uyH0kLFztJHa9IgxHEyeJEDjzyWqsk3Yy/lkwFkZ6prR2pi07IygjY8Y05jzTEvx6tv6wNSk6+NGZvg/L3Z1vsXh3NxdpEZ3BV4V02LKkhKpP8MV7vpyqKrAcm5wOJvGGYfR5bjvSK8FJUKhjtB+d6EGKuTvniIHNrJiNESpFDCAkFFiKOttdcxQ1ls8SlALv9UD8hpezjoLvINLug0kfk+SMZbeCGWtkdsKEh0TDxYPUrW4ijkLzDHd31SuUVHApUcqKClqGKn3yghdDyFZLuOKHLiiveOiY9YSMsQnNan9yQJF4rpOq1J5mPtVoiFKxpocWJV2Zf22+gx/VZfOU6z/dCOvEl6h4owapvBAMIi0UeZakY/7UMVhFmQeT+qUV4GZKOyJYGIzl5E3CnmWD0mTQyDCntYFCkpMDRPyt3hjBVPh91qCxuTDOxfwCmhzVftZrY9V10g9FRTJTbH2m4E6EuKvUklMPq6RUEYpvbnc+GySiUulkctBhTKURMlUyIdn7dRDiNxZVNfOYwxFi7EC1KCGKZOBeg8qh+DE0RXGHlzR1h5U1qMqVc4uGsmyjGC0geJuc+CVPpNn8B+3X3qFMgbY2q3TByqlV6BUKVNUAhV/xvkzOfCvbpAs0ixEVVCowNbN2pZng5Jk84BQqt8BOJ4DR1hkapjrxvFFlBD1N7xu0jJ/SwQkKisHbTjNsRx4joUmzjCDBQzxWgQTNitqiQI+OK6DCVtOcSQHnmaey4aHtjNYCqQBRIFIo7IRpdFQGIqT/N0C5/jzKG2KRsEhKkhdqaW/l2puD791wCDPOAEebc890vjUjUpSTghFjVLUq/suDey0dipggcecvj/nv931cVMfSYJV1GiHrWWiiTAIefo/HHI4xzg8qh6sxo5qKvhCMMaAQQQwUChlBByZCYHfyGmHM+CB0XcQYb6RhtkkKtyl4UVlpIeonFxUn0VF4KLy1xzpd2tTJMZygseuWqrSSxLTEMHUyx/ksMZ5mftH66OBdKMSzUCSjL+5p/2x3ruX83HOeoR/9AcqGh07z9HeE+/FYIWGeVIOpSn0r136xEDtSGnJkB4ZqGNFpJN8lVPNjL6XJ7qBUoMUDYD2NQZxmchf+1MOtj2yOc49vDZeGe8SXjeSBiEp1+Vl3Ws83+3jodEI0qJYgGqfYgqVIhIHuE/nvPRt3woO9nkO1voaln6+F+3v5zY9jrSV0+ziWD9DSYtnjTJYAvMn7o5FbQ7qKT7Fmb6+Q1vFO2II/oqX2MXR0Rr/gjs52x+I9jJ8SFT6805yB7/t9y70QXK+MfwxSz/v6FxO8AkO9X/5+F3u4ORFexD4T7ZzYLxXsw/zkdFV4pKWJ/gwj4//Hv1xPsjPLjCK8AC38sclvdbnBT7K3f0Cv9fyDLezixNL/C8DYJF7uYnvVdP/G1oWuIdb2Nv1RIA+z5N5lt1s5WB3Q53LgB/zPj7HCyMfEvf+/52c67mLLazoeGTYXM5zike5j6f65QEz5v9+Xcl2buCtrBl533qWf/M8B/ihq2UuBk61rOcaNrCO1axkOdMsq58inGOBM7zCCY7yLE/y4rgN/w+R5Tg3kVT0pwAAAABJRU5ErkJggg==';
export default image;