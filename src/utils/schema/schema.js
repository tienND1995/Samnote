import Joi from 'joi'

export const schemaGroup = Joi.object({
 groupName: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not group name yet!',
 }),

 desc: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not description yet!',
 }),

 members: Joi.array().min(1).required().messages({
  'array.min': 'At least 1 member!',
 }),
 linkAvatar: Joi.string().base64().required().messages({
  'string.empty': 'Not avatar yet!',
 }),
})
