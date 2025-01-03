import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";


const createCategory=asyncHandler(async(req,res)=>{
    try {
        const {name}=req.body
      

        if(!name){
            res.json({error:"Name is required"})
        }
        
const existingCategory=await Category.findOne({name})

if(existingCategory){
   return res.json({error:"Already exist"})
}

const category=await new Category({name}).save()
res.json(category)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
})



const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;

        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return res.status(404).json({ error: "Category Not found" });
        }

        const existingCategory = await Category.findOne({ name, _id: { $ne: categoryId } });
        if (existingCategory) {
            return res.status(400).json({ error: "Category name already exists" });
        }

        category.name = name

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



const removeCategory=asyncHandler(async(req,res)=>{

    try {

        const { categoryId } = req.params
        
        if (!categoryId || categoryId === 'undefined') {
            return res.status(400).json({ error: "Invalid category ID" });
        }

        const removed = await Category.findByIdAndDelete(categoryId);
res.json(removed)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }



})



const listCategory=asyncHandler(async(req,res)=>{

try {
    
const all= await Category.find({})
res.json(all)

} catch (error) {
    console.log(error)
        res.status(400).json(error.message)
}

})

const readCategory=asyncHandler(async(req,res)=>{
    try {
        
const category= await Category.findOne({_id:req.params.id})
res.json(category)

    } catch (error) {
        console.log(error)
        res.status(400).json(error.message)
    }
})
export {createCategory,updateCategory,removeCategory,listCategory,readCategory}