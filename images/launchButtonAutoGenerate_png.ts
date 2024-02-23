/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAABMCAYAAAC4RkPaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LjE0NjI4OTk3NzcsIDIwMjMvMDYvMjUtMjM6NTc6MTQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZWUxY2VkMGItOGE2Zi00MWM3LWI5NzQtYWQ0MTNiYzNkYmU2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFFNzI5M0Q3QzlDRTExRUU5NkExOEFBMjAyRTcyQzc5IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFFNzI5M0Q2QzlDRTExRUU5NkExOEFBMjAyRTcyQzc5IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMy41IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTZBRDdFMzg4N0FGMTFFRUFEMzhCQjc1NEYzMDNGOUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTZBRDdFMzk4N0FGMTFFRUFEMzhCQjc1NEYzMDNGOUEiLz4gPC9y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';
export default image;