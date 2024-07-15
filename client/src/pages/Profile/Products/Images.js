import { Button, Upload, message } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { UploadProductImage , EditProduct} from '../../../apicalls/products';

function Images({
    selectedProduct,
    setShowProductForm,
    getData
}) {
    const [showPreview = false, setShowPreview] = React.useState(true);
    const [file = null ,setfile] = useState(null);
    const [images = [], setImages] = React.useState(selectedProduct.images);
    const dispatch = useDispatch();

    const upload = async () => {
        try {
            dispatch(SetLoader(true));
            const formData = new FormData();
            formData.append("file", file);
            formData.append("productId", selectedProduct._id);
            const response = await UploadProductImage(formData);
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                setImages([...images, response.data]);
                setShowPreview(false);
                setfile(null);
                getData();
            } else {
                message.error(response.message);
            }
        } catch(error){
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }
    
  const deleteImage = async (image) => {
    try {
      const updatedImagesArray = images.filter((img) => img !== image);
      const updatedProduct = { ...selectedProduct, images: updatedImagesArray };
      const response = await EditProduct(selectedProduct._id, updatedProduct);
      if (response.success) {
        message.success(response.message);
        setImages(updatedImagesArray);
        setfile(null);
        getData();
      } else {
        throw new Error(response.message);
      }

      dispatch(SetLoader(true));
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  return (
    <div>
        <div className="flex gap-5 mb-5">
        {images.map((image) => {
          return (
            <div className="flex gap-2 border border-solid border-gray-500 rounded p-2 items-end">
              <img className="h-20 w-20 object-cover" src={image} alt="" />
              <i
                className="ri-delete-bin-line"
                onClick={() => deleteImage(image)}
              ></i>
            </div>
          );
        })}
      </div>
      <Upload
       listType='picture'
       beforeUpload={()=>false} 
        onChange={(info)=>{
            setfile(info.file);
            setShowPreview(true);
        }}
        fileList={file ? [file] : []}
        showUploadList={showPreview}
        >
        <Button type='Dashed'>Upload Image </Button>
      </Upload>
      <div className="flex justify-end gap-5 my-5">
        <Button type='default'
            onClick={()=>{
                setShowProductForm(false);
            }}>
            Cancel
        </Button>
        <Button type='primary'
        disabled={!file}
            onClick={upload}
        >
            Upload
        </Button>
      </div>
    </div>
  )
}

export default Images;
