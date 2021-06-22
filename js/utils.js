export const minMax = (value, min, message) => 
!value.split(" ").reduce((acc, char) => !acc ? char.length > min : true, "") ? message : true;