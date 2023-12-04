/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAAB0CAYAAAC2Rg1eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAylpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LjE0NjI4OTk3NzcsIDIwMjMvMDYvMjUtMjM6NTc6MTQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyNC43IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZBMkM0QjA3OEFCNzExRUVBNjg0ODI1Q0Y5OTdGQzAyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZBMkM0QjA4OEFCNzExRUVBNjg0ODI1Q0Y5OTdGQzAyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkEyQzRCMDU4QUI3MTFFRUE2ODQ4MjVDRjk5N0ZDMDIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkEyQzRCMDY4QUI3MTFFRUE2ODQ4MjVDRjk5N0ZDMDIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ATai+AAAWP0lEQVR4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';
export default image;