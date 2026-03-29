var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')
let { ConvertTitleToSlug } = require('../utils/titleHandler')
let { getMaxID } = require('../utils/IdHandler')

// Validation middleware cho POST request
const validateProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  
  // Kiểm tra không được để trống
  if (!title || !title.trim()) {
    return res.status(400).send({
      message: "Tiêu đề không được để trống"
    });
  }
  
  if (!description || !description.trim()) {
    return res.status(400).send({
      message: "Mô tả không được để trống"
    });
  }
  
  // Kiểm tra price là số và lớn hơn 0
  if (price === undefined || price === null || price === '') {
    return res.status(400).send({
      message: "Giá không được để trống"
    });
  }
  
  if (isNaN(price) || parseFloat(price) <= 0) {
    return res.status(400).send({
      message: "Giá phải là số dương"
    });
  }
  
  next();
};

//getall with filters
router.get('/', async function (req, res, next) {
  let queries = req.query;
  let titleQ = queries.title ? queries.title : '';
  
  // Validate page và limit
  let page = queries.page ? parseInt(queries.page) : 1;
  let limit = queries.limit ? parseInt(queries.limit) : 10;
  
  if (isNaN(page) || page < 1) {
    return res.status(400).send({
      message: "Page phải là số nguyên dương"
    });
  }
  
  if (isNaN(limit) || limit < 1) {
    return res.status(400).send({
      message: "Limit phải là số nguyên dương"
    });
  }
  
  // Validate minPrice và maxPrice
  let minPrice = queries.minPrice ? parseFloat(queries.minPrice) : 0;
  let maxPrice = queries.maxPrice ? parseFloat(queries.maxPrice) : 1E10;
  
  if (isNaN(minPrice)) {
    return res.status(400).send({
      message: "MinPrice phải là số"
    });
  }
  
  if (isNaN(maxPrice)) {
    return res.status(400).send({
      message: "MaxPrice phải là số"
    });
  }
  
  if (maxPrice < minPrice) {
    return res.status(400).send({
      message: "MaxPrice không được nhỏ hơn minPrice"
    });
  }
  
  try {
    let result = await productModel.find({
      isDeleted: false,
      title: { $regex: titleQ, $options: 'i' },
      price: { $gte: minPrice, $lte: maxPrice }
    });
    
    // Phân trang
    let total = result.length;
    result = result.slice(limit * (page - 1), limit * page);
    
    res.send({
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "Lỗi khi truy vấn sản phẩm"
    });
  }
});
//get by slug (supports partial slug matching)
router.get('/slug/:slug', async function (req, res, next) {
  try {
    let result = await productModel.findOne({ 
      slug: { $regex: '^' + req.params.slug, $options: 'i' },
      isDeleted: false 
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "Slug not found"
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Lỗi khi truy vấn sản phẩm"
    });
  }
});

//get by ID
router.get('/:id', async function (req, res, next) {
  try {
    let result = await productModel.find({ _id: req.params.id });
    if (result.length > 0) {
      res.send(result)
    } else {
      res.status(404).send({
        message: "id not found"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "id not found"
    })
  }
});


router.post('/', validateProduct, async function (req, res, next) {
  try {
    let newItem = new productModel({
      title: req.body.title.trim(),
      slug: ConvertTitleToSlug(req.body.title),
      price: parseFloat(req.body.price),
      description: req.body.description.trim(),
      category: req.body.category || ''
    });
    await newItem.save();
    res.status(201).send({
      message: "Thêm sản phẩm thành công",
      data: newItem
    });
  } catch (error) {
    res.status(500).send({
      message: "Lỗi khi thêm sản phẩm",
      error: error.message
    });
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updateData = req.body;
    
    // Nếu có title, update slug
    if (updateData.title) {
      updateData.slug = ConvertTitleToSlug(updateData.title);
    }
    
    // Validate price nếu được update
    if (updateData.price !== undefined) {
      if (isNaN(updateData.price) || parseFloat(updateData.price) <= 0) {
        return res.status(400).send({
          message: "Giá phải là số dương"
        });
      }
      updateData.price = parseFloat(updateData.price);
    }
    
    let updatedItem = await productModel.findByIdAndUpdate(
      id, updateData, { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).send({
        message: "Sản phẩm không tồn tại"
      });
    }
    
    res.send({
      message: "Cập nhật sản phẩm thành công",
      data: updatedItem
    });
  } catch (error) {
    res.status(500).send({
      message: "Lỗi khi cập nhật sản phẩm"
    });
  }
});
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findByIdAndUpdate(
      id, { isDeleted: true }, { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).send({
        message: "Sản phẩm không tồn tại"
      });
    }
    
    res.send({
      message: "Xóa sản phẩm thành công",
      data: updatedItem
    });
  } catch (error) {
    res.status(500).send({
      message: "Lỗi khi xóa sản phẩm"
    });
  }
});

module.exports = router;
