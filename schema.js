const Joi=require("joi");

const listingSchema=Joi.object({
  listing: Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    images:Joi.string().allow("",null),
    location:Joi.string().required(),
    price:Joi.number().min(0).required(),
    country:Joi.string().required()
  })

});

module.exports=listingSchema;
