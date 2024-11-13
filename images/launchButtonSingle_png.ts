/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAABMCAYAAAC4RkPaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LjE0NjI4OTk3NzcsIDIwMjMvMDYvMjUtMjM6NTc6MTQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZWUxY2VkMGItOGE2Zi00MWM3LWI5NzQtYWQ0MTNiYzNkYmU2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk2QUQ3RTNEODdBRjExRUVBRDM4QkI3NTRGMzAzRjlBIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk2QUQ3RTNDODdBRjExRUVBRDM4QkI3NTRGMzAzRjlBIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMy41IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OENCNzMzMDY0OTdFMTFFREExNDFEQTNDQTQwMTkwODQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OENCNzMzMDc0OTdFMTFFREExNDFEQTNDQTQwMTkwODQiLz4gPC9y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';
export default image;