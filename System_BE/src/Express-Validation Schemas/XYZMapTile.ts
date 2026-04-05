const XYZMapTileSchema = {
  z: {
    in: ['params'] as any,
    isFloat: true, 
    exists: true, 
  }, 
  x: {
    in: ['params'] as any,
    isFloat: true, 
    exists: true, 
  }, 
  y: {
    in: ['params'] as any,
    isFloat: true, 
    exists: true, 
  }, 
}

export default XYZMapTileSchema;