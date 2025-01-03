import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { 
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductByIdQuery,useUploadProductImageMutation,


 } from "../../redux/api/productApiSlice"

 import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice"
import { toast } from "react-toastify"
import AdminMenu from "./AdminMenu"



const ProductUpdate = () => {

    const params=useParams()

    const{data:productData}=useGetProductByIdQuery(params._id)


    const [image,setImage]=useState(productData?.image || '')
    const [name,setName]=useState(productData?.name || '')
    const [description,setDescription]=useState(productData?.description || '')
    const [price,setPrice]=useState(productData?.price || '')
    const [category,setCategory]=useState(productData?.category || '')
    const [brand,setBrand]=useState(productData?.brand || '')
    const [countInStock,setStock]=useState(productData?.countInStock || '')
    const [quantity,setQuantity]=useState(productData?.quantity || '')

    const navigate=useNavigate()

    const {data:categories=[]}=useFetchCategoriesQuery()
    const [uploadProductImage]=useUploadProductImageMutation()
    const [updateProduct]=useUpdateProductMutation()
    const [deleteProduct]=useDeleteProductMutation()

    console.log("Categories:", categories);

    useEffect(() => {
        
        if (productData && categories && categories.length > 0) {
            
            console.log("Categories fetched:", categories);
            console.log("Product Data fetched:", productData);
    
         
            setName(productData.name);
            setDescription(productData.description);
            setPrice(productData.price);
    
       
            if (productData.category && productData.category._id) {
                setCategory(productData.category._id);
            }
    
            setBrand(productData.brand);
            setQuantity(productData.quantity);
            setImage(productData.image);
            setStock(productData.countInStock);
    
        }
    }, [productData, categories]);

    console.log("Selected Category:", category);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        try {
          const res = await uploadProductImage(formData).unwrap();
          toast.success("Item added successfully");
          setImage(res.image);
        } catch (err) {
          toast.success("Item added successfully");
        }
      };


      const handleUpdate = async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("name", name);
          formData.append("description", description);
          formData.append("price", price);



           if (!category) {
          toast.error("Category is required");
          return;
        }
        formData.append("category", category);
          formData.append("quantity", quantity);
          formData.append("brand", brand);
          formData.append("countInStock", countInStock);
    
    
          const data = await updateProduct({ productId: params._id, formData });
    
          if (data?.error) {
            toast.error(data.error);
          } else {
            toast.success(`Product successfully updated`);
         
            navigate("/admin/allproductslist");
          }
        } catch (err) {
          console.log(err);
          toast.error("Product update failed. Try again.");
        }
      };  

            const handleDelete=async(req,res)=>{
                try {
                    let answer=window.confirm('Are you sure you want to delete this product?')

                    if(!answer)return;

                    const {data}=await deleteProduct(params._id)
                    toast.success(`Item is deleted`)
                  
                    navigate('/admin/allproductslist')
                  
                } catch (error) {
                    console.log(error);
                    toast.error("Delete Fialed. Try Again...")
                    
                }
            }

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
<AdminMenu/>
                <div className="md:w-3/4 p-3">
                    <div className="h-12">Update Product</div>

                    {image && (
            <div className="text-center">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}
                    <div className="mb-3">
              <label className="text-white  py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {image ? image.name : "Upload image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="text-white"
                />
              </label>
            </div>

                    <div className="p-3">
                        <div className="flex flex-wrap">
                            <div className="one">
                                <label htmlFor="name">Name</label><br />
                                <input type="text" className="p-4 mb-3 w-[30rem] rounded-lg border bg-[#101011] text-white"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="two ml-10">
                                <label htmlFor="name block">Price</label><br />
                                <input type="number" className="p-4 mb-3 w-[30rem] rounded-lg border bg-[#101011] text-white"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>

                        </div>


                        <div className="flex flex-wrap">
                            <div className="three">
                                <label htmlFor="name bloack">Quantity</label><br />
                                <input type="number" className="p-4 mb-3 w-[30rem] rounded-lg border bg-[#101011] text-white"
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                />
                            </div>

                            <div className="four ml-10">
                                <label htmlFor="name block">Brand</label><br />
                                <input type="text" className="p-4 mb-3 w-[30rem] rounded-lg border bg-[#101011] text-white"
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                />
                            </div>


                        </div>


<label htmlFor="" className="my-5">Description</label>
<textarea type="text" className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
value={description}
onChange={(e)=>setDescription(e.target.value)}
></textarea>

<div className="flex justify-between">
    <div>
        <label htmlFor="name bloack">Count In Stock</label><br />
        <input type="text" className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
        value={countInStock}
        onChange={(e)=>setStock(e.target.value)}
        />
    </div>

    <div>
    <label htmlFor="">Category</label><br />

    {categories && categories.length > 0 ? (
        <select
            value={category || ""}  
            onChange={(e) => {
                setCategory(e.target.value);  
                console.log("Selected Category:", e.target.value);
            }}
            className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
        >
            <option value="" disabled>
                Select Category
            </option>
            {categories.map((c) => (
                <option key={c._id} value={c._id}>
                    {c.name}
                </option>
            ))}
        </select>
    ) : (
        <p>Loading categories...</p> 
    )}
</div>
</div>

<div>
<button 
onClick={handleUpdate} 
className="p-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6">Update</button>
<button 
onClick={handleDelete} 
className="p-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600">Delete</button>
</div>

                    </div>
                </div>
            </div>
        </div>
  )
}

export default ProductUpdate