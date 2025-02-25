export const generateFieldLotCode = (
    fieldCode?: string,
    cultivo?: string,
    period?: string,
    year?: string | number
): string => {
    let codeString = '';
    
    // Add field code if exists
    if (fieldCode) {
        const parts = fieldCode.split('_');
        const fieldCodeFormatted = parts.map((part, index) => 
            index === 0 ? part[0] : part.slice(0, 4)
        ).join('_');
        codeString = fieldCodeFormatted;
    }
    
    // Add cultivo code if exists
    if (cultivo) {
        const cultivoCode = cultivo[0];
        codeString = codeString ? `${codeString}_${cultivoCode}` : cultivoCode;
    }
    
    // Add period code if exists
    if (period) {
        const periodCode = period[0];
        codeString = codeString ? `${codeString}_${periodCode}` : periodCode;
    }
    
    // Add year code if exists
    if (year) {
        const yearCode = year.toString().slice(-2);
        codeString = codeString ? `${codeString}_${yearCode}` : yearCode;
    }
    
    return codeString;
}; 