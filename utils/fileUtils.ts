
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is a data URI: "data:image/jpeg;base64,...."
      // We need to split it to get the raw base64 part and the mimeType
      const parts = result.split(',');
      if (parts.length !== 2) {
        return reject(new Error("Invalid data URI format"));
      }
      const mimeTypePart = parts[0].split(':')[1].split(';')[0];
      const base64 = parts[1];
      resolve({ base64, mimeType: mimeTypePart });
    };
    reader.onerror = (error) => reject(error);
  });
};
