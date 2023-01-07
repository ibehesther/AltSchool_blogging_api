const Joi = require("joi");

const blogSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required(),
    description: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required(),
    body: Joi.string()
        .min(1)
        .trim()
        .required(),
    state: Joi.string()
        .valid("draft", "published")
        .default("draft"),
    tags: Joi.array()
        .items(Joi.string())
        .default([])
});

const updateBlogSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(255)
        .trim(),
    description: Joi.string()
        .min(1)
        .max(255)
        .trim(),
    body: Joi.string()
        .min(1)
        .trim(),
    state: Joi.string()
        .valid("draft", "published")
        .trim(),
    tags: Joi.array()
        .items(Joi.string())
}) 



exports.validateCreateBlog = async(data, req, res, next) => {
    const { title, description, tags, body } = req.body;
    try{
        if(!data.type){
            const user = data
            const validInput = await blogSchema.validateAsync({ title, description, tags, body });
            next({user, validInput});
            return
        }
        next(data);
        return
    }catch(err){
        err.type = "bad request"
        next(err);
    }
}

exports.validateUpdateBlog = async(data, req, res, next) => {
        const { title, description, body, state, tags } = req.body;
        try{
             if(!data.type){
                const user = data
                const validInput = await updateBlogSchema.validateAsync({title, description, body, state, tags});
                next({user, validInput});
                return
             }
            next(data);
            return
        }catch(err){
             err.type = "bad request"
             next(err);
        }
}