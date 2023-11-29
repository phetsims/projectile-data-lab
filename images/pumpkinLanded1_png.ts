/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAANCAYAAADMvbwhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAylpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LjE0NjI4OTk3NzcsIDIwMjMvMDYvMjUtMjM6NTc6MTQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg3QjU4M0NFODZFMzExRUVCRTUxREIxNjNCQUMxRTNEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg3QjU4M0NEODZFMzExRUVCRTUxREIxNjNCQUMxRTNEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyNC43IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTQ3MkRCOUM4NkUxMTFFRUJFNTFEQjE2M0JBQzFFM0QiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTQ3MkRCOUQ4NkUxMTFFRUJFNTFEQjE2M0JBQzFFM0QiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XXPBgAAAEoklEQVR42rRVa2wUVRT+5rGzs49utw+2u0thaUFoaYKmKYghGB8YfoiRBBAMIYEIxogmoiKB+AOR+EdUiAIJ8AMJKpWiqESUKFRMeEgLbXm1BaGPbSn76L66Ozszd2Y8KyEhCPhHbzKZe++cfOc753znjIC7Vrm3uHb244+dqRlfvZ729ZquhUdyShj/8xLuvjDBiTaOyQ/5pOllJd56vy+whIepCloqJ3Jw6RYMy4L2XxPh7jyESuXn500LLq91pScHHeLYuO4SD0YDYIIN04I8alwJPZUejPcn1UjfMOs8dD63JZIxTvwjOh4lo9zCBF+RMLbYwXvO9Ko/5HUr9q9EeEBeOCOwa+1rSxcH2HW0R2R4ykMYjkXRG76K0nIfnqwrhhw7CzU5hHiWIeAV0dqrGm8fiL/a0qvusItcZa3fNnPRVPfCWTXOmZUlQmkia6ImIOHFXTc/3dcy8g65yj+QyOsz5T3r1q5e4lfO4dLFyxg39304Lu4EDAYrG8V1uQEh60/owz0QJRlZzcKNlIGqMhFHLivKiGp2TfTZJpa5BWeVX4KlmbAI90pEx6giASrVc1VT/L3GlpH1dxMQBc5TF7AtEOsr+fnL50xZ4i4qRrrjBLjKZynyDij95wGbAzxnQY21QS0VwfMSmAE4bRzdAz1xhunVssNXIj4STTDkiICmGGAmOSADjmws2l8Y1NI/XcztGVsqTl/U4F6RUkymG1aWzoHnprhmnR/QesQ5ddJ8j38CpHgbEiqDJLvBwqfp7YBolwiRgzOXhMhE2GWRkClWcuKUeEqnBZ1ZYHkTBAzTvJ1k2pNdwZT0gm3H01s8Mh9ofjN4tGq0JF0b1BCibAqErSnAuoPDG8T6MfZHwQkQ0n3g7W5Euk4ilh8mEJN1DKSP98T13usxFlGZlTZM5DXDUi36qOiWyXOce/OCsndHewWvTeAwkjdvi5WIARI5+vxU5tKFAa390Er/t1UVNika1aFSaS0irmscvm/N9/3SlftKDHptAUtNQ3AyuJ0ikv2DOYckwOsUnFubU1s7BrRvHqT25m5l9sPj5WdKqA4ZKo3kIBbkZO/v6f69pzObmq/k9zW9XPHjlCr7qHTCwpUbJiaPEQraQGuXiQ0/x9YaBmLcqTXBRKjC480qLLftaGT/1t8yG6aG7E/tXurbSQMjubop/mF0xLwZono6JM6VyZuZ9rD2BwnxGPEwXBI3esZ4eW6NX6ql9FeXu3nu107lGLX2DqpMcuUTnk8+W+p7Q09ZaOk2UOE3UU2CvtBpYtkXQ2+1DOU+/rugq5727r+Z1sPftec2Uzf03o50Qb1r+0cvlL8yxm9DV4+KSUHp1gdCV1QTHxxONm48nFhcIHO/bLntfN2BlwKniwRRauvT47zMzEqvyE5269ca29LbrybUr+9sX+E+YNykCtuKTfPK1jSMs1cXjGhIFbIOmm/I5jk0bOxf1hnRdt93NnCQnDY+aFBq84aVoHNBw+xe80S4FeO9VzxrtjadzX5J5SgKJw3XuR6W6+4zM0NR2K8OGGLbUP5aX4IdeYCEDOqmJDVWivYqPYVfA7uX4V8CDADPQSwwOa4Q7AAAAABJRU5ErkJggg==';
export default image;