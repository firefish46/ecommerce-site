import Promotion from '../models/promotionModel.js';

// @desc    Get all active promotions
// @route   GET /api/promotions
// @access  Public
export const getPromotions = async (req, res) => {
  const promotions = await Promotion.find({ 
    isActive: true,
    $or: [
      { expiresAt: { $gte: new Date() } }, // Date is in the future
      { expiresAt: { $exists: false } },   // Or no date is set (for Sliders)
      { expiresAt: null }
    ]
  });
  res.json(promotions);
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
export const createPromotion = async (req, res) => {
  // 1. Added expiresAt to the destructuring
  const { title, subtitle, image, link, type, expiresAt } = req.body;

  const promotion = new Promotion({
    title,
    subtitle,
    image,
    link,
    type,
    expiresAt, // 2. Added expiresAt here so it actually saves to DB
  });

  const createdPromotion = await promotion.save();
  res.status(201).json(createdPromotion);
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
export const updatePromotion = async (req, res) => {
  const { title, subtitle, image, link, type, expiresAt } = req.body;
  const promotion = await Promotion.findById(req.params.id);

  if (promotion) {
    promotion.title = title || promotion.title;
    promotion.subtitle = subtitle || promotion.subtitle;
    promotion.image = image || promotion.image;
    promotion.link = link || promotion.link;
    promotion.type = type || promotion.type;
    
    // 3. Improved logic: update expiresAt even if it's a new date string
    if (expiresAt !== undefined) {
        promotion.expiresAt = expiresAt;
    }

    const updatedPromotion = await promotion.save();
    res.json(updatedPromotion);
  } else {
    res.status(404);
    throw new Error('Promotion not found');
  }
};
// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
export const deletePromotion = async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);

  if (promotion) {
    await promotion.deleteOne();
    res.json({ message: 'Promotion removed' });
  } else {
    res.status(404);
    throw new Error('Promotion not found');
  }
};
// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
