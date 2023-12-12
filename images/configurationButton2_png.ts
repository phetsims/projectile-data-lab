/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABZCAYAAACzIkPrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAylpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LjE0NjI4OTk3NzcsIDIwMjMvMDYvMjUtMjM6NTc6MTQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyNC43IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNFQ0FBNDBDOTEwNjExRUVBQTRBRDA5MUFEMTEyODYzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNFQ0FBNDBEOTEwNjExRUVBQTRBRDA5MUFEMTEyODYzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjkxMkU2RkY5MTA2MTFFRUFBNEFEMDkxQUQxMTI4NjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjkxMkU3MDA5MTA2MTFFRUFBNEFEMDkxQUQxMTI4NjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7kEv9JAAALlUlEQVR4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';
export default image;