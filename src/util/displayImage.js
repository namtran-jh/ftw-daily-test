export const displayMainImage = (mainImage, allImages) => {
  if (mainImage.length === 0) return [];
  else {
    return allImages.filter(img => {
      const checkSameUUID = (ele) => {
        if (typeof ele === "string" && typeof img.id === "object") return img.id.uuid === ele;
        if (typeof ele === "string" && typeof img.id === "string") return img.imageId.uuid === ele;

        if (Object.keys(img).length < 3 || Object.keys(ele).length < 3) return [];

        if (typeof img.id === "string" && typeof ele.id === "string") return img.imageId.uuid === ele.imageId.uuid;
        if (typeof img.id === "object" && typeof ele.id === "object") return img.id.uuid === ele.id.uuid;
        if (typeof img.id === "string" && typeof ele.id === "object") return img.imageId.uuid === ele.id.uuid;
        if (typeof img.id === "object" && typeof ele.id === "string") return img.id.uuid === ele.imageId.uuid;
      }

      const neededImage = mainImage.find(checkSameUUID);
      return !!neededImage;
    })
  }
}

export const displayOtherImage = (mainImage, allImages) => {
  if (mainImage.length === 0) return allImages;
  else {
    return allImages.filter(img => {
      const checkSameUUID = (ele) => {
        if (typeof ele === "string" && typeof img.id === "object") return img.id.uuid === ele;
        if (typeof ele === "string" && typeof img.id === "string") return img.imageId.uuid === ele;

        if (Object.keys(img).length < 3 || Object.keys(ele).length < 3) return undefined;

        if (typeof img.id === "string" && typeof ele.id === "string") return img.imageId.uuid === ele.imageId.uuid;
        if (typeof img.id === "object" && typeof ele.id === "object") return img.id.uuid === ele.id.uuid;
        if (typeof img.id === "string" && typeof ele.id === "object") return img.imageId.uuid === ele.id.uuid;
        if (typeof img.id === "object" && typeof ele.id === "string") return img.id.uuid === ele.imageId.uuid;
      }

      const neededImage = mainImage.find(checkSameUUID);
      return !neededImage;
    })
  }
}
